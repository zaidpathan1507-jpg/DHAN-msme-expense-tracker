from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import extract, func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.budget import Budget
from app.models.category import Category
from app.models.transaction import Transaction
from app.models.user import User
from app.routers.auth import get_current_user_dependency
from app.schemas.budget import BudgetCreate, BudgetUpdate
from app.services.notification_service import notify_budget_exceeded

router = APIRouter(prefix='/budgets', tags=['Budgets'])


def _actual_spending(db: Session, business_id: int, category_id: int, month: int, year: int) -> float:
    total = (
        db.query(func.coalesce(func.sum(Transaction.amount), 0))
        .filter(
            Transaction.business_id == business_id,
            Transaction.category_id == category_id,
            Transaction.type == 'expense',
            extract('month', Transaction.date) == month,
            extract('year', Transaction.date) == year,
        )
        .scalar()
    )
    return float(total or 0)


def _serialize(item: Budget, db: Session) -> dict:
    category_name = item.category_obj.name if item.category_obj else 'Other'
    spent = _actual_spending(db, item.business_id, item.category_id, item.month, item.year)
    amount = float(item.amount)
    remaining = amount - spent
    percentage_used = round((spent / amount) * 100, 1) if amount else 0.0
    return {
        'id': item.id,
        'business_id': item.business_id,
        'category': category_name,
        'amount': amount,
        'month': item.month,
        'year': item.year,
        'actual_spending': round(spent, 2),
        'remaining': round(remaining, 2),
        'percentage_used': percentage_used,
        'exceeded': spent > amount,
    }


def _get_or_create_category(db: Session, business_id: int, name: str) -> Category:
    category = db.query(Category).filter(Category.business_id == business_id, Category.name == name).first()
    if not category:
        category = Category(business_id=business_id, name=name, type='expense')
        db.add(category)
        db.flush()
    return category


@router.get('', summary='List budgets with actual-vs-budget calculations')
async def list_budgets(current_user: User = Depends(get_current_user_dependency), db: Session = Depends(get_db)):
    items = db.query(Budget).filter(Budget.business_id == current_user.business_id).order_by(Budget.year.desc(), Budget.month.desc()).all()
    return [_serialize(item, db) for item in items]


@router.post('', summary='Create a budget', status_code=status.HTTP_201_CREATED)
async def create_budget(payload: BudgetCreate, current_user: User = Depends(get_current_user_dependency), db: Session = Depends(get_db)):
    category = _get_or_create_category(db, current_user.business_id, payload.category)

    existing = (
        db.query(Budget)
        .filter(
            Budget.business_id == current_user.business_id,
            Budget.category_id == category.id,
            Budget.month == payload.month,
            Budget.year == payload.year,
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='A budget for this category and period already exists')

    item = Budget(
        business_id=current_user.business_id,
        category_id=category.id,
        amount=Decimal(str(payload.amount)),
        month=payload.month,
        year=payload.year,
    )
    db.add(item)
    db.commit()
    db.refresh(item)

    result = _serialize(item, db)
    if result['exceeded']:
        notify_budget_exceeded(db, current_user.business_id, result['category'], result['actual_spending'], result['amount'])
        db.commit()
    return result


@router.put('/{budget_id}', summary='Update a budget')
async def update_budget(budget_id: int, payload: BudgetUpdate, current_user: User = Depends(get_current_user_dependency), db: Session = Depends(get_db)):
    item = db.query(Budget).filter(Budget.id == budget_id, Budget.business_id == current_user.business_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Budget not found')

    category = _get_or_create_category(db, current_user.business_id, payload.category)
    item.category_id = category.id
    item.amount = Decimal(str(payload.amount))
    item.month = payload.month
    item.year = payload.year

    db.commit()
    db.refresh(item)
    return _serialize(item, db)


@router.delete('/{budget_id}', summary='Delete a budget')
async def delete_budget(budget_id: int, current_user: User = Depends(get_current_user_dependency), db: Session = Depends(get_db)):
    item = db.query(Budget).filter(Budget.id == budget_id, Budget.business_id == current_user.business_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Budget not found')
    db.delete(item)
    db.commit()
    return {'success': True, 'message': 'Budget deleted'}
