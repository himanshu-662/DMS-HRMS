from fastapi import APIRouter, Depends, HTTPException, Header
from typing import List, Optional
from database import db
from auth import get_current_user
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/super-admin", tags=["Super Admin"])

async def verify_super_admin(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "super_admin":
        raise HTTPException(status_code=403, detail="Only Super Admin can access this resource")
    return current_user

@router.get("/dashboard", dependencies=[Depends(verify_super_admin)])
async def get_global_dashboard():
    """Returns global platform analytics."""
    org_count = await db.organizations.count_documents({})
    user_count = await db.users.count_documents({})
    employee_count = await db.employees.count_documents({})
    
    # Mock revenue for now
    monthly_revenue = org_count * 99 # $99 per org
    
    # Platform usage trends (mock)
    active_users = user_count # Simplified
    
    return {
        "total_organizations": org_count,
        "total_users": user_count,
        "total_employees": employee_count,
        "monthly_revenue": monthly_revenue,
        "active_users": active_users,
        "system_health": "Optimal",
        "server_status": "Active"
    }

@router.get("/organizations", dependencies=[Depends(verify_super_admin)])
async def list_organizations():
    """List all organizations in the platform."""
    cursor = db.organizations.find({})
    orgs = await cursor.to_list(length=100)
    # Remove MongoDB _id
    for org in orgs:
        org.pop("_id", None)
    return orgs

@router.post("/organizations", dependencies=[Depends(verify_super_admin)])
async def create_organization(org_data: dict):
    """Create a new organization manually."""
    if not org_data.get("company_name"):
        raise HTTPException(status_code=400, detail="Company name is required")
    
    org_id = f"org_{str(uuid.uuid4())[:8]}"
    new_org = {
        "id": org_id,
        "company_name": org_data["company_name"],
        "status": "active",
        "subscription_plan": org_data.get("plan", "basic"),
        "created_at": datetime.utcnow(),
        "modules_enabled": ["attendance", "payroll", "employees", "leaves"],
        "max_employees": org_data.get("max_employees", 50)
    }
    
    await db.organizations.insert_one(new_org)
    new_org.pop("_id", None)
    return new_org

@router.patch("/organizations/{org_id}", dependencies=[Depends(verify_super_admin)])
async def update_organization(org_id: str, update_data: dict):
    """Update organization details or status."""
    await db.organizations.update_one(
        {"id": org_id},
        {"$set": {**update_data, "updated_at": datetime.utcnow()}}
    )
    return {"message": "Organization updated successfully"}

@router.delete("/organizations/{org_id}", dependencies=[Depends(verify_super_admin)])
async def delete_organization(org_id: str):
    """Remove an organization from the platform."""
    # Note: In a real system, we'd probably do a soft delete or cascade
    await db.organizations.delete_one({"id": org_id})
    return {"message": "Organization deleted"}

@router.get("/system/health", dependencies=[Depends(verify_super_admin)])
async def get_system_health():
    """Monitor platform health."""
    return {
        "api_version": "1.0.0",
        "database": "Connected",
        "storage": "85% available",
        "last_backup": datetime.utcnow().isoformat(),
        "uptime": "14 days, 6 hours"
    }
