import os
import sys
from dotenv import load_dotenv
load_dotenv()
sys.path.append(os.path.dirname(os.path.realpath(__file__)))

from fastapi import FastAPI, HTTPException, Depends, status, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from database import db, init_db
from auth import get_password_hash, verify_password, create_access_token, get_current_user
from utils.permissions import Permission, PermissionChecker, get_resource_filter
import uuid
from datetime import datetime

from fastapi.responses import JSONResponse
import logging
import traceback

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    await init_db()
    yield
    # Shutdown logic (if any)

app = FastAPI(title="DMS HRMS API", lifespan=lifespan)

from routes import super_admin
app.include_router(super_admin.router)

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception: {exc}")
    logger.error(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc), "traceback": traceback.format_exc()},
    )

# Middleware configurations

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Welcome to DMS HRMS API",
        "health_check": "/api/health",
        "docs": "/docs"
    }

@app.get("/api/health")
async def health_check():
    try:
        # Check if database is accessible
        count = await db.users.count_documents({})
        return {"status": "healthy", "db_connected": True, "users_count": count}
    except Exception as e:
        import os
        return {
            "status": "unhealthy", 
            "error": str(e),
            "using_localhost": "localhost" in os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        }

# Models
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str
    company_name: Optional[str] = None # Required for hr_admin

class EmployeeModel(BaseModel):
    name: str
    email: EmailStr
    phone: str
    department: str
    designation: str
    manager: Optional[str] = ""
    joinDate: str
    status: str = "active"
    location: str = ""
    type: str = "full_time"
    salary: float = 0.0
    skills: List[str] = []
    avatar: Optional[str] = ""
    createAccount: bool = False

class UserLogin(BaseModel):
    email: str
    password: str
    role: str

class AttendanceModel(BaseModel):
    employeeId: str
    date: str
    checkIn: Optional[str] = None
    checkOut: Optional[str] = None
    status: str = "present"
    totalHours: float = 0.0
    location: Optional[str] = None
    ipAddress: Optional[str] = None
    notes: Optional[str] = None



# Auth Routes
@app.post("/api/auth/register")
async def register(user: UserRegister):
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_dict = user.dict()
    company_name = user_dict.pop("company_name", "My Company")
    
    # If registering as HR Admin, create a new organization
    if user.role == "hr_admin":
        org_id = f"org_{str(uuid.uuid4())[:8]}"
        await db.organizations.insert_one({
            "id": org_id,
            "company_name": company_name,
            "created_at": datetime.utcnow()
        })
        user_dict["organization_id"] = org_id
    elif user.role == "super_admin":
        user_dict["organization_id"] = None
    else:
        # For managers/employees, they should be created by an admin
        # But if self-registering, we'd need an invite system.
        # For now, default to a shared demo org or error out.
        user_dict["organization_id"] = "org_demo"

    user_dict["hashed_password"] = get_password_hash(user_dict.pop("password"))
    user_dict["id"] = str(uuid.uuid4())
    user_dict["created_at"] = datetime.utcnow()
    
    await db.users.insert_one(user_dict)
    
    org_id = user_dict.get("organization_id", "org_demo")
    token = create_access_token({"sub": user.email, "role": user.role, "org": org_id})
    
    # Remove _id to avoid serialization error
    if "_id" in user_dict:
        del user_dict["_id"]
        
    return {
        "user": {
            "id": user_dict["id"],
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "organization_id": user_dict["organization_id"],
            "avatar": f"https://ui-avatars.com/api/?name={user.name}&background=random",
            "department": "General",
            "designation": user.role.capitalize()
        },
        "token": token
    }

