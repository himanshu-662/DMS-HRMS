import asyncio
from database import db
from bson import json_util
import json

async def test():
    user = await db.users.find_one({'email': 'admin@techcorp.com'})
    print(json.dumps(user, default=json_util.default, indent=2))

asyncio.run(test())
