"""Seed the DHAN database with a realistic demo business.

Usage:
    python seed.py

Creates (idempotently -- safe to re-run):
  - Business "Sharma Traders" with a demo user
  - Categories, vendors
  - ~6 months of realistic income & expense transactions
  - A couple of budgets (one intentionally over budget, to exercise the
    overspending / notification paths)
  - Notifications derived from that data

Prints the demo login credentials at the end.
"""
from __future__ import annotations

import random
from datetime import date
from decimal import Decimal

from app.database import Base, SessionLocal, engine
from app.models import *  # noqa: F401,F403
from app.models.budget import Budget
from app.models.business import Business
from app.models.category import Category
from app.models.transaction import Transaction
from app.models.user import User
from app.models.vendor import Vendor
from app.services.anomaly_service import detect_anomalies
from app.services.notification_service import (
    notify_budget_exceeded,
    notify_report_generated,
    notify_unusual_expense,
)
from app.utils.auth import get_password_hash

DEMO_MOBILE = '9420311155'
DEMO_PASSWORD = 'demo1234'
DEMO_EMAIL = 'owner@sharmatraders.example'

INCOME_SOURCES = [
    ('Retail Sales', 'Walk-in Customers'),
    ('Wholesale Sales', 'Wholesale Buyers'),
    ('Online Orders', 'Online Marketplace'),
    ('Services', 'Service Clients'),
]

EXPENSE_LINES = [
    ('Raw Material', 'ABC Suppliers', 4000, 9000),
    ('Raw Material', 'Global Raw Traders', 3000, 7000),
    ('Salary', 'Payroll', 22000, 26000),
    ('Electricity', 'Metro Electricity Board', 11000, 15500),
    ('Rent', 'Property Owner', 12000, 12000),
    ('Transport', 'City Transport Co.', 1200, 3200),
    ('Marketing', 'Local Print Media', 800, 2600),
    ('Office', 'Stationery Mart', 400, 1400),
]

PAYMENT_METHODS = ['Cash', 'UPI', 'Bank Transfer', 'Card', 'Cheque']


def month_range(months_back: int) -> list[date]:
    today = date.today()
    months = []
    y, m = today.year, today.month
    for i in range(months_back - 1, -1, -1):
        total = y * 12 + (m - 1) - i
        yy, mm = total // 12, (total % 12) + 1
        months.append(date(yy, mm, 1))
    return months


def get_or_create_category(db, business_id: int, name: str, type_: str) -> Category:
    cat = db.query(Category).filter(Category.business_id == business_id, Category.name == name).first()
    if cat:
        return cat
    cat = Category(business_id=business_id, name=name, type=type_)
    db.add(cat)
    db.flush()
    return cat


