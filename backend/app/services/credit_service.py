"""Transparent prototype financial indicator (NOT a credit score).

Every factor is a plain statistical measure over the business's own
transaction history so the number can always be explained. This must never
be presented as an official credit score or used for real lending
decisions -- callers are responsible for surfacing the disclaimer.
"""
from __future__ import annotations

import statistics

DISCLAIMER = 'Prototype financial indicator — not an official credit score.'

WEIGHTS = {
    'income_consistency': 0.30,
    'expense_consistency': 0.20,
    'cash_flow_stability': 0.30,
    'transaction_history': 0.20,
}


def _consistency_score(values: list[float]) -> int:
    """100 = perfectly steady month-to-month, drops as variability rises."""
    non_zero = [v for v in values if v > 0]
    if len(non_zero) < 2:
        return 50  # not enough history to judge either way
    mean = statistics.mean(non_zero)
    if mean == 0:
        return 50
    try:
        stdev = statistics.stdev(non_zero)
    except statistics.StatisticsError:
        return 100
    cv = stdev / mean  # coefficient of variation
    score = 100 - min(100, cv * 100)
    return max(0, round(score))


def _cash_flow_stability_score(monthly_net: list[float]) -> int:
    if not monthly_net:
        return 50
    positive_months = sum(1 for n in monthly_net if n >= 0)
    ratio_score = (positive_months / len(monthly_net)) * 100

    if len(monthly_net) >= 2:
        mean_abs = statistics.mean(abs(n) for n in monthly_net) or 1
        try:
            stdev = statistics.stdev(monthly_net)
        except statistics.StatisticsError:
            stdev = 0.0
        variability_penalty = min(40, (stdev / mean_abs) * 40)
    else:
        variability_penalty = 0

    score = ratio_score - variability_penalty
    return max(0, min(100, round(score)))


def _transaction_history_score(months_with_data: int, transaction_count: int, months_tracked: int) -> int:
    coverage = min(1.0, months_with_data / max(1, months_tracked)) * 60
    volume = min(40, (transaction_count / 30) * 40)
    return max(0, min(100, round(coverage + volume)))


def calculate_credit_readiness(monthly_totals: list[dict], transaction_count: int) -> dict:
    """monthly_totals: [{month, year, income, expenses}], oldest first."""
    income_series = [m['income'] for m in monthly_totals]
    expense_series = [m['expenses'] for m in monthly_totals]
    net_series = [m['income'] - m['expenses'] for m in monthly_totals]
    months_with_data = sum(1 for m in monthly_totals if m['income'] > 0 or m['expenses'] > 0)

    factors = {
        'income_consistency': _consistency_score(income_series),
        'expense_consistency': _consistency_score(expense_series),
        'cash_flow_stability': _cash_flow_stability_score(net_series),
        'transaction_history': _transaction_history_score(months_with_data, transaction_count, len(monthly_totals) or 1),
    }

    overall = sum(factors[k] * WEIGHTS[k] for k in WEIGHTS)

    return {
        'score': round(overall),
        'factors': factors,
        'disclaimer': DISCLAIMER,
        'methodology': (
            'Composite of income consistency, expense consistency, cash flow stability and '
            'transaction history, each measured from your own recorded transactions.'
        ),
    }
