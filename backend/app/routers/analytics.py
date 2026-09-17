from fastapi import APIRouter, Depends
from sqlalchemy import case, func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.category import Category
from app.models.transaction import Transaction
from app.models.user import User
from app.models.vendor import Vendor
from app.routers.auth import get_current_user_dependency
from app.services.forecast_service import build_monthly_totals

router = APIRouter(prefix='/analytics', tags=['Analytics'])


def _monthly_series(db: Session, business_id: int, months_back: int = 12) -> list[dict]:
    txs = db.query(Transaction).filter(Transaction.business_id == business_id).all()
    tx_dicts = [{'date': t.date, 'type': t.type, 'amount': t.amount} for t in txs]
    monthly = build_monthly_totals(tx_dicts, months_back=months_back)
    return [{**m, 'net': round(m['income'] - m['expenses'], 2)} for m in monthly]


@router.get('/overview', summary='Get an analytics overview computed from real transaction data')
async def analytics_overview(current_user: User = Depends(get_current_user_dependency), db: Session = Depends(get_db)):
    totals = db.query(
        func.coalesce(func.sum(case((Transaction.type == 'income', Transaction.amount), else_=0)), 0),
        func.coalesce(func.sum(case((Transaction.type == 'expense', Transaction.amount), else_=0)), 0),
        func.count(Transaction.id),
    ).filter(Transaction.business_id == current_user.business_id).one()
    total_income, total_expenses, tx_count = float(totals[0] or 0), float(totals[1] or 0), totals[2]

    monthly = _monthly_series(db, current_user.business_id, months_back=6)
    expense_values = [m['expenses'] for m in monthly if m['expenses'] > 0]
    avg_monthly_expense = round(sum(expense_values) / len(expense_values), 2) if expense_values else 0.0

    category_rows = (
        db.query(Category.name, func.coalesce(func.sum(Transaction.amount), 0))
        .join(Transaction, Transaction.category_id == Category.id)
        .filter(Transaction.business_id == current_user.business_id, Transaction.type == 'expense')
        .group_by(Category.name)
        .order_by(func.sum(Transaction.amount).desc())
        .first()
    )
    highest_expense_category = category_rows[0] if category_rows else None

    revenue_trend = 0.0
    expense_trend = 0.0
    if len(monthly) >= 2 and monthly[-2]['income'] > 0:
        revenue_trend = round(((monthly[-1]['income'] - monthly[-2]['income']) / monthly[-2]['income']) * 100, 1)
    if len(monthly) >= 2 and monthly[-2]['expenses'] > 0:
        expense_trend = round(((monthly[-1]['expenses'] - monthly[-2]['expenses']) / monthly[-2]['expenses']) * 100, 1)

    profit_margin = round(((total_income - total_expenses) / total_income) * 100, 1) if total_income else 0.0

    insights = []
    if revenue_trend > 0:
        insights.append(f'Revenue grew {revenue_trend}% month over month.')
    elif revenue_trend < 0:
        insights.append(f'Revenue declined {abs(revenue_trend)}% month over month.')
    if highest_expense_category:
        insights.append(f'{highest_expense_category} is your largest expense category.')
    if not insights:
        insights.append('Add more transactions to unlock deeper trend insights.')

    return {
        'business_id': current_user.business_id,
        'total_income': round(total_income, 2),
        'total_expenses': round(total_expenses, 2),
        'transaction_count': tx_count,
        'profit_margin': profit_margin,
        'average_monthly_expense': avg_monthly_expense,
        'highest_expense_category': highest_expense_category,
        'revenue_trend': revenue_trend,
        'expense_trend': expense_trend,
        'insights': insights,
    }


@router.get('/monthly', summary='Get monthly income vs expenses for the last 12 months')
async def analytics_monthly(current_user: User = Depends(get_current_user_dependency), db: Session = Depends(get_db)):
    return _monthly_series(db, current_user.business_id, months_back=12)


@router.get('/categories', summary='Get expense category breakdown with transaction counts')
async def analytics_categories(current_user: User = Depends(get_current_user_dependency), db: Session = Depends(get_db)):
    rows = (
        db.query(Category.name, func.coalesce(func.sum(Transaction.amount), 0), func.count(Transaction.id))
        .join(Transaction, Transaction.category_id == Category.id)
        .filter(Transaction.business_id == current_user.business_id, Transaction.type == 'expense')
        .group_by(Category.name)
        .all()
    )
    total = sum(float(amount) for _, amount, _ in rows) or 1.0
    result = [
        {
            'category': name,
            'amount': round(float(amount), 2),
            'percentage': round((float(amount) / total) * 100, 1),
            'transaction_count': count,
            'average_transaction': round(float(amount) / count, 2) if count else 0.0,
        }
        for name, amount, count in rows
    ]
    result.sort(key=lambda x: x['amount'], reverse=True)
    return result


@router.get('/vendors', summary='Get vendor spending breakdown')
async def analytics_vendors(current_user: User = Depends(get_current_user_dependency), db: Session = Depends(get_db)):
    rows = (
        db.query(Vendor.name, func.coalesce(func.sum(Transaction.amount), 0), func.count(Transaction.id))
        .join(Transaction, Transaction.vendor_id == Vendor.id)
        .filter(Transaction.business_id == current_user.business_id, Transaction.type == 'expense')
        .group_by(Vendor.name)
        .all()
    )
    result = [
        {'vendor': name, 'amount': round(float(amount), 2), 'transaction_count': count}
        for name, amount, count in rows
    ]
    result.sort(key=lambda x: x['amount'], reverse=True)
    return result
