import httpx
import asyncio

async def test_super_admin():
    url = "http://localhost:8001"
    
    # 1. Login
    print("Attempting login...")
    async with httpx.AsyncClient() as client:
        login_res = await client.post(f"{url}/api/auth/login", json={
            "email": "admin@dms.com",
            "password": "admin123",
            "role": "super_admin"
        })
        
        if login_res.status_code != 200:
            print(f"Login failed: {login_res.status_code} - {login_res.text}")
            return
            
        token = login_res.json()["token"]
        print("Login successful.")
        
        # 2. Fetch Organizations
        print("Fetching organizations...")
        org_res = await client.get(
            f"{url}/api/super-admin/organizations",
            headers={
                "Authorization": f"Bearer {token}",
                "X-Organization-Context": "null" # Simulate frontend sending 'null'
            }
        )
        
        if org_res.status_code == 200:
            print(f"Success! Fetched {len(org_res.json())} organizations.")
            print(f"Sample: {org_res.json()[:2]}")
        else:
            print(f"Failed to fetch: {org_res.status_code} - {org_res.text}")

if __name__ == "__main__":
    asyncio.run(test_super_admin())
