import asyncio
from database import db

async def test():
    user = await db.users.find_one({'email': 'admin@techcorp.com'})
    print(f'User role: {user.get("role")}')
    role = await db.roles.find_one({'name': user.get('role')})
    print(f'Role perms: {role.get("permissions") if role else "None"}')
    admin_role = await db.roles.find_one({'name': 'admin'})
    print(f'Admin role exists: {bool(admin_role)}')
    hr_admin_role = await db.roles.find_one({'name': 'hr_admin'})
    print(f'hr_admin role perms: {hr_admin_role.get("permissions") if hr_admin_role else "None"}')

asyncio.run(test())
