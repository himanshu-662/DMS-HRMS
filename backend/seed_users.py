import asyncio
import uuid
from datetime import datetime
from database import db, init_db
from auth import get_password_hash

async def seed_demo_users():
    print("Initializing database...")
    await init_db()
    
    # Create Organizations
    org_dms = {
        "id": "org_dms_123",
        "company_name": "DMS Solutions",
        "status": "active",
        "subscription_plan": "enterprise",
        "modules_enabled": ["attendance", "payroll", "employees", "leaves", "recruitment", "performance"],
        "max_employees": 500,
        "created_at": datetime.utcnow()
    }
    org_tech = {
        "id": "org_tech_456",
        "company_name": "Tech Corp",
        "status": "active",
        "subscription_plan": "business",
        "modules_enabled": ["attendance", "employees", "leaves"],
        "max_employees": 100,
        "created_at": datetime.utcnow()
    }
    
    await db.organizations.update_one({"id": org_dms["id"]}, {"$set": org_dms}, upsert=True)
    await db.organizations.update_one({"id": org_tech["id"]}, {"$set": org_tech}, upsert=True)
    
    demo_users = [
        {
            "name": "Super Admin",
            "email": "superadmin@dms.com",
            "password": "admin123",
            "role": "super_admin",
            "organization_id": None, # Platform owner
            "department": "IT",
            "designation": "Platform Owner"
        },
        {
            "name": "HR Manager (DMS)",
            "email": "hr@dms.com",
            "password": "password123",
            "role": "hr_admin",
            "organization_id": "org_dms_123",
            "department": "Human Resources",
            "designation": "HR Director"
        },
        {
            "name": "HR Admin (TechCorp)",
            "email": "admin@techcorp.com",
            "password": "password123",
            "role": "hr_admin",
            "organization_id": "org_tech_456",
            "department": "Human Resources",
            "designation": "HR Manager"
        },
        {
            "name": "John Manager (DMS)",
            "email": "manager@dms.com",
            "password": "password123",
            "role": "manager",
            "organization_id": "org_dms_123",
            "department": "Engineering",
            "designation": "Engineering Manager"
        },
        {
            "name": "Jane Employee (DMS)",
            "email": "employee@dms.com",
            "password": "password123",
            "role": "employee",
            "organization_id": "org_dms_123",
            "department": "Design",
            "designation": "Senior UX Designer"
        }
    ]
    
    print(f"Seeding demo users...")
    
    for user in demo_users:
        user_to_insert = {
            "id": str(uuid.uuid4()),
            "name": user["name"],
            "email": user["email"],
            "hashed_password": get_password_hash(user["password"]),
            "role": user["role"],
            "organization_id": user["organization_id"],
            "department": user["department"],
            "designation": user["designation"],
            "avatar": f"https://ui-avatars.com/api/?name={user['name'].replace(' ', '+')}&background=random",
            "created_at": datetime.utcnow()
        }
        
        # Using upsert logic to avoid duplicates and update organization_id for existing users
        await db.users.update_one(
            {"email": user["email"]},
            {"$set": {
                "name": user["name"],
                "hashed_password": get_password_hash(user["password"]),
                "role": user["role"],
                "organization_id": user["organization_id"],
                "department": user["department"],
                "designation": user["designation"]
            }},
            upsert=True
        )
        print(f"Seeded/Updated user: {user['email']} in Org: {user['organization_id']}")

    print("\nSeed process completed!")

if __name__ == "__main__":
    asyncio.run(seed_demo_users())
