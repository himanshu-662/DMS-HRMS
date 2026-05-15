import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

async def check_db():
    load_dotenv()
    url = os.getenv("MONGODB_URL")
    db_name = os.getenv("DATABASE_NAME", "dms_hrms")
    print(f"Connecting to: {url}")
    client = AsyncIOMotorClient(url)
    db = client[db_name]
    
    try:
        orgs = await db.organizations.find({}).to_list(length=100)
        print(f"Found {len(orgs)} organizations.")
        for org in orgs:
            print(f"- {org.get('company_name')} (ID: {org.get('id')})")
            
        users = await db.users.find({}).to_list(length=100)
        print(f"\nFound {len(users)} users.")
        for user in users:
            print(f"- {user.get('email')} (Role: {user.get('role')})")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(check_db())
