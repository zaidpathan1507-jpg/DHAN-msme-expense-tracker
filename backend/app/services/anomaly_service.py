"""Unusual-expense detection using per-category mean/standard deviation.

Statistically simple and explainable on purpose: a transaction is flagged
when it deviates enough from that category's historical average. This is
NOT fraud detection -- language is deliberately softened everywhere.
"""
from __future__ import annotations

import statistics

MIN_SAMPLES_FOR_STDDEV = 2
STDDEV_THRESHOLD = 1.5
PCT_DEVIATION_THRESHOLD = 40.0


def detect_anomalies(transactions: list[dict]) -> list[dict]:
    """transactions: list of dicts with id, category, amount (float), date (date/str), description."""
    by_category: dict[str, list[dict]] = {}
    for t in transactions:
        if t.get('type') != 'expense':
            continue
        cat = t.get('category') or 'Other'
        by_category.setdefault(cat, []).append(t)

    anomalies: list[dict] = []

    for cat, items in by_category.items():
        amounts = [float(i['amount']) for i in items]
        if len(amounts) < MIN_SAMPLES_FOR_STDDEV:
            continue

        avg = statistics.mean(amounts)
        try:
            stdev = statistics.stdev(amounts)
        except statistics.StatisticsError:
            stdev = 0.0

        for item in items:
            amount = float(item['amount'])
            if avg <= 0:
                continue
            pct_deviation = ((amount - avg) / avg) * 100

            is_stddev_outlier = stdev > 0 and (amount - avg) > STDDEV_THRESHOLD * stdev
            is_pct_outlier = pct_deviation >= PCT_DEVIATION_THRESHOLD

            if not (is_stddev_outlier or is_pct_outlier):
                continue

            if pct_deviation >= 80 or (stdev > 0 and (amount - avg) > 2.5 * stdev):
                severity = 'high'
            elif pct_deviation >= 50:
                severity = 'medium'
            else:
                severity = 'low'

            anomalies.append({
                'transaction_id': item.get('id'),
                'category': cat,
                'description': item.get('description'),
                'date': str(item.get('date')),
                'amount': round(amount, 2),
                'normal_average': round(avg, 2),
                'deviation_percentage': round(pct_deviation, 1),
                'severity': severity,
                'explanation': (
                    f'Unusual expense detected: this {cat} transaction of ₹{amount:,.0f} is '
                    f'{pct_deviation:.0f}% above the category average of ₹{avg:,.0f} '
                    f'(based on {len(amounts)} transactions).'
                ),
            })

    anomalies.sort(key=lambda a: a['deviation_percentage'], reverse=True)
    return anomalies
