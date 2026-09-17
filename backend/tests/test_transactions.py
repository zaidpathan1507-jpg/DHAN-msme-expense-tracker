def _create_expense(client, headers, **overrides):
    payload = {
        'type': 'expense',
        'amount': 1500,
        'description': 'Office supplies',
        'category': 'Office',
        'vendor': 'Stationery Mart',
        'date': '2026-09-10',
        'payment_method': 'UPI',
        'notes': 'Test note',
    }
    payload.update(overrides)
    return client.post('/api/transactions', json=payload, headers=headers)


def test_create_transaction(client, auth_headers):
    response = _create_expense(client, auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data['amount'] == 1500.0
    assert data['category'] == 'Office'
    assert data['vendor'] == 'Stationery Mart'


def test_create_transaction_rejects_negative_amount(client, auth_headers):
    response = _create_expense(client, auth_headers, amount=-100)
    assert response.status_code == 422


def test_create_transaction_rejects_zero_amount(client, auth_headers):
    response = _create_expense(client, auth_headers, amount=0)
    assert response.status_code == 422


def test_create_transaction_rejects_invalid_type(client, auth_headers):
    response = _create_expense(client, auth_headers, type='refund')
    assert response.status_code == 422


def test_get_transactions_list(client, auth_headers):
    _create_expense(client, auth_headers)
    _create_expense(client, auth_headers, description='Second expense')
    response = client.get('/api/transactions', headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data['total'] == 2
    assert len(data['items']) == 2


def test_get_transaction_by_id(client, auth_headers):
    created = _create_expense(client, auth_headers).json()
    response = client.get(f"/api/transactions/{created['id']}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()['id'] == created['id']


def test_get_transaction_not_found(client, auth_headers):
    response = client.get('/api/transactions/999999', headers=auth_headers)
    assert response.status_code == 404


def test_update_transaction(client, auth_headers):
    created = _create_expense(client, auth_headers).json()
    response = client.put(
        f"/api/transactions/{created['id']}",
        json={
            'type': 'expense',
            'amount': 2000,
            'description': 'Updated office supplies',
            'category': 'Office',
            'vendor': 'Stationery Mart',
            'date': '2026-09-11',
            'payment_method': 'Cash',
        },
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert response.json()['amount'] == 2000.0
    assert response.json()['description'] == 'Updated office supplies'


def test_delete_transaction(client, auth_headers):
    created = _create_expense(client, auth_headers).json()
    response = client.delete(f"/api/transactions/{created['id']}", headers=auth_headers)
    assert response.status_code == 200

    follow_up = client.get(f"/api/transactions/{created['id']}", headers=auth_headers)
    assert follow_up.status_code == 404


def test_transactions_require_auth(client):
    response = client.get('/api/transactions')
    assert response.status_code == 401


def test_search_filters_transactions(client, auth_headers):
    _create_expense(client, auth_headers, description='Electricity bill', category='Electricity')
    _create_expense(client, auth_headers, description='Office chairs', category='Office')

    response = client.get('/api/transactions', params={'search': 'Electricity'}, headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data['total'] == 1
    assert data['items'][0]['description'] == 'Electricity bill'


def test_categorize_endpoint(client, auth_headers):
    response = client.post('/api/transactions/categorize', json={'description': 'Electricity bill payment'}, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()['category'] == 'Electricity'
