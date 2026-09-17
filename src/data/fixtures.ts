// Central mock dataset for the DHAN prototype. Numbers are hand-tuned so every
// screen (metric cards, spending breakdown, insights) tells a consistent story.

export interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  category?: string
  source?: string
  vendor?: string
  date: string // ISO date
  paymentMethod: string
  notes?: string
  addedVia?: 'manual' | 'receipt'
}

export const EXPENSE_CATEGORIES = [
  'Rent',
  'Salary',
  'Raw Material',
  'Electricity',
  'Transport',
  'Marketing',
  'Office',
  'Other',
] as const

export const INCOME_SOURCES = ['Sales', 'Online Orders', 'Wholesale', 'Services', 'Other'] as const

export const PAYMENT_METHODS = ['Cash', 'UPI', 'Bank Transfer', 'Card', 'Cheque']

export const BUSINESS_PROFILE = {
  name: 'Sharma Traders',
  ownerGreetingName: 'Sharma Traders',
  type: 'Retail',
  location: 'Jaipur, Rajasthan, India',
  gstin: '08ABCDE1234F1Z5',
  period: 'Monthly',
}

// Baseline period totals — these are the headline numbers from the product spec.
export const BASELINE = {
  income: 248500,
  expenses: 132400,
  incomeChangePct: 12.8,
  expenseChangePct: 4.2,
  netChangePct: 18.4,
  healthScore: 82,
}

export const SPENDING_BREAKDOWN = [
  { category: 'Raw Material', amount: 54000, topVendor: 'ABC Suppliers', transactions: 6, trend: 'up' as const },
  { category: 'Salary', amount: 24000, topVendor: 'Payroll', transactions: 4, trend: 'flat' as const },
  { category: 'Transport', amount: 18400, topVendor: 'City Transport Co.', transactions: 9, trend: 'up' as const },
  { category: 'Electricity', amount: 17900, topVendor: 'Metro Electricity Board', transactions: 1, trend: 'up' as const },
  { category: 'Rent', amount: 12000, topVendor: 'Property Owner', transactions: 1, trend: 'flat' as const },
  { category: 'Marketing', amount: 4600, topVendor: 'Local Print Media', transactions: 3, trend: 'down' as const },
  { category: 'Office', amount: 0, topVendor: '—', transactions: 0, trend: 'flat' as const },
  { category: 'Other', amount: 1500, topVendor: 'Misc.', transactions: 2, trend: 'flat' as const },
]

export const VENDORS = [
  { name: 'ABC Suppliers', totalSpend: 42500, transactions: 7, lastTransaction: '2026-09-14', trend: 'up' as const },
  { name: 'Metro Electricity Board', totalSpend: 17900, transactions: 1, lastTransaction: '2026-09-10', trend: 'up' as const },
  { name: 'City Transport Co.', totalSpend: 14800, transactions: 9, lastTransaction: '2026-09-15', trend: 'up' as const },
  { name: 'Reliance Retail', totalSpend: 4850, transactions: 1, lastTransaction: '2026-09-16', trend: 'flat' as const },
]

export type InsightSeverity = 'positive' | 'watch' | 'warning'

export const INSIGHTS = [
  {
    id: 'forecast',
    icon: 'TrendingUp',
    title: 'Cash Flow Forecast',
    severity: 'positive' as InsightSeverity,
    summary: 'Based on your current spending pattern, your projected cash balance next month is ₹94,200.',
    detail:
      'This projection uses your last 3 months of income and expense patterns. Income has been trending upward while expenses stayed nearly flat, which keeps your projected balance healthy. Review the Cash Flow Forecast screen for the full breakdown by scenario.',
  },
  {
    id: 'anomaly',
    icon: 'AlertTriangle',
    title: 'Anomaly Alert',
    severity: 'warning' as InsightSeverity,
    summary: 'Electricity expenses are 28% higher than your usual monthly average.',
    detail:
      'Your average monthly electricity spend over the last 6 months is around ₹14,000. This month it reached ₹17,900. This can happen from seasonal usage changes, but it is worth a quick check against your last bill.',
  },
  {
    id: 'opportunity',
    icon: 'Lightbulb',
    title: 'Spending Opportunity',
    severity: 'watch' as InsightSeverity,
    summary: 'You spent ₹18,400 on transport this month. Review vendor rates to reduce costs.',
    detail:
      'Transport costs have grown across 9 separate transactions this month, mostly with City Transport Co. Consolidating deliveries or renegotiating rates could meaningfully reduce this line item next month.',
  },
  {
    id: 'health',
    icon: 'HeartPulse',
    title: 'Business Health',
    severity: 'positive' as InsightSeverity,
    summary: 'Your income consistency improved compared with last month.',
    detail:
      'Income arrived on a more regular schedule this month with fewer large gaps between deposits. Consistent income is one of the strongest factors in your Credit Readiness score.',
  },
]

