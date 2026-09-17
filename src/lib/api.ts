import type { Transaction } from '@/data/fixtures'

export const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8000/api'

export const AUTH_STORAGE_KEY = 'dhan_auth_token'

export function getAuthToken() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(AUTH_STORAGE_KEY)
}

export function setAuthToken(token: string | null) {
  if (typeof window === 'undefined') return
  if (!token) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    return
  }
  window.localStorage.setItem(AUTH_STORAGE_KEY, token)
}

export class BackendUnavailableError extends Error {
  constructor() {
    super('Unable to connect to DHAN server.')
    this.name = 'BackendUnavailableError'
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken()
  const headers = new Headers(options.headers ?? {})

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers })
  } catch {
    throw new BackendUnavailableError()
  }

  if (!response.ok) {
    let detail: string | undefined
    try {
      const payload = await response.json()
      detail = payload?.message ?? payload?.detail
    } catch {
      detail = undefined
    }
    if (response.status === 401) {
      setAuthToken(null)
    }
    throw new Error(detail ?? `Request failed (${response.status})`)
  }

  if (response.status === 204) return undefined as T
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) return undefined as T
  return (await response.json()) as T
}

async function apiFetchBlob(path: string, options: RequestInit = {}): Promise<Blob> {
  const token = getAuthToken()
  const headers = new Headers(options.headers ?? {})
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response: Response
  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers })
  } catch {
    throw new BackendUnavailableError()
  }
  if (!response.ok) throw new Error(`Request failed (${response.status})`)
  return response.blob()
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.URL.revokeObjectURL(url)
}

// ---------- Auth ----------

export interface LoginResponse {
  access_token: string
  token_type: string
  user: {
    id: number
    email: string
    mobile: string
    full_name: string
    business_id: number
    business_name?: string
  }
}

export async function loginWithMobile(mobile: string, password: string) {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ mobile, password }),
  })
}

export async function registerBusiness(payload: {
  email: string
  mobile: string
  full_name: string
  password: string
  business_name: string
}) {
  return apiFetch<LoginResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function fetchCurrentUser() {
  return apiFetch<{ id: number; email: string; mobile: string; full_name: string; business_id: number }>('/auth/me')
}

// ---------- Business ----------

export interface BusinessProfile {
  id: number
  business_name: string
  business_type: string | null
  owner_name: string | null
  mobile: string | null
  email: string | null
  address: string | null
  city: string | null
  state: string | null
  gst_number: string | null
  financial_year: string | null
}

export async function fetchBusinessProfile() {
  return apiFetch<BusinessProfile>('/business')
}

export async function updateBusinessProfile(payload: Partial<Omit<BusinessProfile, 'id'>>) {
  return apiFetch<BusinessProfile>('/business', { method: 'PUT', body: JSON.stringify(payload) })
}

// ---------- Dashboard ----------

export interface DashboardSummary {
  total_income: number
  total_expenses: number
  net_cash_flow: number
  business_health: number
  transaction_count: number
  current_balance: number
}

export async function fetchDashboardSummary() {
  return apiFetch<DashboardSummary>('/dashboard/summary')
}

export interface CashFlowPoint {
  date: string
  label?: string
  income: number
  expenses: number
  net: number
}

export async function fetchDashboardCashFlow(range: '7d' | '30d' | '3m' | '1y') {
  return apiFetch<CashFlowPoint[]>(`/dashboard/cash-flow?range=${range}`)
}

export interface SpendingBreakdownItem {
  category: string
  amount: number
  percentage: number
}

export async function fetchSpendingBreakdown() {
  return apiFetch<SpendingBreakdownItem[]>('/dashboard/spending-breakdown')
}

// ---------- Transactions ----------

export interface TransactionsPage {
  items: Array<{
    id: number
    business_id: number
    type: 'income' | 'expense'
    amount: number
    description: string
    category: string | null
    vendor: string | null
    date: string
    payment_method: string
    notes: string | null
    receipt_url: string | null
  }>
  page: number
  limit: number
  total: number
  pages: number
}

export interface TransactionFilters {
  search?: string
  type?: string
  category?: string
  vendor?: string
  start_date?: string
  end_date?: string
  page?: number
  limit?: number
}

export async function fetchTransactions(filters: TransactionFilters = {}) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') params.set(key, String(value))
  })
  return apiFetch<TransactionsPage>(`/transactions?${params.toString()}`)
}

