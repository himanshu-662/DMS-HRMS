import asyncio
from database import db
async def test():
    user = await db.users.find_one({'email': 'admin@techcorp.com'})
    print('Org ID:', user.get('organization_id'))
asyncio.run(test())