export const NOTIFICATIONS = [
  { id: 'n1', title: 'Cash flow forecast updated', time: '2 hours ago', read: false },
  { id: 'n2', title: 'Unusual electricity expense detected', time: '5 hours ago', read: false },
  { id: 'n3', title: 'You are close to your Raw Materials budget', time: 'Yesterday', read: false },
  { id: 'n4', title: 'Monthly report is ready', time: '2 days ago', read: true },
]

export interface SearchItem {
  label: string
  type: 'Category' | 'Vendor' | 'Income Source'
  meta?: string
}

export const SEARCH_INDEX: SearchItem[] = [
  ...SPENDING_BREAKDOWN.map((c) => ({ label: c.category, type: 'Category' as const, meta: `₹${c.amount.toLocaleString('en-IN')} this period` })),
  ...VENDORS.map((v) => ({ label: v.name, type: 'Vendor' as const, meta: `₹${v.totalSpend.toLocaleString('en-IN')} total spend` })),
  ...INCOME_SOURCES.map((s) => ({ label: s, type: 'Income Source' as const })),
]

export const MOCK_RECEIPT_EXTRACTION = {
  vendor: 'Reliance Retail',
  amount: 4850,
  date: '2026-09-16',
  category: 'Raw Material',
}

// --- Deterministic cash flow series (no Math.random, so SSR output matches the client) ---

function wave(i: number, base: number, amplitude: number, freq: number, phase: number, trend: number) {
  return Math.round(base + amplitude * Math.sin(i * freq + phase) + trend * i)
}

export interface CashFlowPoint {
  label: string
  income: number
  expenses: number
  net: number
  forecast?: boolean
}

function buildDaily(days: number): CashFlowPoint[] {
  const points: CashFlowPoint[] = []
  const anchor = new Date('2026-09-17T00:00:00')
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(anchor)
    d.setDate(d.getDate() - i)
    const idx = days - i
    const income = Math.max(3200, wave(idx, 8200, 3400, 0.55, 0.6, 40))
    const expenses = Math.max(1800, wave(idx, 4400, 1600, 0.48, 1.4, 18))
    points.push({
      label: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      income,
      expenses,
      net: income - expenses,
    })
  }
  return points
}

function buildMonthly(months: number): CashFlowPoint[] {
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const points: CashFlowPoint[] = []
  const anchorMonth = 8 // September (0-indexed)
  for (let i = months - 1; i >= 0; i--) {
    const m = (((anchorMonth - i) % 12) + 12) % 12
    const idx = months - i
    const income = wave(idx, 215000, 42000, 0.5, 0.3, 3200)
    const expenses = wave(idx, 118000, 18000, 0.45, 1.1, 1400)
    points.push({ label: names[m], income, expenses, net: income - expenses })
  }
  return points
}

export const DAILY_SERIES = buildDaily(30)
export const MONTHLY_SERIES = buildMonthly(12)

export function withForecast(series: CashFlowPoint[], count = 5): CashFlowPoint[] {
  const last = series[series.length - 1]
  const forecastPoints: CashFlowPoint[] = []
  for (let i = 1; i <= count; i++) {
    const income = Math.round(last.income * (1 + 0.015 * i))
    const expenses = Math.round(last.expenses * (1 + 0.008 * i))
    forecastPoints.push({
      label: `+${i}`,
      income,
      expenses,
      net: income - expenses,
      forecast: true,
    })
  }
  return [...series, ...forecastPoints]
}

export function seriesForRange(range: '7D' | '30D' | '3M' | '1Y'): CashFlowPoint[] {
  if (range === '7D') return withForecast(DAILY_SERIES.slice(-7), 3)
  if (range === '30D') return withForecast(DAILY_SERIES, 5)
  if (range === '3M') return withForecast(MONTHLY_SERIES.slice(-3), 2)
  return withForecast(MONTHLY_SERIES, 2)
}
