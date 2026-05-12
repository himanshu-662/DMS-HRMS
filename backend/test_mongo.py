import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

async def test_mongo():
    uri = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    print(f"Testing connection to: {uri}")
    client = AsyncIOMotorClient(uri, serverSelectionTimeoutMS=2000)
    try:
        await client.admin.command('ping')
        print("MongoDB Connection: SUCCESS")
    except Exception as e:
        print(f"MongoDB Connection: FAILED - {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(test_mongo())
