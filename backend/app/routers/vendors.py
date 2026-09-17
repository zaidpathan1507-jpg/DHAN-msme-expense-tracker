from datetime import date as date_cls

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.transaction import Transaction
from app.models.user import User
from app.models.vendor import Vendor
from app.routers.auth import get_current_user_dependency
from app.schemas.vendor import VendorCreate, VendorUpdate

router = APIRouter(prefix='/vendors', tags=['Vendors'])


def _vendor_stats(db: Session, business_id: int, vendor_id: int) -> dict:
    txs = (
        db.query(Transaction)
        .filter(Transaction.business_id == business_id, Transaction.vendor_id == vendor_id)
        .all()
    )
    total_spend = sum(float(t.amount) for t in txs if t.type == 'expense')
    transaction_count = len(txs)
    last_transaction = max((t.date for t in txs), default=None)

    monthly: dict[str, float] = {}
    for t in txs:
        if t.type != 'expense' or not t.date:
            continue
        d = t.date if isinstance(t.date, date_cls) else date_cls.fromisoformat(str(t.date))
        key = f'{d.year}-{d.month:02d}'
        monthly[key] = monthly.get(key, 0.0) + float(t.amount)

    monthly_points = [{'period': k, 'amount': round(v, 2)} for k, v in sorted(monthly.items())]
    trend = 'flat'
    if len(monthly_points) >= 2:
        if monthly_points[-1]['amount'] > monthly_points[-2]['amount']:
            trend = 'up'
        elif monthly_points[-1]['amount'] < monthly_points[-2]['amount']:
            trend = 'down'

    return {
        'total_spend': round(total_spend, 2),
        'transaction_count': transaction_count,
        'last_transaction': str(last_transaction) if last_transaction else None,
        'monthly_spending': monthly_points,
        'spending_trend': trend,
    }


def _serialize(item: Vendor, db: Session | None = None, with_stats: bool = False) -> dict:
    payload = {
        'id': item.id,
        'business_id': item.business_id,
        'name': item.name,
        'contact_person': item.contact_person,
        'phone': item.phone,
        'email': item.email,
        'address': item.address,
    }
    if with_stats and db is not None:
        payload.update(_vendor_stats(db, item.business_id, item.id))
    return payload


@router.get('', summary='List vendors for current business with spend statistics')
async def list_vendors(
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db),
):
    query = db.query(Vendor).filter(Vendor.business_id == current_user.business_id)
    if search:
        query = query.filter(Vendor.name.ilike(f'%{search}%'))

    total = query.count()
    items = query.order_by(Vendor.name.asc()).offset((page - 1) * limit).limit(limit).all()
    return {
        'items': [_serialize(item, db, with_stats=True) for item in items],
        'page': page,
        'limit': limit,
        'total': total,
        'pages': (total + limit - 1) // limit if limit else 0,
    }


@router.get('/{vendor_id}', summary='Fetch vendor details with spend statistics')
async def get_vendor(vendor_id: int, current_user: User = Depends(get_current_user_dependency), db: Session = Depends(get_db)):
    item = db.query(Vendor).filter(Vendor.id == vendor_id, Vendor.business_id == current_user.business_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Vendor not found')
    return _serialize(item, db, with_stats=True)


@router.post('', summary='Create a vendor', status_code=status.HTTP_201_CREATED)
async def create_vendor(payload: VendorCreate, current_user: User = Depends(get_current_user_dependency), db: Session = Depends(get_db)):
    existing = (
        db.query(Vendor)
        .filter(Vendor.business_id == current_user.business_id, Vendor.name == payload.name)
        .first()
    )
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='A vendor with this name already exists')

    item = Vendor(business_id=current_user.business_id, **payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return _serialize(item, db, with_stats=True)


@router.put('/{vendor_id}', summary='Update a vendor')
async def update_vendor(vendor_id: int, payload: VendorUpdate, current_user: User = Depends(get_current_user_dependency), db: Session = Depends(get_db)):
    item = db.query(Vendor).filter(Vendor.id == vendor_id, Vendor.business_id == current_user.business_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Vendor not found')

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)
    return _serialize(item, db, with_stats=True)


@router.delete('/{vendor_id}', summary='Delete a vendor')
async def delete_vendor(vendor_id: int, current_user: User = Depends(get_current_user_dependency), db: Session = Depends(get_db)):
    item = db.query(Vendor).filter(Vendor.id == vendor_id, Vendor.business_id == current_user.business_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Vendor not found')
    db.delete(item)
    db.commit()
    return {'success': True, 'message': 'Vendor deleted'}
