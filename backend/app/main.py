import logging

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.database import Base, SessionLocal, engine
from app.models import *  # noqa: F401,F403
from app.models.business import Business
from app.models.user import User
from app.routers import (
    analytics,
    anomalies,
    auth,
    budgets,
    business,
    credit_readiness,
    dashboard,
    forecast,
    notifications,
    receipts,
    reports,
    search,
    transactions,
    vendors,
)
from app.utils.auth import get_password_hash

logger = logging.getLogger('dhan')
settings = get_settings()


def ensure_demo_account() -> None:
    db = SessionLocal()
    try:
        business = db.query(Business).filter(Business.business_name == 'Sharma Traders').first()
        if business is None:
            business = Business(
                business_name='Sharma Traders',
                business_type='Retail',
                owner_name='Rohan Sharma',
                mobile='9420311155',
                email='owner@sharmatraders.example',
                city='Jaipur',
                state='Rajasthan',
            )
            db.add(business)
            db.flush()

        demo_numbers = ['9420311155', '9999999999']
        for mobile in demo_numbers:
            user = db.query(User).filter(User.mobile == mobile).first()
            if user is None:
                db.add(
                    User(
                        email=f'demo{mobile[-3:]}@sharmatraders.example',
                        mobile=mobile,
                        full_name='Rohan Sharma',
                        password_hash=get_password_hash('demo1234'),
                        business_id=business.id,
                    )
                )
        db.commit()
    finally:
        db.close()


Base.metadata.create_all(bind=engine)
ensure_demo_account()

app = FastAPI(
    title='DHAN API',
    version='1.0.0',
    description='Production-style backend for the DHAN financial management platform for Indian MSMEs.',
    docs_url='/docs',
    redoc_url='/redoc',
)

origins = [origin.strip() for origin in settings.cors_origins.split(',') if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={'success': False, 'message': str(exc.detail), 'detail': str(exc.detail)},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={'success': False, 'message': 'Invalid request data', 'detail': exc.errors()},
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception('Unhandled error on %s %s', request.method, request.url.path)
    return JSONResponse(
        status_code=500,
        content={'success': False, 'message': 'Something went wrong on our end. Please try again.', 'detail': 'internal_server_error'},
    )


for router in [
    auth.router,
    business.router,
    dashboard.router,
    transactions.router,
    vendors.router,
    budgets.router,
    reports.router,
    notifications.router,
    search.router,
    receipts.router,
    analytics.router,
    forecast.router,
    anomalies.router,
    credit_readiness.router,
]:
    app.include_router(router, prefix='/api')


@app.get('/', summary='Health check')
async def healthcheck():
    return {'status': 'ok', 'service': 'DHAN API'}
