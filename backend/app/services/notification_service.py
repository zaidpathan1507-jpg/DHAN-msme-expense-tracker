"""Notification generation. Kept as plain functions operating on a SQLAlchemy
session so both request handlers (e.g. right after creating a transaction)
and the seed script can call them the same way."""
from __future__ import annotations

from sqlalchemy.orm import Session

from app.models.notification import Notification


def _create_if_not_duplicate(db: Session, business_id: int, title: str, message: str) -> Notification | None:
    existing = (
        db.query(Notification)
        .filter(Notification.business_id == business_id, Notification.title == title, Notification.message == message)
        .first()
    )
    if existing:
        return None
    notif = Notification(business_id=business_id, title=title, message=message, read=False)
    db.add(notif)
    return notif


def notify_budget_exceeded(db: Session, business_id: int, category: str, spent: float, budget: float) -> None:
    pct = round((spent / budget) * 100) if budget else 0
    _create_if_not_duplicate(
        db,
        business_id,
        title='Budget exceeded',
        message=f'{category} spending has reached {pct}% of its budget (₹{spent:,.0f} of ₹{budget:,.0f}).',
    )


def notify_unusual_expense(db: Session, business_id: int, category: str, amount: float, pct_over: float) -> None:
    _create_if_not_duplicate(
        db,
        business_id,
        title='Unusual expense detected',
        message=f'A {category} expense of ₹{amount:,.0f} is {pct_over:.0f}% above your usual average.',
    )


def notify_cash_flow_warning(db: Session, business_id: int, projected_balance: float) -> None:
    _create_if_not_duplicate(
        db,
        business_id,
        title='Cash flow warning',
        message=f'Your projected cash balance next month is ₹{projected_balance:,.0f}, trending low. Review upcoming expenses.',
    )


def notify_report_generated(db: Session, business_id: int, period_label: str) -> None:
    _create_if_not_duplicate(
        db,
        business_id,
        title='Report generated',
        message=f'Your monthly report for {period_label} is ready to view.',
    )
