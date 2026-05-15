import asyncio
from database import db

async def test():
    users = await db.users.find({'organization_id': {'$exists': False}}).to_list(None)
    for u in users:
        print(f"User: {u.get('email')}, Role: {u.get('role')}")
    
    users_none = await db.users.find({'organization_id': None}).to_list(None)
    for u in users_none:
        print(f"User (None): {u.get('email')}, Role: {u.get('role')}")

asyncio.run(test())