export async function fetchTransactionList() {
  const result = await fetchTransactions({ limit: 50 })
  return result.items
    .map((item) => mapBackendTransaction(item))
    .filter(Boolean) as Transaction[]
}

export function mapBackendTransaction(item: {
  id?: number | string
  type?: string
  amount?: number | string
  description?: string
  category?: string | null
  vendor?: string | null
  date?: string
  payment_method?: string
  notes?: string | null
}): Transaction | null {
  if (!item || !item.type || item.amount === undefined || !item.date) return null
  const amountValue = typeof item.amount === 'string' ? Number(item.amount) : item.amount
  if (!Number.isFinite(amountValue)) return null

  return {
    id: String(item.id ?? `${item.type}-${Date.now()}`),
    type: item.type === 'income' ? 'income' : 'expense',
    amount: amountValue,
    category: item.category ?? undefined,
    source: item.type === 'income' ? item.category ?? undefined : undefined,
    vendor: item.vendor ?? undefined,
    date: item.date,
    paymentMethod: item.payment_method ?? 'Cash',
    notes: item.notes ?? undefined,
    addedVia: 'manual',
  }
}

export interface CreateTransactionPayload {
  type: 'income' | 'expense'
  amount: number
  description: string
  category?: string
  vendor?: string
  date: string
  payment_method: string
  notes?: string
  receipt_url?: string
}

