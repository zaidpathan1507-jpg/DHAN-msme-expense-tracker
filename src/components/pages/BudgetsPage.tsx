import { useEffect, useState } from 'react'
import { Plus, Trash2, AlertTriangle } from 'lucide-react'
import { fetchBudgets, createBudget, deleteBudget, type BudgetItem } from '@/lib/api'
import { formatINR } from '@/lib/format'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { LoadingCard, ErrorCard, EmptyCard, isOfflineError } from '@/components/ui/StateViews'
import { EXPENSE_CATEGORIES } from '@/data/fixtures'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function BudgetsPage() {
  const { show } = useToast()
  const [budgets, setBudgets] = useState<BudgetItem[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  const now = new Date()
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())

  function load() {
    setLoading(true)
    fetchBudgets()
      .then((res) => {
        setBudgets(res)
        setOffline(false)
        setError(null)
      })
      .catch((err) => {
        if (isOfflineError(err)) setOffline(true)
        else setError(err instanceof Error ? err.message : 'Failed to load budgets')
      })
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const value = parseFloat(amount)
    if (!category || !value || value <= 0) return
    try {
      await createBudget({ category, amount: value, month, year })
      show('Budget created', 'success')
      setAddOpen(false)
      setCategory('')
      setAmount('')
      load()
    } catch (err) {
      show(isOfflineError(err) ? 'Unable to connect to DHAN server.' : err instanceof Error ? err.message : 'Could not create budget', 'warning')
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteBudget(id)
      show('Budget removed', 'success')
      load()
    } catch (err) {
      show(isOfflineError(err) ? 'Unable to connect to DHAN server.' : err instanceof Error ? err.message : 'Could not remove budget', 'warning')
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Budgets</h1>
          <p className="mt-1 text-sm text-slate-500">Set monthly limits per category and track how you're doing.</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-900/15 transition hover:shadow-md active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" /> New Budget
        </button>
      </div>

      {loading && !budgets ? (
        <LoadingCard label="Loading budgets…" />
      ) : offline ? (
        <ErrorCard offline onRetry={load} />
      ) : error ? (
        <ErrorCard message={error} onRetry={load} />
      ) : !budgets || budgets.length === 0 ? (
        <EmptyCard label="No budgets set" hint="Create a budget to track spending against a monthly limit." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {budgets.map((b) => (
            <div key={b.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{b.category}</p>
                  <p className="text-xs text-slate-400">
                    {MONTH_NAMES[b.month - 1]} {b.year}
                  </p>
                </div>
                <button onClick={() => handleDelete(b.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Delete budget">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-800">{formatINR(b.actual_spending)}</span>
                <span className="text-slate-400">of {formatINR(b.amount)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                <div
                  className={`h-full rounded-full transition-all ${b.exceeded ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-500 to-emerald-600'}`}
                  style={{ width: `${Math.min(100, b.percentage_used)}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className={b.exceeded ? 'font-semibold text-rose-600' : 'text-slate-400'}>{b.percentage_used}% used</span>
                {b.exceeded ? (
                  <span className="flex items-center gap-1 font-semibold text-rose-600">
                    <AlertTriangle className="h-3 w-3" /> Over budget
                  </span>
                ) : (
                  <span className="text-slate-400">{formatINR(b.remaining)} remaining</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="New Budget" maxWidth="max-w-sm">
        <form onSubmit={handleAdd} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Category</span>
            <select required value={category} onChange={(e) => setCategory(e.target.value)} className="input">
              <option value="" disabled>
                Select category
              </option>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Monthly limit (₹)</span>
            <input type="number" required min={1} value={amount} onChange={(e) => setAmount(e.target.value)} className="input" />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-500">Month</span>
              <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="input">
                {MONTH_NAMES.map((m, i) => (
                  <option key={m} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-500">Year</span>
              <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="input" />
            </label>
          </div>
          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-900/15 transition hover:shadow-md active:scale-[0.99]"
          >
            Create budget
          </button>
        </form>
      </Modal>
    </div>
  )
}
