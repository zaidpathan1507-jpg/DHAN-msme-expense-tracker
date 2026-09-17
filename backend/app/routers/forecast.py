from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.transaction import Transaction
from app.models.user import User
from app.routers.auth import get_current_user_dependency
from app.services.forecast_service import SCENARIOS, forecast_cash_flow

router = APIRouter(prefix='/forecast', tags=['Forecast'])


@router.get('/cash-flow', summary='Get an explainable cash-flow forecast for a scenario')
async def get_cash_flow_forecast(
    scenario: str = Query('normal', description=f"One of: {', '.join(SCENARIOS.keys())}"),
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db),
):
    txs = db.query(Transaction).filter(Transaction.business_id == current_user.business_id).all()
    tx_dicts = [{'date': t.date, 'type': t.type, 'amount': t.amount} for t in txs]

    summary = {'income': 0.0, 'expenses': 0.0}
    for t in tx_dicts:
        if t['type'] == 'income':
            summary['income'] += float(t['amount'])
        else:
            summary['expenses'] += float(t['amount'])
    starting_balance = summary['income'] - summary['expenses']

    return forecast_cash_flow(tx_dicts, scenario=scenario, starting_balance=starting_balance)
