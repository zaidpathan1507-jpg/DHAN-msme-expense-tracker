from fastapi import APIRouter, Depends, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.category import Category
from app.models.transaction import Transaction
from app.models.user import User
from app.models.vendor import Vendor
from app.routers.auth import get_current_user_dependency

router = APIRouter(prefix='/search', tags=['Search'])


@router.get('', summary='Search transactions, vendors and categories')
async def search_items(
    q: str = Query(..., min_length=1),
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db),
):
    like = f'%{q}%'
    business_id = current_user.business_id

    tx_matches = (
        db.query(Transaction)
        .filter(Transaction.business_id == business_id, or_(Transaction.description.ilike(like), Transaction.notes.ilike(like)))
        .order_by(Transaction.date.desc())
        .limit(5)
        .all()
    )
    vendor_matches = (
        db.query(Vendor)
        .filter(Vendor.business_id == business_id, Vendor.name.ilike(like))
        .limit(5)
        .all()
    )
    category_matches = (
        db.query(Category)
        .filter(Category.business_id == business_id, Category.name.ilike(like))
        .limit(5)
        .all()
    )

    results = []
    for t in tx_matches:
        results.append({
            'type': 'Transaction',
            'label': t.description,
            'meta': f"₹{float(t.amount):,.0f} • {t.date}",
            'id': t.id,
        })
    for v in vendor_matches:
        results.append({'type': 'Vendor', 'label': v.name, 'meta': 'Vendor', 'id': v.id})
    for c in category_matches:
        results.append({'type': 'Category', 'label': c.name, 'meta': 'Category', 'id': c.id})

    return {'query': q, 'results': results, 'business_id': business_id}
