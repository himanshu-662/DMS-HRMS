import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "dms_hrms")

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

async def verify_admin():
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]
    
    admin_email = "admin@dms.com"
    hashed_password = pwd_context.hash("admin123")
    
    # Check if admin@dms.com already exists
    existing_user = await db.users.find_one({"email": admin_email})
    
    if existing_user:
        print(f"User {admin_email} exists with role {existing_user.get('role')}. Ensuring it is super_admin and updating password.")
        await db.users.update_one(
            {"_id": existing_user["_id"]},
            {"$set": {"hashed_password": hashed_password, "role": "super_admin"}}
        )
        print("Updated user to super_admin and set password to admin123")
    else:
        # Check if any other super_admin exists
        other_admin = await db.users.find_one({"role": "super_admin"})
        if other_admin:
            print(f"Found another super_admin: {other_admin['email']}. Changing email to {admin_email} and updating password.")
            await db.users.update_one(
                {"_id": other_admin["_id"]},
                {"$set": {"email": admin_email, "hashed_password": hashed_password}}
            )
        else:
            print("No super_admin found. Creating default admin@dms.com")
            await db.users.insert_one({
                "name": "Super Admin",
                "email": admin_email,
                "hashed_password": hashed_password,
                "role": "super_admin",
                "organization_id": None,
                "created_at": None
            })
        print(f"Super Admin ready: {admin_email} / admin123")

if __name__ == "__main__":
    asyncio.run(verify_admin())
