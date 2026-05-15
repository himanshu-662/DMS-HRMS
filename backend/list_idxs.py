import asyncio
from database import db
async def test():
    idxs = await db.employees.list_indexes().to_list(None)
    for i in idxs:
        print(i)
asyncio.run(test())
