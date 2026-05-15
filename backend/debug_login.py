import asyncio
from database import db, init_db
from auth import verify_password

async def test_login():
    await init_db()
    email = "admin@techcorp.com"
    password = "password123"
    
    user = await db.users.find_one({"email": email})
    if not user:
        print("User not found")
        return
        
    is_valid = verify_password(password, user["hashed_password"])
    print(f"Password Valid: {is_valid}")
    print(f"Role: {user['role']}")

if __name__ == "__main__":
    asyncio.run(test_login())
