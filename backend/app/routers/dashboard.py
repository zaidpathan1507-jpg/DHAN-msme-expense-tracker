from datetime import date, timedelta

from fastapi import APIRouter, Depends, Query
from sqlalchemy import case, func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.category import Category
from app.models.transaction import Transaction
from app.models.user import User
from app.routers.auth import get_current_user_dependency
from app.services.credit_service import calculate_credit_readiness
from app.services.forecast_service import build_monthly_totals

router = APIRouter(prefix='/dashboard', tags=['Dashboard'])


def _business_health_score(db: Session, business_id: int) -> int:
    txs = db.query(Transaction).filter(Transaction.business_id == business_id).all()
    tx_dicts = [{'date': t.date, 'type': t.type, 'amount': t.amount} for t in txs]
    monthly = build_monthly_totals(tx_dicts, months_back=6)
    result = calculate_credit_readiness(monthly, transaction_count=len(txs))
    return result['score']


@router.get('/summary', summary='Get dashboard summary metrics')
async def dashboard_summary(current_user: User = Depends(get_current_user_dependency), db: Session = Depends(get_db)):
    summary = db.query(
        func.coalesce(func.sum(case((Transaction.type == 'income', Transaction.amount), else_=0)), 0).label('total_income'),
        func.coalesce(func.sum(case((Transaction.type == 'expense', Transaction.amount), else_=0)), 0).label('total_expenses'),
        func.count(Transaction.id).label('transaction_count'),
    ).filter(Transaction.business_id == current_user.business_id).one()

    total_income = float(summary.total_income or 0)
    total_expenses = float(summary.total_expenses or 0)
    net_cash_flow = total_income - total_expenses

    return {
        'total_income': round(total_income, 2),
        'total_expenses': round(total_expenses, 2),
        'net_cash_flow': round(net_cash_flow, 2),
        'business_health': _business_health_score(db, current_user.business_id),
        'transaction_count': summary.transaction_count,
        'current_balance': round(net_cash_flow, 2),
    }


@router.get('/cash-flow', summary='Get cash-flow series for a time range')
async def cash_flow(
    range: str = Query('30d', alias='range'),
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db),
):
    txs = db.query(Transaction).filter(Transaction.business_id == current_user.business_id).all()
    today = date.today()

    if range in ('3m', '1y'):
        months_back = 3 if range == '3m' else 12
        tx_dicts = [{'date': t.date, 'type': t.type, 'amount': t.amount} for t in txs]
        monthly = build_monthly_totals(tx_dicts, months_back=months_back)
        return [
            {
                'date': f"{m['year']}-{m['month']:02d}-01",
                'label': m['label'],
                'income': m['income'],
                'expenses': m['expenses'],
                'net': round(m['income'] - m['expenses'], 2),
            }
            for m in monthly
        ]

    days_back = 7 if range == '7d' else 30
    start_day = today - timedelta(days=days_back - 1)
    daily: dict[str, dict[str, float]] = {}
    cursor = start_day
    while cursor <= today:
        daily[cursor.isoformat()] = {'income': 0.0, 'expenses': 0.0}
        cursor += timedelta(days=1)

    for t in txs:
        if not t.date or t.date < start_day or t.date > today:
            continue
        key = t.date.isoformat()
        if key not in daily:
            continue
        if t.type == 'income':
            daily[key]['income'] += float(t.amount)
        else:
            daily[key]['expenses'] += float(t.amount)

    return [
        {
            'date': d,
            'income': round(v['income'], 2),
            'expenses': round(v['expenses'], 2),
            'net': round(v['income'] - v['expenses'], 2),
        }
        for d, v in sorted(daily.items())
    ]


@router.get('/spending-breakdown', summary='Get category-wise expense totals')
async def spending_breakdown(current_user: User = Depends(get_current_user_dependency), db: Session = Depends(get_db)):
    rows = (
        db.query(Category.name, func.coalesce(func.sum(Transaction.amount), 0).label('amount'))
        .join(Transaction, Transaction.category_id == Category.id)
        .filter(Transaction.business_id == current_user.business_id, Transaction.type == 'expense')
        .group_by(Category.name)
        .all()
    )

    total = sum(float(amount) for _, amount in rows) or 1.0
    breakdown = [
        {
            'category': name,
            'amount': round(float(amount), 2),
            'percentage': round((float(amount) / total) * 100, 1),
        }
        for name, amount in rows
    ]
    breakdown.sort(key=lambda x: x['amount'], reverse=True)
    return breakdown
