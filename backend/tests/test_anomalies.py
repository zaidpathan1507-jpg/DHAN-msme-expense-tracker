def test_anomalies_flags_unusual_expense(client, auth_headers):
    for amount in (14000, 13500, 14200):
        client.post('/api/transactions', json={
            'type': 'expense', 'amount': amount, 'description': 'Electricity bill', 'category': 'Electricity',
            'vendor': 'Metro Electricity Board', 'date': '2026-06-01', 'payment_method': 'Bank Transfer',
        }, headers=auth_headers)

    client.post('/api/transactions', json={
        'type': 'expense', 'amount': 30000, 'description': 'Electricity bill', 'category': 'Electricity',
        'vendor': 'Metro Electricity Board', 'date': '2026-09-01', 'payment_method': 'Bank Transfer',
    }, headers=auth_headers)

    response = client.get('/api/anomalies', headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert any(item['category'] == 'Electricity' for item in data['items'])
    assert 'fraud' not in data['note'].lower()


def test_anomalies_requires_auth(client):
    response = client.get('/api/anomalies')
    assert response.status_code == 401
