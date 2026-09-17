# DHAN — Product Roadmap

DHAN's full vision (per the original spec) is a complete frontend-only
financial operating system for MSMEs: onboarding, a live dashboard, transaction
management, analytics, forecasting, anomaly detection, credit scoring,
budgets, vendor analysis, reports, and settings — all backed by mock data.

**Milestone 1 (done):** the branded landing page and the main dashboard shell —
navigation (desktop sidebar + mobile bottom nav/drawer), top bar (search,
notifications, date range, add-transaction), the dashboard overview (metric
cards, Cash Flow Overview chart, Spending Breakdown, DHAN Insights), and the
full Add Expense flow including simulated receipt OCR, plus Add Income. This
is the flagship demo loop: **Welcome → Dashboard → Add Expense → Simulated OCR
→ Dashboard updates.**

Every remaining sidebar item (Transactions, Analytics, Cash Flow, Credit
Readiness, Vendors, Budgets, Reports, Settings, Help) is visible in the nav
today and shows a friendly "arrives in the next milestone" toast instead of a
dead page — nothing is left half-built or broken.

The milestones below are independent and can be built in any order; the
suggested order front-loads the screens the judge/demo flow visits first.

## Milestone 2 — Transactions

- Transaction list/table (date, description, category, vendor, type, amount,
  status) seeded with realistic Indian MSME transactions.
- Search, date/category/type/vendor filters.
- Click a row → detail drawer (receipt preview placeholder, payment method,
  notes, edit, delete). Delete/edit operate on the same `useAppStore` state
  Add Expense/Add Income already write to.
- Empty state for "no transactions" (only reachable if a future "clear all"
  action is added).

## Milestone 3 — Analytics

- Income vs. expenses trend, monthly trends, vendor spending, budget
  utilization sections, reusing `seriesForRange`/`SPENDING_BREAKDOWN` from
  `fixtures.ts`.
- Vendor analysis list ("Where your business spends") reusing `VENDORS`.

## Milestone 4 — Cash Flow Forecast

- Current balance / projected next month / expected income / expected
  expenses summary row.
- Historical → forecast area/line chart (extends the forecast logic already
  in `withForecast()`).
- Scenario selector (Normal / Higher Spending / Lower Sales) that recomputes
  the projected numbers.

## Milestone 5 — Anomaly Detection ("Unusual Activity")

- Alert cards (severity, explanation, "Review transaction") driven by a new
  `ANOMALIES` fixture.
- Clicking an alert opens the related transaction — depends on Milestone 2's
  transaction detail drawer.

## Milestone 6 — Credit Readiness

- Large circular prototype score (reuses `BASELINE.healthScore`), clearly
  labeled as a non-official indicator.
- Factor breakdown (income consistency, expense consistency, cash flow
  stability, transaction history) and "How to improve" tips.

## Milestone 7 — Budgets

- Budget vs. actual per category (Raw Materials, Salary, Rent, Utilities,
  Marketing) with progress bars and an overspending warning state.
- "+ Create Budget" modal, following the same pattern as `AddExpenseModal`.

## Milestone 8 — Vendors

- Vendor table/cards (total spend, transaction count, last transaction,
  trend) from the existing `VENDORS` fixture.
- Vendor detail drawer with a spending-history chart.

## Milestone 9 — Reports & Settings

- Reports page: report cards (Monthly Expense, Income, GST-ready Summary,
  Vendor, Cash Flow) with a simulated "Preparing report… → Report ready" flow
  and a demo download/notification.
- Business Profile / Settings screen with editable fields and a
  "Reset Demo Data" action wired to `useAppStore().resetDemoData()` (already
  implemented in `src/lib/store.tsx`, just not yet exposed in the UI).

## Notes for whoever picks this up

- `src/lib/store.tsx` already exposes `resetDemoData()` and category-level
  totals — most new screens should read from `useAppStore()` rather than
  inventing new state.
- Keep new mock data in `src/data/fixtures.ts` so numbers stay consistent
  across screens (e.g. a vendor's total spend should match its transactions).
- Follow the "soon" toast pattern in `src/components/layout/nav-items.ts` for
  any screen not yet built, and flip it to a real route the moment it is.
