from enum import Enum
from typing import List, Dict, Optional
from fastapi import HTTPException, status, Depends
from auth import get_current_user
from jose import jwt, JWTError
import os
from utils.audit import log_action

class Permission(str, Enum):
    # Employee Management
    EMPLOYEE_CREATE = "employee.create"
    EMPLOYEE_VIEW = "employee.view"
    EMPLOYEE_UPDATE = "employee.update"
    EMPLOYEE_DELETE = "employee.delete"
    EMPLOYEE_EXPORT = "employee.export"
    
    # Attendance Management
    ATTENDANCE_MARK = "attendance.mark"
    ATTENDANCE_VIEW = "attendance.view"
    ATTENDANCE_EDIT = "attendance.edit"
    ATTENDANCE_APPROVE = "attendance.approve"
    ATTENDANCE_DELETE = "attendance.delete"
    
    # Leave Management
    LEAVE_APPLY = "leave.apply"
    LEAVE_VIEW = "leave.view"
    LEAVE_APPROVE = "leave.approve"
    LEAVE_REJECT = "leave.reject"
    LEAVE_CONFIGURE = "leave.configure"
    LEAVE_DELETE = "leave.delete"
    
    # Payroll Management
    PAYROLL_PROCESS = "payroll.process"
    PAYROLL_VIEW = "payroll.view"
    PAYROLL_EDIT = "payroll.edit"
    PAYROLL_EXPORT = "payroll.export"
    PAYROLL_DELETE = "payroll.delete"
    
    # Recruitment & ATS
    RECRUITMENT_MANAGE = "recruitment.manage"
    RECRUITMENT_INTERVIEW = "recruitment.interview"
    
    # Performance Management
    PERFORMANCE_MANAGE = "performance.manage"
    PERFORMANCE_REVIEW = "performance.review"
    PERFORMANCE_VIEW_SELF = "performance.view_self"
    
    # Asset Management
    ASSET_MANAGE = "asset.manage"
    ASSET_VIEW = "asset.view"
    
    # Help Desk
    TICKET_CREATE = "ticket.create"
    TICKET_MANAGE = "ticket.manage"
    
    # Reports & Analytics
    REPORTS_VIEW = "reports.view"
    REPORTS_EXPORT = "reports.export"
    
    # Workflow & Settings
    WORKFLOW_MANAGE = "workflow.manage"
    SETTINGS_MANAGE = "settings.manage"

# Default Role Permissions
ROLE_PERMISSIONS: Dict[str, List[Permission]] = {
    "super_admin": [p for p in Permission],
    "hr_admin": [
        Permission.EMPLOYEE_CREATE, Permission.EMPLOYEE_VIEW, Permission.EMPLOYEE_UPDATE, Permission.EMPLOYEE_DELETE, Permission.EMPLOYEE_EXPORT,
        Permission.ATTENDANCE_MARK, Permission.ATTENDANCE_VIEW, Permission.ATTENDANCE_EDIT, Permission.ATTENDANCE_APPROVE,
        Permission.LEAVE_APPLY, Permission.LEAVE_VIEW, Permission.LEAVE_APPROVE, Permission.LEAVE_REJECT, Permission.LEAVE_CONFIGURE,
        Permission.PAYROLL_PROCESS, Permission.PAYROLL_VIEW, Permission.PAYROLL_EDIT, Permission.PAYROLL_EXPORT,
        Permission.RECRUITMENT_MANAGE, Permission.RECRUITMENT_INTERVIEW,
        Permission.PERFORMANCE_MANAGE, Permission.PERFORMANCE_REVIEW,
        Permission.ASSET_MANAGE, Permission.ASSET_VIEW,
        Permission.TICKET_MANAGE,
        Permission.REPORTS_VIEW, Permission.REPORTS_EXPORT,
        Permission.WORKFLOW_MANAGE, Permission.SETTINGS_MANAGE
    ],
    "admin": [
        Permission.EMPLOYEE_CREATE, Permission.EMPLOYEE_VIEW, Permission.EMPLOYEE_UPDATE, Permission.EMPLOYEE_DELETE, Permission.EMPLOYEE_EXPORT,
        Permission.ATTENDANCE_MARK, Permission.ATTENDANCE_VIEW, Permission.ATTENDANCE_EDIT, Permission.ATTENDANCE_APPROVE,
        Permission.LEAVE_APPLY, Permission.LEAVE_VIEW, Permission.LEAVE_APPROVE, Permission.LEAVE_REJECT, Permission.LEAVE_CONFIGURE,
        Permission.PAYROLL_PROCESS, Permission.PAYROLL_VIEW, Permission.PAYROLL_EDIT, Permission.PAYROLL_EXPORT,
        Permission.RECRUITMENT_MANAGE, Permission.RECRUITMENT_INTERVIEW,
        Permission.PERFORMANCE_MANAGE, Permission.PERFORMANCE_REVIEW,
        Permission.ASSET_MANAGE, Permission.ASSET_VIEW,
        Permission.TICKET_MANAGE,
        Permission.REPORTS_VIEW, Permission.REPORTS_EXPORT,
        Permission.WORKFLOW_MANAGE, Permission.SETTINGS_MANAGE
    ],
    "manager": [
        Permission.EMPLOYEE_VIEW,
        Permission.ATTENDANCE_MARK, Permission.ATTENDANCE_VIEW, Permission.ATTENDANCE_APPROVE,
        Permission.LEAVE_APPLY, Permission.LEAVE_VIEW, Permission.LEAVE_APPROVE, Permission.LEAVE_REJECT,
        Permission.RECRUITMENT_INTERVIEW,
        Permission.PERFORMANCE_REVIEW,
        Permission.ASSET_VIEW,
        Permission.TICKET_CREATE,
        Permission.REPORTS_VIEW
    ],
    "employee": [
        Permission.ATTENDANCE_MARK, Permission.ATTENDANCE_VIEW,
        Permission.LEAVE_APPLY, Permission.LEAVE_VIEW,
        Permission.PERFORMANCE_VIEW_SELF,
        Permission.ASSET_VIEW,
        Permission.TICKET_CREATE,
        Permission.PAYROLL_VIEW # Can view own payslips
    ]
}

