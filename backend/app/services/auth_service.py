import re
from datetime import timedelta

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.config import get_settings
from app.models.business import Business
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest
from app.utils.auth import create_access_token, get_password_hash, verify_password

settings = get_settings()


def normalize_mobile(mobile: str) -> str:
    digits = re.sub(r'\D', '', str(mobile or ''))
    return digits[-10:] if len(digits) >= 10 else digits


def register_user(db: Session, payload: RegisterRequest) -> dict:
    normalized_mobile = normalize_mobile(payload.mobile)
    if db.query(User).filter(User.mobile == normalized_mobile).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Mobile number already registered')
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Email already registered')

    business = Business(business_name=payload.business_name)
    db.add(business)
    db.flush()

    user = User(
        email=str(payload.email),
        mobile=normalized_mobile,
        full_name=payload.full_name,
        password_hash=get_password_hash(payload.password),
        business_id=business.id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.id, expires_delta=timedelta(minutes=settings.access_token_expire_minutes))
    return {
        'access_token': token,
        'token_type': 'bearer',
        'user': {
            'id': user.id,
            'email': user.email,
            'mobile': user.mobile,
            'full_name': user.full_name,
            'business_id': business.id,
            'business_name': business.business_name,
        },
    }


def login_user(db: Session, payload: LoginRequest) -> dict:
    normalized_mobile = normalize_mobile(payload.mobile)
    user = db.query(User).filter(User.mobile == normalized_mobile).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid credentials')

    token = create_access_token(user.id, expires_delta=timedelta(minutes=settings.access_token_expire_minutes))
    return {
        'access_token': token,
        'token_type': 'bearer',
        'user': {
            'id': user.id,
            'email': user.email,
            'mobile': user.mobile,
            'full_name': user.full_name,
            'business_id': user.business_id,
            'business_name': user.business.business_name if user.business else '',
        },
    }


def get_current_user(db: Session, user_id: int) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found')
    return user
