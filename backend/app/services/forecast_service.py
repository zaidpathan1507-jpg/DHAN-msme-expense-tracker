"""Simple, explainable cash-flow forecasting.

Method: ordinary least-squares linear trend fit over monthly income and
monthly expense totals from historical transactions, projected forward.
This is intentionally a transparent statistical method (not a trained model)
so every number can be explained to a small-business owner. Scenarios apply
a documented multiplier on top of the trend line.
"""
from __future__ import annotations

from calendar import month_abbr
from datetime import date

SCENARIOS = {
    'normal': {'income_mult': 1.0, 'expense_mult': 1.0},
    'higher_spending': {'income_mult': 1.0, 'expense_mult': 1.15},
    'lower_sales': {'income_mult': 0.85, 'expense_mult': 1.0},
}


def _month_key(d: date) -> tuple[int, int]:
    return (d.year, d.month)


def _add_month(year: int, month: int, delta: int) -> tuple[int, int]:
    total = (year * 12 + (month - 1)) + delta
    return total // 12, (total % 12) + 1


def _linear_fit(values: list[float]) -> tuple[float, float]:
    """Least squares slope/intercept for y = a + b*x, x = 0..n-1."""
    n = len(values)
    if n == 0:
        return 0.0, 0.0
    if n == 1:
        return values[0], 0.0

    xs = list(range(n))
    mean_x = sum(xs) / n
    mean_y = sum(values) / n
    numerator = sum((x - mean_x) * (y - mean_y) for x, y in zip(xs, values))
    denominator = sum((x - mean_x) ** 2 for x in xs)
    slope = numerator / denominator if denominator else 0.0
    intercept = mean_y - slope * mean_x
    return intercept, slope


def build_monthly_totals(transactions: list[dict], months_back: int = 6) -> list[dict]:
    """Aggregate transactions into the last `months_back` calendar months.

    Each transaction dict needs: date (date), type ('income'|'expense'), amount (Decimal|float).
    Always returns `months_back` entries (zero-filled for months with no data),
    ending at the most recent month present in the data (or today if empty).
    """
    if transactions:
        latest = max(t['date'] for t in transactions)
    else:
        latest = date.today()

    buckets: dict[tuple[int, int], dict[str, float]] = {}
    year, month = latest.year, latest.month
    ordered_keys: list[tuple[int, int]] = []
    for i in range(months_back - 1, -1, -1):
        y, m = _add_month(year, month, -i)
        key = (y, m)
        ordered_keys.append(key)
        buckets[key] = {'income': 0.0, 'expenses': 0.0}

    for t in transactions:
        key = _month_key(t['date'])
        if key not in buckets:
            continue
        amt = float(t['amount'])
        if t['type'] == 'income':
            buckets[key]['income'] += amt
        else:
            buckets[key]['expenses'] += amt

    result = []
    for (y, m) in ordered_keys:
        result.append({
            'year': y,
            'month': m,
            'label': f'{month_abbr[m]} {y}',
            'income': round(buckets[(y, m)]['income'], 2),
            'expenses': round(buckets[(y, m)]['expenses'], 2),
        })
    return result


def forecast_cash_flow(
    transactions: list[dict],
    scenario: str = 'normal',
    months_back: int = 6,
    months_forward: int = 3,
    starting_balance: float = 0.0,
) -> dict:
    scenario_key = scenario if scenario in SCENARIOS else 'normal'
    mult = SCENARIOS[scenario_key]

    monthly = build_monthly_totals(transactions, months_back=months_back)
    income_series = [m['income'] for m in monthly]
    expense_series = [m['expenses'] for m in monthly]

    income_intercept, income_slope = _linear_fit(income_series)
    expense_intercept, expense_slope = _linear_fit(expense_series)

    last_year, last_month = monthly[-1]['year'], monthly[-1]['month']

    forecast_points = []
    running_balance = starting_balance
    for step in range(1, months_forward + 1):
        x = len(monthly) - 1 + step
        expected_income = max(0.0, (income_intercept + income_slope * x)) * mult['income_mult']
        expected_expenses = max(0.0, (expense_intercept + expense_slope * x)) * mult['expense_mult']
        net = expected_income - expected_expenses
        running_balance += net
        y, m = _add_month(last_year, last_month, step)
        forecast_points.append({
            'year': y,
            'month': m,
            'label': f'{month_abbr[m]} {y}',
            'expected_income': round(expected_income, 2),
            'expected_expenses': round(expected_expenses, 2),
            'net': round(net, 2),
            'projected_balance': round(running_balance, 2),
        })

    historical_balance = starting_balance
    historical_points = []
    for m in monthly:
        net = m['income'] - m['expenses']
        historical_balance += 0  # historical running balance not reconstructable without opening balance; expose net only
        historical_points.append({**m, 'net': round(net, 2)})

    trend_direction = 'improving' if (income_slope - expense_slope) > 1 else ('declining' if (income_slope - expense_slope) < -1 else 'stable')

    return {
        'scenario': scenario_key,
        'scenario_label': scenario_key.replace('_', ' ').title(),
        'historical': historical_points,
        'forecast': forecast_points,
        'trend_direction': trend_direction,
        'method': 'linear-trend-projection',
        'disclaimer': 'This is an estimate based on historical trends, not a guarantee of future cash flow.',
    }