# Authorization Logic
SECRET_KEY = os.getenv("SECRET_KEY", "your-python-secret-key")
ALGORITHM = "HS256"

class PermissionChecker:
    def __init__(self, required_permission: str):
        self.required_permission = required_permission

    async def __call__(self, user: dict = Depends(get_current_user)):
        # Note: user is expected to be provided by get_current_user dependency
        # We will update auth.py to provide the full user object including permissions
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not authenticated",
            )
        
        user_permissions = user.get("permissions", [])
        
        # Super Admin bypass
        if "super_admin" == user.get("role"):
            return True

        if self.required_permission not in user_permissions:
            await log_action(
                user_id=user.get("id"),
                email=user.get("email"),
                action="unauthorized_access_attempt",
                module=self.required_permission.split(".")[0],
                status="denied",
                details=f"Required permission: {self.required_permission}"
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Missing permission: {self.required_permission}",
            )
        
        return True

async def get_resource_filter(user: dict, module: str, context_org_id: Optional[str] = None):
    """
    Returns a MongoDB filter based on organization_id and user role.
    Ensures that users can only access data belonging to their organization.
    """
    role = user.get("role")
    user_id = user.get("id")
    org_id = user.get("organization_id")
    
    # Super Admin (Platform Owner) bypass
    if role == "super_admin":
        # If context_org_id is provided and valid, filter for that org, otherwise return everything
        if context_org_id and context_org_id not in ["null", "undefined"]:
            return {"organization_id": context_org_id}
        return {}

    # Base filter: Must belong to the same organization
    base_filter = {"organization_id": org_id}
    
    if role == "hr_admin":
        # Organization Admin can see everything in their organization
        return base_filter
        
    if role == "manager":
        # Managers can see their own data and their team's data within the organization
        if module in ["employee", "attendance", "leave", "performance", "task"]:
            return {
                "organization_id": org_id,
                "$or": [
                    {"manager_id": user_id}, 
                    {"manager": user_id}, 
                    {"id": user_id}, 
                    {"employeeId": user_id}
                ]
            }
        return {"organization_id": org_id, "id": user_id}
        
    if role == "employee":
        # Employees can only see their own data within the organization
        if module == "employee":
            return {"organization_id": org_id, "id": user_id}
        if module in ["attendance", "leave", "payroll", "performance", "task"]:
            # Note: different modules use different fields for user identification
            id_fields = ["employeeId", "id", "user_id"]
            return {
                "organization_id": org_id,
                "$or": [{"employeeId": user_id}, {"id": user_id}, {"user_id": user_id}]
            }
        return {"organization_id": org_id, "id": user_id}
        
    return {"id": "none"} # Default deny
