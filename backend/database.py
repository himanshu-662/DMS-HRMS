import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "dms_hrms")

client = AsyncIOMotorClient(MONGODB_URL)
db = client[DATABASE_NAME]

from utils.permissions import ROLE_PERMISSIONS

async def init_db():
    # Seed initial data if needed
    settings_count = await db.settings.count_documents({})
    if settings_count == 0:
        await db.settings.insert_one({
            "company_name": "DMS HRMS",
            "gps_attendance": False,
            "auto_gen_id": True,
            "theme": "light"
        })
    
    # Seed roles (Upsert to ensure updated permissions are applied)
    from pymongo import UpdateOne
    role_operations = [
        UpdateOne(
            {"name": name},
            {"$set": {"name": name, "permissions": [p.value for p in perms]}},
            upsert=True
        )
        for name, perms in ROLE_PERMISSIONS.items()
    ]
    if role_operations:
        await db.roles.bulk_write(role_operations)
    
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.employees.create_index([("employeeId", 1), ("organization_id", 1)], unique=True)
    await db.roles.create_index("name", unique=True)
    await db.organizations.create_index("id", unique=True)

def get_db():
    return db
