import asyncio
import uuid
from database import db, init_db
from auth import get_password_hash

async def create_simple_user():
    await init_db()
    email = "test@test.com"
    password = "password"
    role = "employee"
    
    # Force update
    user_to_insert = {
        "id": str(uuid.uuid4()),
        "name": "Test User",
        "email": email,
        "hashed_password": get_password_hash(password),
        "role": role,
        "department": "Test",
        "designation": "Tester"
    }
    
    await db.users.delete_many({"email": email})
    await db.users.insert_one(user_to_insert)
    print(f"User created: {email} / {password} / {role}")

if __name__ == "__main__":
    asyncio.run(create_simple_user())
