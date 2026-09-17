# AGENTS.md

This file orients AI agents (and humans) picking up work on DHAN.

## What this project is

DHAN is a frontend-only prototype of a financial management dashboard for Indian
MSMEs (small/medium businesses). There is no backend, no database, and no real
authentication — every number on screen comes from `src/data/fixtures.ts` plus
whatever the user adds through the UI during their session (kept in
`localStorage`). See `PLAN.md` for the roadmap of screens still to be built.

## Tech stack

- TanStack Start (file-based routing on top of Vite + React 19) — see `src/routes/`
- Tailwind CSS 4 (CSS-first config, no `tailwind.config.js` — theme/keyframes live in `src/styles.css`)
- Recharts 3 for all charts
- Lucide React for icons
- No state management library — a single React context (`src/lib/store.tsx`) plus `useState`/`localStorage`

## Directory structure

```
src/
  routes/            file-based routes (TanStack Router)
    __root.tsx       html shell, global providers (AppStoreProvider, ToastProvider)
    index.tsx        "/" — landing page
    dashboard.tsx     "/dashboard" — main app shell + overview
  components/
    landing/         landing page sections
    layout/          Sidebar, Topbar, MobileNav, DashboardShell, nav-items.ts
    dashboard/       metric cards, cash flow chart, spending breakdown, insights
    expense/         Add Expense modal, Add Income modal, receipt OCR simulation
    ui/              small reusable primitives (Modal, Toast, AnimatedNumber, Logo)
  data/
    fixtures.ts      all mock data: transactions, categories, vendors, insights,
                      notifications, and the deterministic cash-flow series
  lib/
    store.tsx         AppStoreProvider/useAppStore — the only "backend" this app has
    format.ts         ₹ currency formatting helpers
    useClickOutside.ts
```

## Key conventions

- **No backend, ever.** Anything that would normally need a server (OCR, AI insights,
  credit scoring, report generation) is simulated client-side with fixed delays and
  fixture data. Keep it that way — do not wire up real APIs.
- **Numbers must reconcile.** `BASELINE` totals in `fixtures.ts` and the category
  amounts in `SPENDING_BREAKDOWN` are hand-tuned to sum consistently (income −
  expenses = net cash flow, category amounts sum to total expenses). If you add or
  change a fixture number, re-check the sums.
- **SSR-safe randomness.** TanStack Start renders on the server first. Anything shown
  during the initial render must be deterministic — the cash-flow series in
  `fixtures.ts` uses a seeded sine-wave generator (`wave()`), never `Math.random()`,
  for exactly this reason. `Math.random()` is only used inside event handlers (e.g.
  generating a transaction id after a click).
- **Unbuilt nav items are honest, not fake.** Sidebar/mobile-nav items that don't have
  a screen yet (Transactions, Analytics, Budgets, etc.) show a toast — "arrives in the
  next milestone" — instead of a dead link or a fake page. When you build one of these
  screens, wire its `nav-items.ts` entry from `{ type: 'soon' }` to a real route.
- **Path alias**: `@/*` maps to `src/*` (configured in `tsconfig.json` + `vite-tsconfig-paths`).
- Strict TypeScript with `noUnusedLocals`/`noUnusedParameters` — keep imports clean.

## Where to go next

`PLAN.md` breaks the remaining product spec (Transactions, Analytics, Cash Flow
Forecast, Anomaly Detection, Credit Readiness, Budgets, Vendors, Reports, Settings,
etc.) into milestones. Start there before adding new screens.
