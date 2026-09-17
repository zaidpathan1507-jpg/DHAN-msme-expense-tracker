# DHAN Backend

FastAPI + SQLAlchemy + PostgreSQL (SQLite by default for local/demo use)
backend for the DHAN financial management platform.

## Setup

1. Create a virtual environment:
   `python -m venv .venv`
2. Activate it (Windows): `.venv\Scripts\activate` — (macOS/Linux): `source .venv/bin/activate`
3. Install dependencies:
   `pip install -r requirements.txt`
4. Copy the environment file:
   `copy .env.example .env` (Windows) or `cp .env.example .env` (macOS/Linux)
5. (Optional, for PostgreSQL) create a database and update `DATABASE_URL` in
   `.env`:
   `createdb dhan`
6. Run migrations:
   `alembic upgrade head`
7. Seed demo data (creates "Sharma Traders" with ~6 months of realistic
   transactions and prints demo login credentials):
   `python seed.py`
8. Start the API server:
   `uvicorn app.main:app --reload`

## Tests

`pytest`

Tests run against an isolated SQLite file (`test_dhan.db`), independent of
your dev database, and cover auth, transactions, dashboard, budgets,
vendors, analytics, credit readiness and anomaly detection.

## API docs

- Swagger: http://localhost:8000/docs
- Redoc: http://localhost:8000/redoc

## Notes

- OCR (`/api/receipts/upload`) uses `pytesseract`, which needs the Tesseract
  binary installed on the machine. If it isn't available, the endpoint
  degrades gracefully (`status: "ocr_unavailable"`) instead of crashing or
  faking a result.
- Credit Readiness is explicitly a prototype indicator, not a real credit
  score — every response includes that disclaimer.
- Anomaly detection flags statistically unusual expenses; it never claims to
  detect fraud.
