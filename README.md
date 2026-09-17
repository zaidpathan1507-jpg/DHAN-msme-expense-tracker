# DHAN

**Know your money. Grow your business.**

DHAN is a premium, frontend-only prototype of a financial management dashboard
built for Indian MSMEs — small business owners who currently track money in
notebooks, paper bills, or WhatsApp. It's a UI/UX showcase: there is no backend,
no database, and no real authentication. Every number is realistic mock data,
and every interaction is fully functional in the browser.

## What's live right now

- **Landing page** — hero, animated income → expenses → cash flow → health
  visualization, floating metric cards, trust indicators.
- **Dashboard overview** — animated metric cards (income, expenses, net cash
  flow, business health), a Cash Flow Overview chart with 7D/30D/3M/1Y tabs and
  a forecast region, a Spending Breakdown chart with a clickable category
  detail panel, and a DHAN Insights section.
- **Add Expense** — manual entry, or drag-and-drop a receipt and watch a
  simulated OCR pipeline ("Scanning receipt…" → "Reading amount…" → …) extract
  editable mock values before saving.
- **Add Income** — a quick form for logging incoming money.
- Global search, a notifications dropdown, a date-range selector, and a
  responsive layout (desktop sidebar, mobile bottom nav + slide-out menu) live
  in the top bar and sidebar.
- A **Demo Mode** badge and preloaded sample data so the app is fully
  explorable with zero setup.

Everything you add through "Add Expense"/"Add Income" updates the dashboard
totals and category breakdown live, and persists to `localStorage` for the
session.

See `PLAN.md` for the screens still on the roadmap (Transactions, Analytics,
Cash Flow Forecast, Anomaly Detection, Credit Readiness, Budgets, Vendors,
Reports, Settings).

## Tech stack

- React 19 + TanStack Start (file-based routing, Vite 7 under the hood)
- Tailwind CSS 4
- Recharts 3
- Lucide React icons
- No backend, no external services — pure frontend

## Running locally

```bash
pnpm install
pnpm dev
```

Then open the printed local URL. `pnpm build` produces a production build in
`dist/client`, ready for static/Netlify hosting.
For a deployed app connected to the FastAPI backend, set the Netlify environment
variable `VITE_API_URL` to the public backend URL including `/api` (for example,
`https://api.example.com/api`). Without it, the app uses the local development
default `http://localhost:8000/api` and runs in its offline state.

## Project structure

See `AGENTS.md` for a full directory breakdown and conventions.
