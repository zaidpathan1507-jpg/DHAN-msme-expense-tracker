from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.business import Business
from app.models.user import User
from app.routers.auth import get_current_user_dependency
from app.schemas.business import BusinessUpdate

router = APIRouter(prefix='/business', tags=['Business'])


def _serialize(business: Business) -> dict:
    return {
        'id': business.id,
        'business_name': business.business_name,
        'business_type': business.business_type,
        'owner_name': business.owner_name,
        'mobile': business.mobile,
        'email': business.email,
        'address': business.address,
        'city': business.city,
        'state': business.state,
        'gst_number': business.gst_number,
        'financial_year': business.financial_year,
    }


@router.get('', summary='Get the current business profile')
async def get_business(current_user: User = Depends(get_current_user_dependency), db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.id == current_user.business_id).first()
    if not business:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Business not found')
    return _serialize(business)


@router.put('', summary='Update the current business profile')
async def update_business(payload: BusinessUpdate, current_user: User = Depends(get_current_user_dependency), db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.id == current_user.business_id).first()
    if not business:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Business not found')

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(business, field, value)

    db.commit()
    db.refresh(business)
    return _serialize(business)
