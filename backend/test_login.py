import requests

def test_login():
    url = "http://localhost:8000/api/auth/login"
    data = {
        "email": "admin@dms.com",
        "password": "admin123",
        "role": "hr_admin"
    }
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_login()
