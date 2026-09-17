import io
from datetime import date
from calendar import month_name

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.business import Business
from app.models.transaction import Transaction
from app.models.user import User
from app.routers.auth import get_current_user_dependency
from app.services.notification_service import notify_report_generated
from app.services.report_service import build_gst_export_csv, build_monthly_pdf, monthly_report_data

router = APIRouter(prefix='/reports', tags=['Reports'])


def _period_bounds(month: int | None, year: int | None) -> tuple[date, date, str]:
    today = date.today()
    m = month or today.month
    y = year or today.year
    start = date(y, m, 1)
    end = date(y + 1, 1, 1) if m == 12 else date(y, m + 1, 1)
    return start, end, f'{month_name[m]} {y}'


def _period_transactions(db: Session, business_id: int, month: int | None, year: int | None):
    start, end, label = _period_bounds(month, year)
    txs = (
        db.query(Transaction)
        .filter(Transaction.business_id == business_id, Transaction.date >= start, Transaction.date < end)
        .all()
    )
    tx_dicts = [
        {
            'type': t.type,
            'amount': t.amount,
            'date': t.date,
            'description': t.description,
            'category': t.category_obj.name if t.category_obj else None,
            'vendor': t.vendor_obj.name if t.vendor_obj else None,
            'payment_method': t.payment_method,
        }
        for t in txs
    ]
    return tx_dicts, label


@router.get('/monthly', summary='Get the monthly summary report as JSON')
async def report_monthly(
    month: int | None = Query(None, ge=1, le=12),
    year: int | None = Query(None, ge=2000),
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db),
):
    business = db.query(Business).filter(Business.id == current_user.business_id).first()
    tx_dicts, label = _period_transactions(db, current_user.business_id, month, year)
    report = monthly_report_data(business.business_name if business else 'Your business', label, tx_dicts)
    notify_report_generated(db, current_user.business_id, label)
    db.commit()
    return report


@router.get('/expenses', summary='Get an expense-only report')
async def report_expenses(
    month: int | None = Query(None, ge=1, le=12),
    year: int | None = Query(None, ge=2000),
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db),
):
    tx_dicts, label = _period_transactions(db, current_user.business_id, month, year)
    expenses = [t for t in tx_dicts if t['type'] == 'expense']
    total = round(sum(float(t['amount']) for t in expenses), 2)
    return {'period': label, 'total_expenses': total, 'transactions': expenses}


@router.get('/income', summary='Get an income-only report')
async def report_income(
    month: int | None = Query(None, ge=1, le=12),
    year: int | None = Query(None, ge=2000),
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db),
):
    tx_dicts, label = _period_transactions(db, current_user.business_id, month, year)
    income = [t for t in tx_dicts if t['type'] == 'income']
    total = round(sum(float(t['amount']) for t in income), 2)
    return {'period': label, 'total_income': total, 'transactions': income}


@router.get('/vendors', summary='Get a vendor spending report')
async def report_vendors(
    month: int | None = Query(None, ge=1, le=12),
    year: int | None = Query(None, ge=2000),
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db),
):
    tx_dicts, label = _period_transactions(db, current_user.business_id, month, year)
    by_vendor: dict[str, float] = {}
    for t in tx_dicts:
        vendor = t.get('vendor') or 'Unknown'
        by_vendor[vendor] = by_vendor.get(vendor, 0.0) + float(t['amount'])
    vendors = [{'vendor': k, 'amount': round(v, 2)} for k, v in sorted(by_vendor.items(), key=lambda x: -x[1])]
    return {'period': label, 'vendors': vendors}


@router.get('/monthly/pdf', summary='Download the monthly summary report as a PDF')
async def report_monthly_pdf(
    month: int | None = Query(None, ge=1, le=12),
    year: int | None = Query(None, ge=2000),
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db),
):
    business = db.query(Business).filter(Business.id == current_user.business_id).first()
    tx_dicts, label = _period_transactions(db, current_user.business_id, month, year)
    report = monthly_report_data(business.business_name if business else 'Your business', label, tx_dicts)
    pdf_bytes = build_monthly_pdf(report)
    notify_report_generated(db, current_user.business_id, label)
    db.commit()
    filename = f"dhan-monthly-report-{label.replace(' ', '-').lower()}.pdf"
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type='application/pdf',
        headers={'Content-Disposition': f'attachment; filename="{filename}"'},
    )


@router.get('/gst-export', summary='Download a GST-ready demo export (CSV)')
async def report_gst_export(
    month: int | None = Query(None, ge=1, le=12),
    year: int | None = Query(None, ge=2000),
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db),
):
    business = db.query(Business).filter(Business.id == current_user.business_id).first()
    tx_dicts, label = _period_transactions(db, current_user.business_id, month, year)
    csv_text = build_gst_export_csv(business.gst_number if business else None, tx_dicts)
    filename = f"dhan-gst-export-{label.replace(' ', '-').lower()}.csv"
    return StreamingResponse(
        io.StringIO(csv_text),
        media_type='text/csv',
        headers={'Content-Disposition': f'attachment; filename="{filename}"'},
    )
