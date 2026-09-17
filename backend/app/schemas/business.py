from typing import Optional

from pydantic import BaseModel, Field


class BusinessBase(BaseModel):
    business_name: str = Field(..., min_length=2, max_length=200)
    business_type: Optional[str] = None
    owner_name: Optional[str] = None
    mobile: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    gst_number: Optional[str] = None
    financial_year: Optional[str] = None


class BusinessCreate(BusinessBase):
    pass


class BusinessUpdate(BusinessBase):
    pass


class BusinessOut(BusinessBase):
    id: int
