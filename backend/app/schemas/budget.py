from decimal import Decimal

from pydantic import BaseModel, Field


class BudgetBase(BaseModel):
    category: str = Field(..., min_length=1, max_length=100)
    amount: Decimal = Field(..., gt=0)
    month: int = Field(..., ge=1, le=12)
    year: int = Field(..., ge=2024)


class BudgetCreate(BudgetBase):
    pass


class BudgetUpdate(BudgetBase):
    pass


class BudgetOut(BudgetBase):
    id: int
    business_id: int
    actual_spending: Decimal | None = None
    remaining: Decimal | None = None
    percentage_used: float | None = None
    exceeded: bool | None = None
