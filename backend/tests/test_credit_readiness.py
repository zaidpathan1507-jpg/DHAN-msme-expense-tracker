def test_credit_readiness_includes_disclaimer(client, auth_headers):
    response = client.get('/api/credit-readiness', headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert 'not an official credit score' in data['disclaimer'].lower()
    assert 0 <= data['score'] <= 100
    assert set(data['factors'].keys()) == {
        'income_consistency', 'expense_consistency', 'cash_flow_stability', 'transaction_history',
    }


def test_credit_readiness_requires_auth(client):
    response = client.get('/api/credit-readiness')
    assert response.status_code == 401
