import asyncio
import httpx
import os

async def test_large_upload():
    # Login to get token
    async with httpx.AsyncClient() as client:
        resp = await client.post('http://localhost:8000/api/auth/login', json={
            'email': 'admin@techcorp.com',
            'password': 'password123',
            'role': 'hr_admin'
        })
        token = resp.json().get('token')
        
        # Create a large 1.5MB base64 string
        large_base64 = "A" * (int(1.5 * 1024 * 1024))
        
        # Upload logo
        headers = {'Authorization': f'Bearer {token}'}
        payload = {'logo': f'data:image/png;base64,{large_base64}'}
        
        print(f"Sending payload of size {len(payload['logo'])} bytes")
        resp = await client.post('http://localhost:8000/api/organization/logo', json=payload, headers=headers)
        print(f"Status: {resp.status_code}")
        print(f"Response: {resp.text[:100]}")

asyncio.run(test_large_upload())
