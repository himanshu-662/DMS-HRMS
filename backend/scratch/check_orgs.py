import httpx
import asyncio

async def test_orgs():
    url = "http://localhost:8001"
    
    async with httpx.AsyncClient() as client:
        # 1. Login
        print("Logging in...")
        login_res = await client.post(f"{url}/api/auth/login", json={
            "email": "superadmin@dms.com",
            "password": "admin123",
            "role": "super_admin"
        })
        
        if login_res.status_code != 200:
            print(f"Login failed: {login_res.status_code} - {login_res.text}")
            return
            
        token = login_res.json()["token"]
        
        # 2. Get Orgs
        print("Fetching organizations...")
        org_res = await client.get(
            f"{url}/api/super-admin/organizations",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if org_res.status_code == 200:
            orgs = org_res.json()
            print(f"Success! Found {len(orgs)} organizations.")
            for o in orgs:
                print(f"- {o.get('company_name')} ({o.get('id')})")
        else:
            print(f"Failed: {org_res.status_code} - {org_res.text}")

if __name__ == "__main__":
    asyncio.run(test_orgs())
