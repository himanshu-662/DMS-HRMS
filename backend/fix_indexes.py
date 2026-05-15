import asyncio
from database import db
async def test():
    try:
        await db.employees.drop_index('employeeId_1')
        print('Dropped employeeId_1 index')
    except Exception as e:
        print(f"Error dropping index: {e}")
        
    try:
        await db.employees.create_index([("employeeId", 1), ("organization_id", 1)], unique=True)
        print('Created (employeeId, organization_id) unique index')
    except Exception as e:
        print(f"Error creating index: {e}")

asyncio.run(test())
