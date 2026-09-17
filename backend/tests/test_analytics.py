def test_analytics_overview(client, auth_headers):
    client.post('/api/transactions', json={
        'type': 'income', 'amount': 20000, 'description': 'Sales', 'category': 'Sales',
        'vendor': 'Internal', 'date': '2026-09-01', 'payment_method': 'UPI',
    }, headers=auth_headers)
    client.post('/api/transactions', json={
        'type': 'expense', 'amount': 8000, 'description': 'Materials', 'category': 'Raw Material',
        'vendor': 'ABC Suppliers', 'date': '2026-09-02', 'payment_method': 'Cash',
    }, headers=auth_headers)

    response = client.get('/api/analytics/overview', headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data['total_income'] == 20000.0
    assert data['total_expenses'] == 8000.0
    assert data['highest_expense_category'] == 'Raw Material'


def test_analytics_categories(client, auth_headers):
    client.post('/api/transactions', json={
        'type': 'expense', 'amount': 1000, 'description': 'x', 'category': 'Office',
        'vendor': 'Vendor', 'date': '2026-09-01', 'payment_method': 'Cash',
    }, headers=auth_headers)
    response = client.get('/api/analytics/categories', headers=auth_headers)
    assert response.status_code == 200
    assert response.json()[0]['category'] == 'Office'


def test_analytics_requires_auth(client):
    response = client.get('/api/analytics/overview')
    assert response.status_code == 401
