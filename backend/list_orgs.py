import asyncio
from database import db

async def test():
    orgs = await db.organizations.find({}).to_list(None)
    for o in orgs:
        print(f"ID: {o.get('id')}, Name: {o.get('company_name')}")

asyncio.run(test())
