"""Rule-based expense categorization.

Deliberately simple and explainable: keyword -> category lookup. The public
entrypoint `categorize_text` is structured so a trained ML model can later be
swapped in behind the same signature (text in, (category, confidence) out)
without touching call sites.
"""
from __future__ import annotations

# Ordered most-specific-first; first matching keyword wins.
KEYWORD_RULES: list[tuple[str, str]] = [
    ('electricity', 'Electricity'),
    ('power bill', 'Electricity'),
    ('electric', 'Electricity'),
    ('salary', 'Salary'),
    ('payroll', 'Salary'),
    ('wages', 'Salary'),
    ('rent', 'Rent'),
    ('lease', 'Rent'),
    ('fuel', 'Transport'),
    ('petrol', 'Transport'),
    ('diesel', 'Transport'),
    ('transport', 'Transport'),
    ('freight', 'Transport'),
    ('logistics', 'Transport'),
    ('delivery', 'Transport'),
    ('raw material', 'Raw Material'),
    ('raw materials', 'Raw Material'),
    ('supplier', 'Raw Material'),
    ('inventory', 'Raw Material'),
    ('materials', 'Raw Material'),
    ('advertising', 'Marketing'),
    ('marketing', 'Marketing'),
    ('promotion', 'Marketing'),
    ('social media', 'Marketing'),
    ('print media', 'Marketing'),
    ('stationery', 'Office'),
    ('office supplies', 'Office'),
    ('printer', 'Office'),
    ('internet', 'Office'),
    ('broadband', 'Office'),
    ('courier', 'Office'),
]

DEFAULT_CATEGORY = 'Other'
DEFAULT_CONFIDENCE = 0.35
MATCH_CONFIDENCE = 0.82


def categorize_text(*parts: str | None) -> tuple[str, float]:
    """Categorize based on free-text hints (description, vendor, OCR text).

    Returns (category, confidence). Confidence is a simple heuristic score,
    not a calibrated probability -- keeping the method transparent so it can
    be explained to a user rather than treated as a black box.
    """
    haystack = ' '.join(p for p in parts if p).lower()
    if not haystack.strip():
        return DEFAULT_CATEGORY, 0.0

    for keyword, category in KEYWORD_RULES:
        if keyword in haystack:
            return category, MATCH_CONFIDENCE

    return DEFAULT_CATEGORY, DEFAULT_CONFIDENCE
