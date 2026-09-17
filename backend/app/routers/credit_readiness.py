from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.transaction import Transaction
from app.models.user import User
from app.routers.auth import get_current_user_dependency
from app.services.credit_service import calculate_credit_readiness
from app.services.forecast_service import build_monthly_totals

router = APIRouter(prefix='/credit-readiness', tags=['Credit Readiness'])


@router.get('', summary='Get the prototype financial-readiness indicator')
async def get_credit_readiness(current_user: User = Depends(get_current_user_dependency), db: Session = Depends(get_db)):
    txs = db.query(Transaction).filter(Transaction.business_id == current_user.business_id).all()
    tx_dicts = [{'date': t.date, 'type': t.type, 'amount': t.amount} for t in txs]
    monthly = build_monthly_totals(tx_dicts, months_back=6)

    result = calculate_credit_readiness(monthly, transaction_count=len(txs))
    return {
        'business_id': current_user.business_id,
        **result,
    }