@app.post("/api/auth/login")
async def login(credentials: UserLogin):
    logger.info(f"Login attempt for email: {credentials.email}, role: {credentials.role}, password_length: {len(credentials.password)}")
    
    email_lower = credentials.email.lower()
    user = await db.users.find_one({"email": email_lower})
    
    if not user:
        logger.warning(f"Login failed: User not found for email {credentials.email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    if not verify_password(credentials.password, user["hashed_password"]):
        logger.warning(f"Login failed: Password mismatch for {credentials.email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if credentials.role != user["role"]:
        logger.warning(f"Login failed: Role mismatch for {credentials.email}. Provided: {credentials.role}, DB: {user['role']}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Fetch organization details
    org_details = {"name": "DMS HRMS"}
    if user.get("organization_id"):
        org_doc = await db.organizations.find_one({"id": user["organization_id"]})
        if org_doc:
            org_details = {
                "company_name": org_doc.get("company_name", "DMS HRMS"),
                "id": org_doc.get("id"),
                "logo": org_doc.get("logo", ""),
                "website": org_doc.get("website", ""),
                "address": org_doc.get("address", ""),
                "city": org_doc.get("city", ""),
                "state": org_doc.get("state", ""),
                "country": org_doc.get("country", ""),
                "zip_code": org_doc.get("zip_code", ""),
                "registration_number": org_doc.get("registration_number", ""),
                "tax_id": org_doc.get("tax_id", ""),
                "phone": org_doc.get("phone", ""),
                "email": org_doc.get("email", "")
            }
    
    logger.info(f"Login successful for {credentials.email}")
    token = create_access_token({"sub": user["email"], "role": user["role"], "org": user.get("organization_id")})
    
    return {
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
            "organization_id": user.get("organization_id"),
            "organization": org_details,
            "avatar": user.get("avatar", f"https://ui-avatars.com/api/?name={user['name']}&background=random"),
            "department": user.get("department", "General"),
            "designation": user.get("designation", user["role"].capitalize())
        },
        "token": token
    }

@app.post("/api/user/profile-image")
async def update_profile_image(
    data: Dict[str, str],
    current_user: dict = Depends(get_current_user)
):
    avatar_url = data.get("avatar")
    if not avatar_url:
        raise HTTPException(status_code=400, detail="Avatar URL/Base64 required")
        
    await db.users.update_one(
        {"email": current_user["email"]},
        {"$set": {"avatar": avatar_url}}
    )
    
    return {"message": "Profile image updated successfully", "avatar": avatar_url}

@app.post("/api/user/profile")
async def update_profile(
    updates: Dict[str, Any],
    current_user: dict = Depends(get_current_user)
):
    # Only allow certain fields to be updated
    allowed_fields = ["name", "phone", "location", "department", "designation"]
    clean_updates = {k: v for k, v in updates.items() if k in allowed_fields}
    
    if not clean_updates:
        return {"message": "No valid fields to update"}
        
    # Update user
    await db.users.update_one(
        {"email": current_user["email"]},
        {"$set": clean_updates}
    )
    
    # Sync with employee record if exists
    await db.employees.update_one(
        {"email": current_user["email"]},
        {"$set": clean_updates}
    )
    
    return {"message": "Profile updated successfully"}

@app.post("/api/organization/profile")
async def update_organization_profile(
    updates: Dict[str, Any],
    current_user: dict = Depends(get_current_user),
    authorized: bool = Depends(PermissionChecker(Permission.SETTINGS_MANAGE))
):
    if not current_user.get("organization_id"):
        raise HTTPException(status_code=403, detail="Platform owners cannot update organization profiles this way.")
        
    # Only allow certain fields
    allowed_fields = [
        "company_name", "website", "address", "city", "state", "country", 
        "registration_number", "tax_id", "phone", "email", "zip_code"
    ]
    clean_updates = {k: v for k, v in updates.items() if k in allowed_fields}
    
    await db.organizations.update_one(
        {"id": current_user["organization_id"]},
        {"$set": clean_updates}
    )
    
    return {"message": "Organization profile updated successfully"}

@app.post("/api/organization/logo")
async def upload_organization_logo(
    data: Dict[str, str],
    current_user: dict = Depends(get_current_user),
    authorized: bool = Depends(PermissionChecker(Permission.SETTINGS_MANAGE))
):
    logo_base64 = data.get("logo")
    if not logo_base64:
        raise HTTPException(status_code=400, detail="Logo data is required")
        
    if not current_user.get("organization_id"):
        raise HTTPException(status_code=403, detail="Access denied")

    await db.organizations.update_one(
        {"id": current_user["organization_id"]},
        {"$set": {"logo": logo_base64}}
    )
    
    return {"message": "Organization logo updated successfully", "logo": logo_base64}

@app.post("/api/user/change-password")
async def change_password(
    data: Dict[str, str],
    current_user: dict = Depends(get_current_user)
):
    current_pw = data.get("current")
    new_pw = data.get("newPw")
    
    if not current_pw or not new_pw:
        raise HTTPException(status_code=400, detail="Missing password fields")
        
    user = await db.users.find_one({"email": current_user["email"]})
    if not verify_password(current_pw, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Current password incorrect")
        
    await db.users.update_one(
        {"email": current_user["email"]},
        {"$set": {"hashed_password": get_password_hash(new_pw)}}
    )
    
    return {"message": "Password updated successfully"}

# Settings Routes
@app.get("/api/settings")
async def get_settings(current_user: dict = Depends(get_current_user)):
    org_id = current_user.get("organization_id")
    
    # If super_admin, they manage the "platform" settings (org_id is None)
    # Otherwise, they manage their specific organization's settings
    query = {"organization_id": org_id}
    
    settings = await db.settings.find_one(query, {"_id": 0})
    
    # Default settings if none found
    if not settings:
        return {
            "primary_color": "#6366F1",
            "font_family": "Inter",
            "layout": "Modern",
            "gps_attendance": False,
            "auto_gen_id": True,
            "session_timeout": True
        }
        
    return settings

@app.post("/api/settings")
async def update_settings(
    updates: Dict[str, Any],
    current_user: dict = Depends(get_current_user),
    authorized: bool = Depends(PermissionChecker(Permission.SETTINGS_MANAGE))
):
    org_id = current_user.get("organization_id")
    
    # Allow super_admin to update global settings (org_id is None)
    updates["organization_id"] = org_id
    await db.settings.update_one(
        {"organization_id": org_id}, 
        {"$set": updates}, 
        upsert=True
    )
    return {"message": "Settings updated"}

# HR Data Routes
@app.get("/api/employees")
async def get_employees(
    current_user: dict = Depends(get_current_user),
    authorized: bool = Depends(PermissionChecker(Permission.EMPLOYEE_VIEW)),
    org_context: Optional[str] = Header(None, alias="X-Organization-Context")
):
    query = await get_resource_filter(current_user, "employee", context_org_id=org_context)
    employees = await db.employees.find(query, {"_id": 0}).to_list(length=1000)
    return employees

@app.post("/api/employees")
async def add_employee(
    employee: EmployeeModel,
    current_user: dict = Depends(get_current_user),
    authorized: bool = Depends(PermissionChecker(Permission.EMPLOYEE_CREATE))
):
    emp_dict = employee.dict()
    create_account = emp_dict.pop("createAccount", False)
    org_id = current_user.get("organization_id")
    if not org_id:
        raise HTTPException(status_code=403, detail="Organization ID required")
    
    # Get settings for THIS organization to check auto_gen_id
    settings = await db.settings.find_one({"organization_id": org_id}, {"_id": 0})
    auto_gen_id = settings.get("auto_gen_id", True) if settings else True
    
    emp_dict["id"] = f"e{int(datetime.utcnow().timestamp())}{str(uuid.uuid4())[:4]}"
    emp_dict["organization_id"] = org_id
    
    if auto_gen_id:
        # Generate employee ID by finding the max numeric ID in the current org
        last_emp = await db.employees.find(
            {"organization_id": org_id, "employeeId": {"$regex": "^DMS\\d{3}$"}},
            {"employeeId": 1}
        ).sort("employeeId", -1).limit(1).to_list(1)
        
        if last_emp:
            last_id = last_emp[0]["employeeId"]
            next_num = int(last_id.replace("DMS", "")) + 1
            emp_dict["employeeId"] = f"DMS{str(next_num).zfill(3)}"
        else:
            emp_dict["employeeId"] = "DMS001"
    else:
        if not emp_dict.get("employeeId"):
            emp_dict["employeeId"] = f"EXT{int(datetime.utcnow().timestamp())}"
            
    await db.employees.insert_one(emp_dict)
    
    user_dict = {
        "id": str(uuid.uuid4()),
        "name": employee.name,
        "email": employee.email,
        "hashed_password": get_password_hash("password123"),
        "role": "manager" if any(x in employee.designation.lower() for x in ["manager", "director", "lead", "head"]) else "employee",
        "organization_id": org_id,
        "department": employee.department,
        "designation": employee.designation,
        "created_at": datetime.utcnow()
    }
    await db.users.delete_many({"email": employee.email})
    await db.users.insert_one(user_dict)
        
    if "_id" in emp_dict:
        del emp_dict["_id"]
    return emp_dict

@app.post("/api/employees/bulk")
async def bulk_import_employees(
    employees: List[EmployeeModel],
    current_user: dict = Depends(get_current_user),
    authorized: bool = Depends(PermissionChecker(Permission.EMPLOYEE_CREATE))
):
    if not employees:
        return {"message": "No employees to import"}
    
    org_id = current_user.get("organization_id")
    if not org_id:
        raise HTTPException(status_code=403, detail="Organization ID required")
    
    # Find the current maximum employee ID number for this org
    last_emp = await db.employees.find(
        {"organization_id": org_id, "employeeId": {"$regex": "^DMS\\d{3}$"}},
        {"employeeId": 1}
    ).sort("employeeId", -1).limit(1).to_list(1)
    
    start_num = 1
    if last_emp:
        start_num = int(last_emp[0]["employeeId"].replace("DMS", "")) + 1
    
    prepared_employees = []
    for i, emp in enumerate(employees):
        emp_dict = emp.dict()
        emp_dict["id"] = f"e{int(datetime.utcnow().timestamp())}{i}{str(uuid.uuid4())[:4]}"
        emp_dict["organization_id"] = org_id
        emp_dict["employeeId"] = f"DMS{str(start_num + i).zfill(3)}"
        prepared_employees.append(emp_dict)
    
    if prepared_employees:
        await db.employees.insert_many(prepared_employees)
        
        # Auto-create user accounts for bulk imported employees
        prepared_users = []
        emails_to_delete = []
        for i, emp in enumerate(employees):
            emails_to_delete.append(emp.email)
            prepared_users.append({
                "id": str(uuid.uuid4()),
                "name": emp.name,
                "email": emp.email,
                "hashed_password": get_password_hash("password123"),
                "role": "manager" if any(x in emp.designation.lower() for x in ["manager", "director", "lead", "head"]) else "employee",
                "organization_id": org_id,
                "department": emp.department,
                "designation": emp.designation,
                "created_at": datetime.utcnow()
            })
            
        if prepared_users:
            await db.users.delete_many({"email": {"$in": emails_to_delete}})
            await db.users.insert_many(prepared_users)
    
    return {"message": f"Successfully imported {len(prepared_employees)} employees"}

@app.post("/api/employees/update/{id}")
async def update_employee(
    id: str, 
    updates: Dict[str, Any],
    current_user: dict = Depends(get_current_user),
    authorized: bool = Depends(PermissionChecker(Permission.EMPLOYEE_UPDATE))
):
    updates.pop("_id", None)
    updates.pop("id", None)
    updates.pop("organization_id", None)
    
    org_id = current_user.get("organization_id")
    result = await db.employees.update_one(
        {"id": id, "organization_id": org_id}, 
        {"$set": updates}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found or access denied")
    return {"message": "Employee updated successfully"}

@app.delete("/api/employees/{id}")
async def delete_employee(
    id: str,
    current_user: dict = Depends(get_current_user),
    authorized: bool = Depends(PermissionChecker(Permission.EMPLOYEE_DELETE))
):
    org_id = current_user.get("organization_id")
    result = await db.employees.delete_one({"id": id, "organization_id": org_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found or access denied")
    return {"message": "Employee deleted successfully"}

@app.post("/api/attendance")
async def add_attendance(
    attendance: AttendanceModel,
    current_user: dict = Depends(get_current_user),
    authorized: bool = Depends(PermissionChecker(Permission.ATTENDANCE_MARK))
):
    att_dict = attendance.dict()
    att_dict["id"] = str(uuid.uuid4())
    org_id = current_user.get("organization_id")
    if not org_id:
        raise HTTPException(status_code=403, detail="Organization ID required")
    att_dict["organization_id"] = org_id
    att_dict["created_at"] = datetime.utcnow()
    await db.attendance.insert_one(att_dict)
    return {"message": "Attendance recorded"}

@app.get("/api/attendance")
async def get_attendance(
    current_user: dict = Depends(get_current_user),
    authorized: bool = Depends(PermissionChecker(Permission.ATTENDANCE_VIEW)),
    org_context: Optional[str] = Header(None, alias="X-Organization-Context")
):
    query = await get_resource_filter(current_user, "attendance", context_org_id=org_context)
    attendance = await db.attendance.find(query, {"_id": 0}).to_list(length=100)
    return attendance

@app.get("/api/leaves")
async def get_leaves(
    current_user: dict = Depends(get_current_user),
    authorized: bool = Depends(PermissionChecker(Permission.LEAVE_VIEW)),
    org_context: Optional[str] = Header(None, alias="X-Organization-Context")
):
    query = await get_resource_filter(current_user, "leave", context_org_id=org_context)
    leaves = await db.leaves.find(query, {"_id": 0}).to_list(length=100)
    return leaves

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