def get_or_create_vendor(db, business_id: int, name: str) -> Vendor:
    vendor = db.query(Vendor).filter(Vendor.business_id == business_id, Vendor.name == name).first()
    if vendor:
        return vendor
    vendor = Vendor(business_id=business_id, name=name)
    db.add(vendor)
    db.flush()
    return vendor


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    random.seed(42)

    try:
        business = db.query(Business).filter(Business.business_name == 'Sharma Traders').first()
        if not business:
            business = Business(
                business_name='Sharma Traders',
                business_type='Retail',
                owner_name='Rohan Sharma',
                mobile=DEMO_MOBILE,
                email=DEMO_EMAIL,
                address='14 MI Road',
                city='Jaipur',
                state='Rajasthan',
                gst_number='08ABCDE1234F1Z5',
                financial_year='2026-2027',
            )
            db.add(business)
            db.flush()

        user = db.query(User).filter(User.mobile == DEMO_MOBILE).first()
        if not user:
            user = User(
                email=DEMO_EMAIL,
                mobile=DEMO_MOBILE,
                full_name='Rohan Sharma',
                password_hash=get_password_hash(DEMO_PASSWORD),
                business_id=business.id,
            )
            db.add(user)
            db.flush()

        existing_tx_count = db.query(Transaction).filter(Transaction.business_id == business.id).count()
        if existing_tx_count == 0:
            months = month_range(6)
            for month_start in months:
                days_in_month = 28
                # Income: a handful of transactions per month across sources
                for source_name, vendor_name in INCOME_SOURCES:
                    category = get_or_create_category(db, business.id, source_name, 'income')
                    vendor = get_or_create_vendor(db, business.id, vendor_name)
                    for _ in range(random.randint(1, 3)):
                        day = random.randint(1, days_in_month)
                        amount = Decimal(random.randint(15000, 65000))
                        db.add(Transaction(
                            business_id=business.id,
                            type='income',
                            amount=amount,
                            category_id=category.id,
                            vendor_id=vendor.id,
                            description=source_name,
                            date=month_start.replace(day=day),
                            payment_method=random.choice(PAYMENT_METHODS),
                            notes=None,
                        ))

                # Expenses: recurring categories with realistic ranges
                for cat_name, vendor_name, lo, hi in EXPENSE_LINES:
                    category = get_or_create_category(db, business.id, cat_name, 'expense')
                    vendor = get_or_create_vendor(db, business.id, vendor_name)
                    day = random.randint(1, days_in_month)
                    amount = Decimal(random.randint(lo, hi))
                    db.add(Transaction(
                        business_id=business.id,
                        type='expense',
                        amount=amount,
                        category_id=category.id,
                        vendor_id=vendor.id,
                        description=f'{cat_name} payment',
                        date=month_start.replace(day=day),
                        payment_method=random.choice(PAYMENT_METHODS),
                        notes=None,
                    ))

            # Inject one deliberately unusual electricity spike this month, so
            # the anomaly-detection and notification flows have something real
            # to surface out of the box.
            current_month = months[-1]
            electricity_cat = get_or_create_category(db, business.id, 'Electricity', 'expense')
            electricity_vendor = get_or_create_vendor(db, business.id, 'Metro Electricity Board')
            spike_day = min(27, 28)
            spike_tx = Transaction(
                business_id=business.id,
                type='expense',
                amount=Decimal(26800),
                category_id=electricity_cat.id,
                vendor_id=electricity_vendor.id,
                description='Electricity payment (peak season)',
                date=current_month.replace(day=spike_day),
                payment_method='Bank Transfer',
                notes='Higher than usual due to summer cooling load',
            )
            db.add(spike_tx)
            db.commit()
            db.refresh(spike_tx)

            # Budgets: Raw Material within range, Marketing intentionally tight
            raw_material_cat = get_or_create_category(db, business.id, 'Raw Material', 'expense')
            marketing_cat = get_or_create_category(db, business.id, 'Marketing', 'expense')
            db.add(Budget(business_id=business.id, category_id=raw_material_cat.id, amount=Decimal(15000), month=current_month.month, year=current_month.year))
            db.add(Budget(business_id=business.id, category_id=marketing_cat.id, amount=Decimal(1500), month=current_month.month, year=current_month.year))
            db.commit()

            # Generate real notifications from the data we just created.
            marketing_spent = sum(
                float(t.amount) for t in db.query(Transaction).filter(
                    Transaction.business_id == business.id,
                    Transaction.category_id == marketing_cat.id,
                    Transaction.type == 'expense',
                    Transaction.date >= current_month,
                ).all()
            )
            if marketing_spent > 1500:
                notify_budget_exceeded(db, business.id, 'Marketing', marketing_spent, 1500)

            electricity_txs = db.query(Transaction).filter(
                Transaction.business_id == business.id, Transaction.category_id == electricity_cat.id, Transaction.type == 'expense'
            ).all()
            tx_dicts = [{'id': t.id, 'type': t.type, 'category': 'Electricity', 'amount': t.amount, 'date': t.date, 'description': t.description} for t in electricity_txs]
            anomalies = detect_anomalies(tx_dicts)
            flagged = next((a for a in anomalies if a['transaction_id'] == spike_tx.id), None)
            if flagged:
                notify_unusual_expense(db, business.id, flagged['category'], flagged['amount'], flagged['deviation_percentage'])

            notify_report_generated(db, business.id, current_month.strftime('%B %Y'))
            db.commit()

        print('Seed complete.')
        print(f'Business: {business.business_name}')
        print('Demo login:')
        print(f'  Mobile:   {DEMO_MOBILE}')
        print(f'  Password: {DEMO_PASSWORD}')

    finally:
        db.close()


if __name__ == '__main__':
    seed()
