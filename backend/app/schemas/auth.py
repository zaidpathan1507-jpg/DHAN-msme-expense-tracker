from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    email: EmailStr
    mobile: str = Field(..., min_length=10, max_length=15)
    full_name: str = Field(..., min_length=2, max_length=200)
    password: str = Field(..., min_length=6)
    business_name: str = Field(..., min_length=2, max_length=200)


class LoginRequest(BaseModel):
    mobile: str = Field(..., min_length=10, max_length=15)
    password: str = Field(..., min_length=6)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    user: dict
