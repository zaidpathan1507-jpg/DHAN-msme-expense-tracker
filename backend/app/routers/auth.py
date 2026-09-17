from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.schemas.auth import LoginRequest, RegisterRequest
from app.services.auth_service import login_user, register_user
from app.utils.auth import decode_access_token
from app.models.user import User

router = APIRouter(prefix='/auth', tags=['Auth'])
settings = get_settings()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/api/auth/login')


async def get_current_user_dependency(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        user_id = decode_access_token(token)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid authentication credentials') from exc

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found')
    return user


@router.post('/register', summary='Register a new business user', response_model=dict)
async def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    return register_user(db, payload)


@router.post('/login', summary='Login a user and return a JWT token', response_model=dict)
async def login(payload: LoginRequest, db: Session = Depends(get_db)):
    return login_user(db, payload)


@router.get('/me', summary='Fetch the current user profile', response_model=dict)
async def me(current_user: User = Depends(get_current_user_dependency)):
    return {
        'id': current_user.id,
        'email': current_user.email,
        'mobile': current_user.mobile,
        'full_name': current_user.full_name,
        'business_id': current_user.business_id,
    }
