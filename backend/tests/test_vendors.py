def test_create_and_list_vendors(client, auth_headers):
    response = client.post('/api/vendors', json={'name': 'ABC Suppliers', 'phone': '9998887771'}, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()['name'] == 'ABC Suppliers'

    listed = client.get('/api/vendors', headers=auth_headers)
    assert listed.status_code == 200
    assert listed.json()['total'] == 1


def test_vendor_spend_statistics(client, auth_headers):
    client.post('/api/transactions', json={
        'type': 'expense', 'amount': 3000, 'description': 'Materials', 'category': 'Raw Material',
        'vendor': 'ABC Suppliers', 'date': '2026-09-01', 'payment_method': 'Cash',
    }, headers=auth_headers)
    client.post('/api/transactions', json={
        'type': 'expense', 'amount': 2000, 'description': 'More materials', 'category': 'Raw Material',
        'vendor': 'ABC Suppliers', 'date': '2026-09-05', 'payment_method': 'Cash',
    }, headers=auth_headers)

    vendors = client.get('/api/vendors', headers=auth_headers).json()['items']
    vendor = next(v for v in vendors if v['name'] == 'ABC Suppliers')
    assert vendor['total_spend'] == 5000.0
    assert vendor['transaction_count'] == 2


def test_delete_vendor(client, auth_headers):
    created = client.post('/api/vendors', json={'name': 'Temp Vendor'}, headers=auth_headers).json()
    response = client.delete(f"/api/vendors/{created['id']}", headers=auth_headers)
    assert response.status_code == 200


def test_vendor_not_found(client, auth_headers):
    response = client.get('/api/vendors/999999', headers=auth_headers)
    assert response.status_code == 404
