"""Receipt OCR with a graceful no-crash fallback.

If pytesseract / the system tesseract binary are unavailable, this module
reports that explicitly rather than pretending extraction succeeded.
"""
from __future__ import annotations

import re
from datetime import datetime
from io import BytesIO

_TESSERACT_AVAILABLE: bool | None = None


def tesseract_available() -> bool:
    global _TESSERACT_AVAILABLE
    if _TESSERACT_AVAILABLE is not None:
        return _TESSERACT_AVAILABLE
    try:
        import pytesseract

        pytesseract.get_tesseract_version()
        _TESSERACT_AVAILABLE = True
    except Exception:
        _TESSERACT_AVAILABLE = False
    return _TESSERACT_AVAILABLE


def run_ocr(file_bytes: bytes, content_type: str) -> tuple[str | None, bool]:
    """Returns (extracted_text, ocr_ran). ocr_ran=False means OCR was skipped
    (not available / unsupported file type), not that it silently failed."""
    if not tesseract_available():
        return None, False

    if content_type not in ('image/jpeg', 'image/png', 'image/jpg', 'image/webp'):
        return None, False

    try:
        import pytesseract
        from PIL import Image

        image = Image.open(BytesIO(file_bytes))
        text = pytesseract.image_to_string(image)
        return text, True
    except Exception:
        return None, False


AMOUNT_PATTERN = re.compile(r'(?:rs\.?|inr|₹)\s*([0-9][0-9,]*\.?[0-9]{0,2})', re.IGNORECASE)
FALLBACK_AMOUNT_PATTERN = re.compile(r'\b(\d{2,3}(?:,\d{3})*(?:\.\d{1,2})?)\b')
DATE_PATTERNS = [
    re.compile(r'\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b'),
    re.compile(r'\b(\d{4}-\d{2}-\d{2})\b'),
]


def extract_amount(text: str) -> float | None:
    match = AMOUNT_PATTERN.search(text)
    candidates = []
    if match:
        candidates.append(match.group(1))
    candidates.extend(FALLBACK_AMOUNT_PATTERN.findall(text))
    for raw in candidates:
        try:
            value = float(raw.replace(',', ''))
            if value > 0:
                return round(value, 2)
        except ValueError:
            continue
    return None


def extract_date(text: str) -> str | None:
    for pattern in DATE_PATTERNS:
        match = pattern.search(text)
        if not match:
            continue
        raw = match.group(1)
        for fmt in ('%d/%m/%Y', '%d-%m-%Y', '%d/%m/%y', '%d-%m-%y', '%Y-%m-%d'):
            try:
                return datetime.strptime(raw, fmt).date().isoformat()
            except ValueError:
                continue
    return None


def extract_vendor(text: str) -> str | None:
    for line in text.splitlines():
        cleaned = line.strip()
        if len(cleaned) >= 3 and any(c.isalpha() for c in cleaned):
            return cleaned[:200]
    return None
