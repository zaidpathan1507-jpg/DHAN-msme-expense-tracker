from decimal import Decimal

from sqlalchemy import Date, DateTime, DECIMAL, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database import Base


class Transaction(Base):
    __tablename__ = 'transactions'

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    business_id: Mapped[int] = mapped_column(ForeignKey('businesses.id'), nullable=False)
    type: Mapped[str] = mapped_column(String(20), nullable=False)
    amount: Mapped[Decimal] = mapped_column(DECIMAL(precision=18, scale=2), nullable=False)
    category_id: Mapped[int | None] = mapped_column(ForeignKey('categories.id'), nullable=True)
    vendor_id: Mapped[int | None] = mapped_column(ForeignKey('vendors.id'), nullable=True)
    description: Mapped[str] = mapped_column(String(200), nullable=False)
    date: Mapped[str] = mapped_column(Date, nullable=False)
    payment_method: Mapped[str] = mapped_column(String(50), nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    receipt_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[str] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[str] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    business = relationship('Business', back_populates='transactions')
    category_obj = relationship('Category', back_populates='transactions')
    vendor_obj = relationship('Vendor', back_populates='transactions')
