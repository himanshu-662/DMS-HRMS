import asyncio
from database import db
async def test():
    emps = await db.employees.find({}, {'employeeId': 1, 'organization_id': 1}).to_list(None)
    for e in emps:
        print(f"ID: {e.get('employeeId')}, Org: {e.get('organization_id')}")
asyncio.run(test())
