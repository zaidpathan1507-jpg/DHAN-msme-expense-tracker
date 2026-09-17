import os
import sys

os.environ.setdefault('DATABASE_URL', 'sqlite:///./test_dhan.db')
os.environ.setdefault('JWT_SECRET', 'test-secret')

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.main import app

TEST_DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'test_dhan.db')
TEST_DATABASE_URL = 'sqlite:///./test_dhan.db'

engine = create_engine(TEST_DATABASE_URL, connect_args={'check_same_thread': False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope='function', autouse=True)
def _reset_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    from fastapi.testclient import TestClient

    with TestClient(app) as c:
        yield c


@pytest.fixture
def registered_user(client):
    payload = {
        'email': 'owner@example.com',
        'mobile': '9876543210',
        'full_name': 'Test Owner',
        'password': 'password123',
        'business_name': 'Test Traders',
    }
    response = client.post('/api/auth/register', json=payload)
    assert response.status_code == 200, response.text
    data = response.json()
    return {'token': data['access_token'], 'user': data['user']}


@pytest.fixture
def auth_headers(registered_user):
    return {'Authorization': f"Bearer {registered_user['token']}"}
