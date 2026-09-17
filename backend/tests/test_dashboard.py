def _create(client, headers, type_, amount, category=None, description='Test'):
    payload = {
        'type': type_,
        'amount': amount,
        'description': description,
        'date': '2026-09-05',
        'payment_method': 'Cash',
    }
    if type_ == 'expense':
        payload['category'] = category or 'Office'
        payload['vendor'] = 'Vendor A'
    else:
        payload['category'] = category or 'Sales'
        payload['vendor'] = 'Internal'
    return client.post('/api/transactions', json=payload, headers=headers)


def test_dashboard_summary_empty(client, auth_headers):
    response = client.get('/api/dashboard/summary', headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data['total_income'] == 0
    assert data['total_expenses'] == 0
    assert data['transaction_count'] == 0


def test_dashboard_summary_reflects_transactions(client, auth_headers):
    _create(client, auth_headers, 'income', 10000)
    _create(client, auth_headers, 'expense', 4000)

    response = client.get('/api/dashboard/summary', headers=auth_headers)
    data = response.json()
    assert data['total_income'] == 10000.0
    assert data['total_expenses'] == 4000.0
    assert data['net_cash_flow'] == 6000.0
    assert data['transaction_count'] == 2
    assert 0 <= data['business_health'] <= 100


def test_dashboard_cash_flow_range(client, auth_headers):
    _create(client, auth_headers, 'income', 5000)
    response = client.get('/api/dashboard/cash-flow', params={'range': '30d'}, headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_dashboard_spending_breakdown(client, auth_headers):
    _create(client, auth_headers, 'expense', 2000, category='Electricity')
    _create(client, auth_headers, 'expense', 1000, category='Rent')

    response = client.get('/api/dashboard/spending-breakdown', headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    total_pct = sum(item['percentage'] for item in data)
    assert 99 <= total_pct <= 101
