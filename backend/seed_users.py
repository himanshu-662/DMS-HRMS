import asyncio
import uuid
from datetime import datetime
from backend.database import db, init_db
from backend.auth import get_password_hash

async def seed_demo_users():
    print("Initializing database...")
    await init_db()
    
    demo_users = [
        {
            "name": "System Admin",
            "email": "admin@dms.com",
            "password": "admin123",
            "role": "hr_admin",
            "department": "Administration",
            "designation": "System Administrator"
        },
        {
            "name": "John Manager",
            "email": "manager@dms.com",
            "password": "password123",
            "role": "manager",
            "department": "Engineering",
            "designation": "Engineering Manager"
        },
        {
            "name": "Jane Employee",
            "email": "employee@dms.com",
            "password": "password123",
            "role": "employee",
            "department": "Design",
            "designation": "Senior UX Designer"
        }
    ]
    
    print(f"Checking for existing demo users in collection: {db.users.name}...")
    
    for user in demo_users:
        existing = await db.users.find_one({"email": user["email"]})
        if not existing:
            user_to_insert = {
                "id": str(uuid.uuid4()),
                "name": user["name"],
                "email": user["email"],
                "hashed_password": get_password_hash(user["password"]),
                "role": user["role"],
                "department": user["department"],
                "designation": user["designation"],
                "avatar": f"https://ui-avatars.com/api/?name={user['name'].replace(' ', '+')}&background=random",
                "created_at": datetime.utcnow()
            }
            await db.users.insert_one(user_to_insert)
            print(f"Created user: {user['email']} ({user['role']})")
        else:
            print(f"User already exists: {user['email']}")

    print("\nSeed process completed!")

if __name__ == "__main__":
    asyncio.run(seed_demo_users())
