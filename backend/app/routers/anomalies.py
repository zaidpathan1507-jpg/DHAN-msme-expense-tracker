from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.transaction import Transaction
from app.models.user import User
from app.routers.auth import get_current_user_dependency
from app.services.anomaly_service import detect_anomalies

router = APIRouter(prefix='/anomalies', tags=['Anomalies'])


@router.get('', summary='List unusual-expense alerts (not fraud detection)')
async def get_anomalies(current_user: User = Depends(get_current_user_dependency), db: Session = Depends(get_db)):
    txs = db.query(Transaction).filter(Transaction.business_id == current_user.business_id, Transaction.type == 'expense').all()
    tx_dicts = [
        {
            'id': t.id,
            'type': t.type,
            'category': t.category_obj.name if t.category_obj else 'Other',
            'amount': t.amount,
            'date': t.date,
            'description': t.description,
        }
        for t in txs
    ]
    items = detect_anomalies(tx_dicts)
    return {
        'business_id': current_user.business_id,
        'items': items,
        'note': 'These are statistically unusual expenses based on your own history, not confirmed fraud.',
    }
