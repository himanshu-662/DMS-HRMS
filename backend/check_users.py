import asyncio
from database import db, init_db

async def check_users():
    await init_db()
    users = await db.users.find({}, {"hashed_password": 0}).to_list(length=100)
    print(f"Total users: {len(users)}")
    for user in users:
        print(f"User: {user.get('email')} - Role: {user.get('role')}")

if __name__ == "__main__":
    asyncio.run(check_users())
