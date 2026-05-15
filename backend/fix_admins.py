import asyncio
from database import db

async def test():
    # Update users missing organization_id
    res1 = await db.users.update_many(
        {'role': 'hr_admin', 'organization_id': {'$exists': False}}, 
        {'$set': {'organization_id': 'org_dms_123'}}
    )
    # Also update users where organization_id is None
    res2 = await db.users.update_many(
        {'role': 'hr_admin', 'organization_id': None}, 
        {'$set': {'organization_id': 'org_dms_123'}}
    )
    print(f"Updated {res1.modified_count + res2.modified_count} hr_admin users with org_dms_123")

asyncio.run(test())
