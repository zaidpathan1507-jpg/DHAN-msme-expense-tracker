from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field


class TransactionCreate(BaseModel):
    type: str = Field(..., pattern='^(income|expense)$')
    amount: Decimal = Field(..., gt=0)
    description: str = Field(..., min_length=1, max_length=200)
    category: str | None = None
    vendor: str | None = None
    date: str
    payment_method: str = Field(..., min_length=1, max_length=50)
    notes: Optional[str] = None
    receipt_url: Optional[str] = None


class TransactionUpdate(TransactionCreate):
    pass


class TransactionOut(BaseModel):
    id: int
    business_id: int
    type: str
    amount: Decimal
    description: str
    category: str | None = None
    vendor: str | None = None
    date: str
    payment_method: str
    notes: str | None = None
    receipt_url: str | None = None
