import asyncio
from database import db, init_db

async def verify_user():
    await init_db()
    user = await db.users.find_one({"email": "admin@techcorp.com"})
    if user:
        print(f"User: {user['email']}")
        print(f"Role: {user['role']}")
        print(f"Org: {user['organization_id']}")
        print(f"Hashed PW: {user['hashed_password']}")
    else:
        print("User not found")

if __name__ == "__main__":
    asyncio.run(verify_user())
