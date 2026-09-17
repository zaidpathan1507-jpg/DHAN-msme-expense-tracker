import os
import uuid
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models.receipt import Receipt
from app.models.user import User
from app.routers.auth import get_current_user_dependency
from app.services.categorization import categorize_text
from app.services.ocr_service import extract_amount, extract_date, extract_vendor, run_ocr, tesseract_available

router = APIRouter(prefix='/receipts', tags=['Receipts'])
settings = get_settings()

ALLOWED_TYPES = {'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'}
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.pdf'}


async def _handle_upload(file: UploadFile, current_user: User, db: Session) -> dict:
    if file is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='No file was provided')

    content_type = (file.content_type or '').lower()
    ext = os.path.splitext(file.filename or '')[1].lower()
    if content_type not in ALLOWED_TYPES and ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Unsupported file type. Use JPG, PNG, WEBP or PDF.')

    data = await file.read()
    if len(data) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Uploaded file is empty')
    if len(data) > settings.max_upload_size:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f'File exceeds the {settings.max_upload_size // (1024 * 1024)}MB limit')

    os.makedirs(settings.upload_dir, exist_ok=True)
    stored_name = f'{uuid.uuid4().hex}{ext or ""}'
    stored_path = os.path.join(settings.upload_dir, stored_name)
    with open(stored_path, 'wb') as fh:
        fh.write(data)

    text, ocr_ran = run_ocr(data, content_type)

    extracted_vendor = extract_vendor(text) if text else None
    extracted_amount = extract_amount(text) if text else None
    extracted_date = extract_date(text) if text else None
    category, confidence = categorize_text(text, extracted_vendor)

    receipt = Receipt(
        business_id=current_user.business_id,
        file_name=file.filename or stored_name,
        file_path=stored_path,
        mime_type=content_type or 'application/octet-stream',
        text_content=text,
        extracted_vendor=extracted_vendor,
        extracted_amount=str(extracted_amount) if extracted_amount is not None else None,
        extracted_date=extracted_date,
    )
    db.add(receipt)
    db.commit()
    db.refresh(receipt)

    if not ocr_ran:
        return {
            'receipt_id': receipt.id,
            'status': 'ocr_unavailable',
            'message': (
                'Text recognition is not available in this environment right now. '
                'Please review and enter the receipt details manually.'
            ),
            'vendor': None,
            'amount': None,
            'date': None,
            'category': None,
            'confidence': 0.0,
            'ocr_engine_available': tesseract_available(),
        }

    return {
        'receipt_id': receipt.id,
        'status': 'extracted',
        'vendor': extracted_vendor,
        'amount': extracted_amount,
        'date': extracted_date or date.today().isoformat(),
        'category': category,
        'confidence': confidence,
        'ocr_engine_available': True,
    }


@router.post('/upload', summary='Upload a receipt for OCR extraction and category detection')
async def upload_receipt(file: UploadFile, current_user: User = Depends(get_current_user_dependency), db: Session = Depends(get_db)):
    return await _handle_upload(file, current_user, db)


@router.post('/extract', summary='Alias of /receipts/upload, kept for backward compatibility')
async def extract_receipt(file: UploadFile, current_user: User = Depends(get_current_user_dependency), db: Session = Depends(get_db)):
    return await _handle_upload(file, current_user, db)
