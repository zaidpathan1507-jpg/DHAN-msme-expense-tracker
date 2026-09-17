def test_create_budget(client, auth_headers):
    response = client.post('/api/budgets', json={
        'category': 'Marketing',
        'amount': 5000,
        'month': 9,
        'year': 2026,
    }, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data['category'] == 'Marketing'
    assert data['amount'] == 5000.0
    assert data['exceeded'] is False


def test_budget_marks_exceeded_when_overspent(client, auth_headers):
    client.post('/api/budgets', json={'category': 'Marketing', 'amount': 1000, 'month': 9, 'year': 2026}, headers=auth_headers)
    client.post('/api/transactions', json={
        'type': 'expense', 'amount': 1800, 'description': 'Ad campaign', 'category': 'Marketing',
        'vendor': 'Ad Agency', 'date': '2026-09-15', 'payment_method': 'UPI',
    }, headers=auth_headers)

    response = client.get('/api/budgets', headers=auth_headers)
    budget = next(b for b in response.json() if b['category'] == 'Marketing')
    assert budget['actual_spending'] == 1800.0
    assert budget['exceeded'] is True
    assert budget['remaining'] == -800.0


def test_duplicate_budget_rejected(client, auth_headers):
    payload = {'category': 'Rent', 'amount': 12000, 'month': 9, 'year': 2026}
    first = client.post('/api/budgets', json=payload, headers=auth_headers)
    assert first.status_code == 201
    second = client.post('/api/budgets', json=payload, headers=auth_headers)
    assert second.status_code == 400


def test_delete_budget(client, auth_headers):
    created = client.post('/api/budgets', json={'category': 'Office', 'amount': 2000, 'month': 9, 'year': 2026}, headers=auth_headers).json()
    response = client.delete(f"/api/budgets/{created['id']}", headers=auth_headers)
    assert response.status_code == 200
    remaining = client.get('/api/budgets', headers=auth_headers).json()
    assert all(b['id'] != created['id'] for b in remaining)
