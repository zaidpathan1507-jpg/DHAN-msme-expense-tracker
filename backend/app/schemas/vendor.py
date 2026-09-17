from typing import Optional

from pydantic import BaseModel, Field


class VendorBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None


class VendorCreate(VendorBase):
    pass


class VendorUpdate(VendorBase):
    pass


class VendorOut(VendorBase):
    id: int
    business_id: int
