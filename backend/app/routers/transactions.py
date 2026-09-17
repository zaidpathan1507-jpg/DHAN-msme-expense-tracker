from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.budget import Budget
from app.models.category import Category
from app.models.transaction import Transaction
from app.models.user import User
from app.models.vendor import Vendor
from app.routers.auth import get_current_user_dependency
from app.schemas.transaction import TransactionCreate, TransactionUpdate
from app.services.anomaly_service import detect_anomalies
from app.services.categorization import categorize_text
from app.services.notification_service import notify_budget_exceeded, notify_unusual_expense

router = APIRouter(prefix='/transactions', tags=['Transactions'])


def _serialize(item: Transaction) -> dict:
    return {
        'id': item.id,
        'business_id': item.business_id,
        'type': item.type,
        'amount': float(item.amount),
        'description': item.description,
        'category': item.category_obj.name if item.category_obj else None,
        'vendor': item.vendor_obj.name if item.vendor_obj else None,
        'date': str(item.date),
        'payment_method': item.payment_method,
        'notes': item.notes,
        'receipt_url': item.receipt_url,
    }


def _check_post_create_notifications(db: Session, business_id: int, item: Transaction) -> None:
    """Best-effort: budget-exceeded + unusual-expense checks right after a new expense."""
    if item.type != 'expense' or not item.category_id:
        return

    budget = (
        db.query(Budget)
        .filter(
            Budget.business_id == business_id,
            Budget.category_id == item.category_id,
            Budget.month == item.date.month,
            Budget.year == item.date.year,
        )
        .first()
    )
    if budget:
        spent = (
            db.query(Transaction)
            .filter(
                Transaction.business_id == business_id,
                Transaction.category_id == item.category_id,
                Transaction.type == 'expense',
            )
            .all()
        )
        total_spent = sum(
            float(t.amount) for t in spent
            if t.date.month == item.date.month and t.date.year == item.date.year
        )
        if total_spent > float(budget.amount):
            notify_budget_exceeded(db, business_id, item.category_obj.name if item.category_obj else 'Category', total_spent, float(budget.amount))

    category_txs = (
        db.query(Transaction)
        .filter(Transaction.business_id == business_id, Transaction.category_id == item.category_id, Transaction.type == 'expense')
        .all()
    )
    tx_dicts = [
        {'id': t.id, 'type': t.type, 'category': item.category_obj.name if item.category_obj else 'Other', 'amount': t.amount, 'date': t.date, 'description': t.description}
        for t in category_txs
    ]
    anomalies = detect_anomalies(tx_dicts)
    flagged = next((a for a in anomalies if a['transaction_id'] == item.id), None)
    if flagged:
        notify_unusual_expense(db, business_id, flagged['category'], flagged['amount'], flagged['deviation_percentage'])

    db.commit()


@router.get('', summary='List transactions with filters and pagination')
async def list_transactions(
    search: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    vendor: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db),
):
    query = db.query(Transaction).filter(Transaction.business_id == current_user.business_id)

    if search:
        like = f'%{search}%'
        query = query.filter(or_(Transaction.description.ilike(like), Transaction.notes.ilike(like)))
    if type:
        query = query.filter(Transaction.type == type)
    if category:
        query = query.join(Category, Transaction.category_id == Category.id).filter(Category.name == category)
    if vendor:
        query = query.join(Vendor, Transaction.vendor_id == Vendor.id).filter(Vendor.name.ilike(f'%{vendor}%'))
    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)

    total = query.count()
    items = query.order_by(Transaction.date.desc(), Transaction.id.desc()).offset((page - 1) * limit).limit(limit).all()

    return {
        'items': [_serialize(item) for item in items],
        'page': page,
        'limit': limit,
        'total': total,
        'pages': (total + limit - 1) // limit if limit else 0,
    }


class CategorizeRequest(BaseModel):
    description: Optional[str] = None
    vendor: Optional[str] = None
    ocr_text: Optional[str] = None


@router.post('/categorize', summary='Suggest a category from free-text hints (rule-based)')
async def categorize_transaction(payload: CategorizeRequest, current_user: User = Depends(get_current_user_dependency)):
    category, confidence = categorize_text(payload.description, payload.vendor, payload.ocr_text)
    return {'category': category, 'confidence': confidence}


@router.get('/{transaction_id}', summary='Fetch a single transaction by id')
async def get_transaction(transaction_id: int, current_user: User = Depends(get_current_user_dependency), db: Session = Depends(get_db)):
    item = db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.business_id == current_user.business_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Transaction not found')
    return _serialize(item)


@router.post('', summary='Create a transaction', status_code=status.HTTP_201_CREATED)
async def create_transaction(payload: TransactionCreate, current_user: User = Depends(get_current_user_dependency), db: Session = Depends(get_db)):
    vendor_name = payload.vendor or payload.description
    vendor = db.query(Vendor).filter(Vendor.business_id == current_user.business_id, Vendor.name == vendor_name).first()
    if not vendor:
        vendor = Vendor(business_id=current_user.business_id, name=vendor_name)
        db.add(vendor)
        db.flush()

    category = db.query(Category).filter(Category.business_id == current_user.business_id, Category.name == (payload.category or 'Other')).first()
    if not category:
        category = Category(business_id=current_user.business_id, name=payload.category or 'Other', type='expense' if payload.type == 'expense' else 'income')
        db.add(category)
        db.flush()

    item = Transaction(
        business_id=current_user.business_id,
        type=payload.type,
        amount=Decimal(str(payload.amount)),
        category_id=category.id,
        vendor_id=vendor.id,
        description=payload.description,
        date=payload.date,
        payment_method=payload.payment_method,
        notes=payload.notes,
        receipt_url=payload.receipt_url,
    )
    db.add(item)
    db.commit()
    db.refresh(item)

    _check_post_create_notifications(db, current_user.business_id, item)

    return _serialize(item)


@router.put('/{transaction_id}', summary='Update a transaction')
async def update_transaction(transaction_id: int, payload: TransactionUpdate, current_user: User = Depends(get_current_user_dependency), db: Session = Depends(get_db)):
    item = db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.business_id == current_user.business_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Transaction not found')

    item.type = payload.type
    item.amount = Decimal(str(payload.amount))
    item.description = payload.description
    item.date = payload.date
    item.payment_method = payload.payment_method
    item.notes = payload.notes
    item.receipt_url = payload.receipt_url

    if payload.category:
        category = db.query(Category).filter(Category.business_id == current_user.business_id, Category.name == payload.category).first()
        if not category:
            category = Category(business_id=current_user.business_id, name=payload.category, type='expense' if payload.type == 'expense' else 'income')
            db.add(category)
            db.flush()
        item.category_id = category.id

    if payload.vendor:
        vendor = db.query(Vendor).filter(Vendor.business_id == current_user.business_id, Vendor.name == payload.vendor).first()
        if not vendor:
            vendor = Vendor(business_id=current_user.business_id, name=payload.vendor)
            db.add(vendor)
            db.flush()
        item.vendor_id = vendor.id

    db.commit()
    db.refresh(item)
    return _serialize(item)


@router.delete('/{transaction_id}', summary='Delete a transaction')
async def delete_transaction(transaction_id: int, current_user: User = Depends(get_current_user_dependency), db: Session = Depends(get_db)):
    item = db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.business_id == current_user.business_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Transaction not found')
    db.delete(item)
    db.commit()
    return {'success': True, 'message': 'Transaction deleted'}
