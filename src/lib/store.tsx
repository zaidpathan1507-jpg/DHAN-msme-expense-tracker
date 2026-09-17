import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Transaction } from '@/data/fixtures'
import {
  createTransaction,
  fetchAnalyticsCategories,
  fetchDashboardSummary,
  fetchTransactionList,
  getAuthToken,
  BackendUnavailableError,
} from '@/lib/api'

export interface CategoryTotal {
  category: string
  amount: number
  percentage: number
  transactionCount: number
  averageTransaction: number
}

interface AppStoreValue {
  addedTransactions: Transaction[]
  totalIncome: number
  totalExpenses: number
  netCashFlow: number
  healthScore: number
  transactionCount: number
  categoryTotals: CategoryTotal[]
  loading: boolean
  offline: boolean
  error: string | null
  addTransaction: (tx: Omit<Transaction, 'id'>) => Promise<void>
  refresh: () => Promise<void>
}

const AppStoreContext = createContext<AppStoreValue | null>(null)

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [addedTransactions, setAddedTransactions] = useState<Transaction[]>([])
  const [summary, setSummary] = useState({
    total_income: 0,
    total_expenses: 0,
    net_cash_flow: 0,
    business_health: 0,
    transaction_count: 0,
    current_balance: 0,
  })
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([])
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!getAuthToken()) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const [txList, dashboardSummary, categories] = await Promise.all([
        fetchTransactionList(),
        fetchDashboardSummary(),
        fetchAnalyticsCategories(),
      ])
      setAddedTransactions(txList)
      setSummary(dashboardSummary)
      setCategoryTotals(
        categories.map((c) => ({
          category: c.category,
          amount: c.amount,
          percentage: c.percentage,
          transactionCount: c.transaction_count,
          averageTransaction: c.average_transaction,
        })),
      )
      setOffline(false)
      setError(null)
    } catch (err) {
      if (err instanceof BackendUnavailableError) {
        setOffline(true)
        setError(null)
      } else {
        setOffline(false)
        setError(err instanceof Error ? err.message : 'Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = useMemo<AppStoreValue>(
    () => ({
      addedTransactions,
      totalIncome: summary.total_income,
      totalExpenses: summary.total_expenses,
      netCashFlow: summary.net_cash_flow,
      healthScore: summary.business_health,
      transactionCount: summary.transaction_count,
      categoryTotals,
      loading,
      offline,
      error,
      addTransaction: async (tx) => {
        await createTransaction({
          type: tx.type,
          amount: tx.amount,
          category: tx.category,
          source: tx.source,
          vendor: tx.vendor,
          date: tx.date,
          paymentMethod: tx.paymentMethod,
          notes: tx.notes,
        })
        await refresh()
      },
      refresh,
    }),
    [addedTransactions, summary, categoryTotals, loading, offline, error, refresh],
  )

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext)
  if (!ctx) throw new Error('useAppStore must be used within AppStoreProvider')
  return ctx
}
