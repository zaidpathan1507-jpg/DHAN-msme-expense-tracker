from decimal import Decimal

from sqlalchemy import DECIMAL, Date, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database import Base


class FinancialSnapshot(Base):
    __tablename__ = 'financial_snapshots'

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    business_id: Mapped[int] = mapped_column(ForeignKey('businesses.id'), nullable=False)
    snapshot_date: Mapped[str] = mapped_column(Date, nullable=False)
    total_income: Mapped[Decimal] = mapped_column(DECIMAL(precision=18, scale=2), nullable=False)
    total_expenses: Mapped[Decimal] = mapped_column(DECIMAL(precision=18, scale=2), nullable=False)
    net_cash_flow: Mapped[Decimal] = mapped_column(DECIMAL(precision=18, scale=2), nullable=False)
    business_health: Mapped[int] = mapped_column(nullable=False)
    created_at: Mapped[str] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    business = relationship('Business')
