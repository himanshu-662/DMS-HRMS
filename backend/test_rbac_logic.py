import asyncio
import os
from database import db
from auth import get_current_user
from utils.permissions import PermissionChecker

async def test_auth():
    user = await db.users.find_one({'email': 'admin@techcorp.com'})
    print(f'User role from db: {user.get("role")}')
    
    # simulate get_current_user
    role_data = await db.roles.find_one({"name": user["role"]})
    user["permissions"] = role_data.get("permissions", []) if role_data else []
    
    print(f'Permissions: {user["permissions"]}')
    
    checker = PermissionChecker("settings.manage")
    try:
        res = await checker(user=user)
        print("Permission check passed!", res)
    except Exception as e:
        print("Permission check failed:", e)

asyncio.run(test_auth())
