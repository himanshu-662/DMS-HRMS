import os
import sys
sys.path.append(os.path.dirname(os.path.realpath(__file__)))

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from database import db, init_db
from auth import get_password_hash, verify_password, create_access_token
import uuid
from datetime import datetime

import logging
import traceback

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="DMS HRMS API")

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception: {exc}")
    logger.error(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc), "traceback": traceback.format_exc()},
    )

from fastapi.responses import JSONResponse

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

@app.on_event("startup")
async def startup_event():
    await init_db()

# Auth Routes
@app.post("/api/auth/register")
async def register(user: UserRegister):
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_dict = user.dict()
    user_dict["hashed_password"] = get_password_hash(user_dict.pop("password"))
    user_dict["id"] = str(uuid.uuid4())
    user_dict["created_at"] = datetime.utcnow()
    
    await db.users.insert_one(user_dict)
    
    token = create_access_token({"sub": user.email, "role": user.role})
    
    # Remove _id to avoid serialization error
    if "_id" in user_dict:
        del user_dict["_id"]
        
    return {
        "user": {
            "id": user_dict["id"],
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "avatar": f"https://ui-avatars.com/api/?name={user.name}&background=random",
            "department": "General",
            "designation": user.role.capitalize()
        },
        "token": token
    }

@app.post("/api/auth/login")
async def login(credentials: UserLogin):
    logger.info(f"Login attempt for email: {credentials.email}, role: {credentials.role}, password_length: {len(credentials.password)}")
    
    user = await db.users.find_one({"email": credentials.email})
    
    if not user:
        logger.warning(f"Login failed: User not found for email {credentials.email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    if user.get("role") != credentials.role:
        logger.warning(f"Login failed: Role mismatch for {credentials.email}. Expected {user.get('role')}, got {credentials.role}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    if not verify_password(credentials.password, user["hashed_password"]):
        logger.warning(f"Login failed: Password mismatch for {credentials.email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    logger.info(f"Login successful for {credentials.email}")
    token = create_access_token({"sub": user["email"], "role": user["role"]})
    
    return {
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
            "avatar": user.get("avatar", f"https://ui-avatars.com/api/?name={user['name']}&background=random"),
            "department": user.get("department", "General"),
            "designation": user.get("designation", user["role"].capitalize())
        },
        "token": token
    }

# Settings Routes
@app.get("/api/settings")
async def get_settings():
    settings = await db.settings.find_one({}, {"_id": 0})
    return settings or {}

@app.post("/api/settings")
async def update_settings(updates: Dict[str, Any]):
    await db.settings.update_one({}, {"$set": updates}, upsert=True)
    return {"message": "Settings updated"}

# HR Data Routes (Minimal implementations)
@app.get("/api/employees")
async def get_employees():
    employees = await db.employees.find({}, {"_id": 0}).to_list(length=1000)
    return employees

@app.post("/api/employees")
async def add_employee(employee: EmployeeModel):
    emp_dict = employee.dict()
    create_account = emp_dict.pop("createAccount", False)
    
    emp_dict["id"] = f"e{int(datetime.utcnow().timestamp())}"
    # Generate employee ID (e.g., DMS001)
    count = await db.employees.count_documents({})
    emp_dict["employeeId"] = f"DMS{str(count + 1).zfill(3)}"
    await db.employees.insert_one(emp_dict)
    
    if create_account:
        # Create a user record so they can log in
        # Default password is the email
        user_dict = {
            "id": str(uuid.uuid4()),
            "name": employee.name,
            "email": employee.email,
            "hashed_password": get_password_hash(employee.email),
            "role": "employee",
            "department": employee.department,
            "designation": employee.designation
        }
        # Avoid duplicate users
        await db.users.delete_many({"email": employee.email})
        await db.users.insert_one(user_dict)
        logger.info(f"Created user account for employee {employee.email} with default password")

    if "_id" in emp_dict:
        del emp_dict["_id"]
    return emp_dict

@app.post("/api/employees/bulk")
async def bulk_import_employees(employees: List[EmployeeModel]):
    if not employees:
        return {"message": "No employees to import"}
    
    count = await db.employees.count_documents({})
    prepared_employees = []
    
    for i, emp in enumerate(employees):
        emp_dict = emp.dict()
        emp_dict["id"] = f"e{int(datetime.utcnow().timestamp())}{i}"
        emp_dict["employeeId"] = f"DMS{str(count + i + 1).zfill(3)}"
        prepared_employees.append(emp_dict)
    
    if prepared_employees:
        await db.employees.insert_many(prepared_employees)
    
    return {"message": f"Successfully imported {len(prepared_employees)} employees"}

@app.post("/api/employees/update/{id}")
async def update_employee(id: str, updates: Dict[str, Any]):
    # Remove fields that shouldn't be updated manually via this generic endpoint if they exist
    updates.pop("_id", None)
    updates.pop("id", None)
    
    result = await db.employees.update_one({"id": id}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"message": "Employee updated successfully"}

@app.delete("/api/employees/{id}")
async def delete_employee(id: str):
    result = await db.employees.delete_one({"id": id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"message": "Employee deleted successfully"}

@app.get("/api/attendance")
async def get_attendance():
    attendance = await db.attendance.find({}, {"_id": 0}).to_list(length=100)
    return attendance

@app.get("/api/leaves")
async def get_leaves():
    leaves = await db.leaves.find({}, {"_id": 0}).to_list(length=100)
    return leaves

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
