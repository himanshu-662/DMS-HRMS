import asyncio
import httpx

async def test_add_employee():
    async with httpx.AsyncClient() as client:
        # Login
        resp = await client.post('http://localhost:8000/api/auth/login', json={
            'email': 'admin@techcorp.com',
            'password': 'password123',
            'role': 'hr_admin'
        })
        token = resp.json().get('token')
        
        # Add employee
        headers = {'Authorization': f'Bearer {token}'}
        emp_data = {
            "name": "Test Employee",
            "email": "test_emp@example.com",
            "phone": "1234567890",
            "department": "IT",
            "designation": "Developer",
            "joinDate": "2023-01-01",
            "status": "active",
            "location": "NY",
            "type": "full_time",
            "salary": 50000,
            "skills": ["Python"],
            "createAccount": True
        }
        resp = await client.post('http://localhost:8000/api/employees', json=emp_data, headers=headers)
        print(f"Status: {resp.status_code}")
        print(f"Response: {resp.text}")

asyncio.run(test_add_employee())
