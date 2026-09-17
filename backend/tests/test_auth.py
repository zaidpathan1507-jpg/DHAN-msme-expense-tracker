def test_register_creates_user_and_returns_token(client):
    response = client.post('/api/auth/register', json={
        'email': 'new@example.com',
        'mobile': '9000000001',
        'full_name': 'New Owner',
        'password': 'password123',
        'business_name': 'New Traders',
    })
    assert response.status_code == 200
    data = response.json()
    assert data['access_token']
    assert data['user']['mobile'] == '9000000001'
    assert data['user']['business_name'] == 'New Traders'


def test_register_duplicate_mobile_rejected(client):
    payload = {
        'email': 'a@example.com',
        'mobile': '9000000002',
        'full_name': 'Owner A',
        'password': 'password123',
        'business_name': 'Traders A',
    }
    first = client.post('/api/auth/register', json=payload)
    assert first.status_code == 200

    payload2 = dict(payload, email='b@example.com')
    second = client.post('/api/auth/register', json=payload2)
    assert second.status_code == 400
    assert second.json()['success'] is False


def test_login_with_correct_credentials(client):
    client.post('/api/auth/register', json={
        'email': 'login@example.com',
        'mobile': '9000000003',
        'full_name': 'Login Owner',
        'password': 'correcthorse',
        'business_name': 'Login Traders',
    })
    response = client.post('/api/auth/login', json={'mobile': '9000000003', 'password': 'correcthorse'})
    assert response.status_code == 200
    assert 'access_token' in response.json()


def test_login_with_wrong_password_rejected(client):
    client.post('/api/auth/register', json={
        'email': 'wrong@example.com',
        'mobile': '9000000004',
        'full_name': 'Owner',
        'password': 'correcthorse',
        'business_name': 'Traders',
    })
    response = client.post('/api/auth/login', json={'mobile': '9000000004', 'password': 'wrongpassword'})
    assert response.status_code == 401


def test_me_requires_authentication(client):
    response = client.get('/api/auth/me')
    assert response.status_code == 401


def test_me_returns_current_user(client, auth_headers):
    response = client.get('/api/auth/me', headers=auth_headers)
    assert response.status_code == 200
    assert response.json()['mobile'] == '9876543210'


def test_protected_endpoint_rejects_missing_token(client):
    response = client.get('/api/dashboard/summary')
    assert response.status_code == 401


def test_protected_endpoint_rejects_garbage_token(client):
    response = client.get('/api/dashboard/summary', headers={'Authorization': 'Bearer not-a-real-token'})
    assert response.status_code == 401