export async function createTransactionRaw(payload: CreateTransactionPayload) {
  return apiFetch<Record<string, unknown>>('/transactions', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function createTransaction(payload: {
  type: 'income' | 'expense'
  amount: number
  category?: string
  source?: string
  vendor?: string
  date: string
  paymentMethod: string
  notes?: string
}) {
  const data: CreateTransactionPayload = {
    type: payload.type,
    amount: payload.amount,
    description: payload.type === 'income' ? payload.source ?? 'Income' : payload.vendor ?? payload.category ?? 'Expense',
    category: payload.category ?? (payload.type === 'expense' ? 'Other' : payload.source ?? 'Income'),
    vendor: payload.vendor ?? (payload.type === 'income' ? 'Internal' : 'Vendor'),
    date: payload.date,
    payment_method: payload.paymentMethod,
    notes: payload.notes ?? '',
  }
  return createTransactionRaw(data)
}

export async function updateTransaction(id: number, payload: CreateTransactionPayload) {
  return apiFetch<Record<string, unknown>>(`/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function deleteTransaction(id: number) {
  return apiFetch<{ success: boolean }>(`/transactions/${id}`, { method: 'DELETE' })
}

export async function categorizeTransaction(payload: { description?: string; vendor?: string; ocr_text?: string }) {
  return apiFetch<{ category: string; confidence: number }>('/transactions/categorize', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// ---------- Vendors ----------

export interface VendorItem {
  id: number
  business_id: number
  name: string
  contact_person: string | null
  phone: string | null
  email: string | null
  address: string | null
  total_spend: number
  transaction_count: number
  last_transaction: string | null
  monthly_spending: { period: string; amount: number }[]
  spending_trend: 'up' | 'down' | 'flat'
}

export async function fetchVendors(search?: string) {
  const params = search ? `?search=${encodeURIComponent(search)}` : ''
  return apiFetch<{ items: VendorItem[]; total: number }>(`/vendors${params}`)
}

export async function fetchVendor(id: number) {
  return apiFetch<VendorItem>(`/vendors/${id}`)
}

export async function createVendor(payload: { name: string; contact_person?: string; phone?: string; email?: string; address?: string }) {
  return apiFetch<VendorItem>('/vendors', { method: 'POST', body: JSON.stringify(payload) })
}

export async function deleteVendor(id: number) {
  return apiFetch<{ success: boolean }>(`/vendors/${id}`, { method: 'DELETE' })
}

// ---------- Budgets ----------

export interface BudgetItem {
  id: number
  business_id: number
  category: string
  amount: number
  month: number
  year: number
  actual_spending: number
  remaining: number
  percentage_used: number
  exceeded: boolean
}

export async function fetchBudgets() {
  return apiFetch<BudgetItem[]>('/budgets')
}

export async function createBudget(payload: { category: string; amount: number; month: number; year: number }) {
  return apiFetch<BudgetItem>('/budgets', { method: 'POST', body: JSON.stringify(payload) })
}

export async function deleteBudget(id: number) {
  return apiFetch<{ success: boolean }>(`/budgets/${id}`, { method: 'DELETE' })
}

// ---------- Analytics ----------

export interface AnalyticsOverview {
  total_income: number
  total_expenses: number
  transaction_count: number
  profit_margin: number
  average_monthly_expense: number
  highest_expense_category: string | null
  revenue_trend: number
  expense_trend: number
  insights: string[]
}

export async function fetchAnalyticsOverview() {
  return apiFetch<AnalyticsOverview>('/analytics/overview')
}

export async function fetchAnalyticsMonthly() {
  return apiFetch<Array<{ year: number; month: number; label: string; income: number; expenses: number; net: number }>>('/analytics/monthly')
}

export async function fetchAnalyticsCategories() {
  return apiFetch<Array<{ category: string; amount: number; percentage: number; transaction_count: number; average_transaction: number }>>('/analytics/categories')
}

export async function fetchAnalyticsVendors() {
  return apiFetch<Array<{ vendor: string; amount: number; transaction_count: number }>>('/analytics/vendors')
}

// ---------- Forecast ----------

export interface ForecastResponse {
  scenario: string
  scenario_label: string
  historical: Array<{ year: number; month: number; label: string; income: number; expenses: number; net: number }>
  forecast: Array<{ year: number; month: number; label: string; expected_income: number; expected_expenses: number; net: number; projected_balance: number }>
  trend_direction: 'improving' | 'declining' | 'stable'
  method: string
  disclaimer: string
}

export async function fetchCashFlowForecast(scenario: 'normal' | 'higher_spending' | 'lower_sales' = 'normal') {
  return apiFetch<ForecastResponse>(`/forecast/cash-flow?scenario=${scenario}`)
}

// ---------- Anomalies ----------

export interface AnomalyItem {
  transaction_id: number
  category: string
  description: string
  date: string
  amount: number
  normal_average: number
  deviation_percentage: number
  severity: 'low' | 'medium' | 'high'
  explanation: string
}

export async function fetchAnomalies() {
  return apiFetch<{ items: AnomalyItem[]; note: string }>('/anomalies')
}

// ---------- Credit Readiness ----------

export interface CreditReadiness {
  score: number
  factors: {
    income_consistency: number
    expense_consistency: number
    cash_flow_stability: number
    transaction_history: number
  }
  disclaimer: string
  methodology: string
}

export async function fetchCreditReadiness() {
  return apiFetch<CreditReadiness>('/credit-readiness')
}

// ---------- Reports ----------

export async function fetchMonthlyReport(month?: number, year?: number) {
  const params = new URLSearchParams()
  if (month) params.set('month', String(month))
  if (year) params.set('year', String(year))
  return apiFetch<{
    business_name: string
    period: string
    total_income: number
    total_expenses: number
    net_cash_flow: number
    category_breakdown: { category: string; amount: number }[]
    vendor_summary: { vendor: string; amount: number }[]
    transaction_count: number
  }>(`/reports/monthly?${params.toString()}`)
}

export async function downloadMonthlyReportPdf() {
  const blob = await apiFetchBlob('/reports/monthly/pdf')
  downloadBlob(blob, 'dhan-monthly-report.pdf')
}

export async function downloadGstExport() {
  const blob = await apiFetchBlob('/reports/gst-export')
  downloadBlob(blob, 'dhan-gst-export.csv')
}

// ---------- Notifications ----------

export interface NotificationItem {
  id: number
  title: string
  message: string
  read: boolean
  created_at: string
}

export async function fetchNotifications() {
  return apiFetch<{ items: NotificationItem[]; unread_count: number }>('/notifications')
}

export async function markNotificationRead(id: number) {
  return apiFetch<{ success: boolean }>(`/notifications/${id}/read`, { method: 'PUT' })
}

export async function markAllNotificationsRead() {
  return apiFetch<{ success: boolean }>('/notifications/read-all', { method: 'PUT' })
}

// ---------- Search ----------

export interface SearchResult {
  type: 'Transaction' | 'Vendor' | 'Category'
  label: string
  meta?: string
  id: number
}

export async function searchGlobal(query: string) {
  return apiFetch<{ query: string; results: SearchResult[] }>(`/search?q=${encodeURIComponent(query)}`)
}

// ---------- Receipts ----------

export interface ReceiptExtraction {
  receipt_id: number
  status: 'extracted' | 'ocr_unavailable'
  message?: string
  vendor: string | null
  amount: number | null
  date: string | null
  category: string | null
  confidence: number
}

export async function uploadReceipt(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return apiFetch<ReceiptExtraction>('/receipts/upload', { method: 'POST', body: formData })
}
