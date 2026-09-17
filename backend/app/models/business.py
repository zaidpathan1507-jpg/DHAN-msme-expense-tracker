from sqlalchemy import DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database import Base


class Business(Base):
    __tablename__ = 'businesses'

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    business_name: Mapped[str] = mapped_column(String(200), nullable=False)
    business_type: Mapped[str] = mapped_column(String(100), nullable=True)
    owner_name: Mapped[str] = mapped_column(String(200), nullable=True)
    mobile: Mapped[str] = mapped_column(String(15), nullable=True)
    email: Mapped[str] = mapped_column(String(255), nullable=True)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    city: Mapped[str | None] = mapped_column(String(100), nullable=True)
    state: Mapped[str | None] = mapped_column(String(100), nullable=True)
    gst_number: Mapped[str | None] = mapped_column(String(30), nullable=True)
    financial_year: Mapped[str | None] = mapped_column(String(50), nullable=True)
    created_at: Mapped[str] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[str] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    users = relationship('User', back_populates='business')
    transactions = relationship('Transaction', back_populates='business')
    vendors = relationship('Vendor', back_populates='business')
    budgets = relationship('Budget', back_populates='business')
    reports = relationship('Report', back_populates='business')
    notifications = relationship('Notification', back_populates='business')
