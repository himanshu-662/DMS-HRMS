import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "dms_hrms")

client = AsyncIOMotorClient(MONGODB_URL)
db = client[DATABASE_NAME]

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
    
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.employees.create_index("employeeId", unique=True)

def get_db():
    return db
