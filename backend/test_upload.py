import asyncio
import httpx

async def test_upload():
    # Login to get token
    async with httpx.AsyncClient() as client:
        resp = await client.post('http://localhost:8000/api/auth/login', json={
            'email': 'admin@techcorp.com',
            'password': 'password123',
            'role': 'hr_admin'
        })
        token = resp.json().get('token')
        print(f"Got token: {token[:20]}...")
        
        # Upload logo
        headers = {'Authorization': f'Bearer {token}'}
        payload = {'logo': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='}
        resp = await client.post('http://localhost:8000/api/organization/logo', json=payload, headers=headers)
        print(f"Status: {resp.status_code}")
        print(f"Response: {resp.text}")

asyncio.run(test_upload())
