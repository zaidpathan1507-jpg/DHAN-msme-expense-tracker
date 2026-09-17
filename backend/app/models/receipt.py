from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database import Base


class Receipt(Base):
    __tablename__ = 'receipts'

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    business_id: Mapped[int] = mapped_column(ForeignKey('businesses.id'), nullable=False)
    transaction_id: Mapped[int | None] = mapped_column(ForeignKey('transactions.id'), nullable=True)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_path: Mapped[str] = mapped_column(String(255), nullable=False)
    mime_type: Mapped[str] = mapped_column(String(100), nullable=False)
    text_content: Mapped[str | None] = mapped_column(Text, nullable=True)
    extracted_vendor: Mapped[str | None] = mapped_column(String(200), nullable=True)
    extracted_amount: Mapped[str | None] = mapped_column(String(50), nullable=True)
    extracted_date: Mapped[str | None] = mapped_column(String(50), nullable=True)
    created_at: Mapped[str] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    business = relationship('Business')
    transaction = relationship('Transaction')
