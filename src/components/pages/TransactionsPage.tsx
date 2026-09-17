import { useEffect, useState } from 'react'
import { Search, Trash2, Pencil, ChevronLeft, ChevronRight, ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { fetchTransactions, deleteTransaction, type TransactionsPage as TxPage } from '@/lib/api'
import { formatINR } from '@/lib/format'
import { useToast } from '@/components/ui/Toast'
import { LoadingCard, ErrorCard, EmptyCard, isOfflineError } from '@/components/ui/StateViews'
import { EXPENSE_CATEGORIES } from '@/data/fixtures'
import { TransactionEditModal } from '@/components/transactions/TransactionEditModal'

type TxItem = TxPage['items'][number]

export function TransactionsPage() {
  const { show } = useToast()
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [category, setCategory] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [page, setPage] = useState(1)

  const [data, setData] = useState<TxPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<TxItem | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  function load() {
    setLoading(true)
    fetchTransactions({ search, type, category, start_date: startDate, end_date: endDate, page, limit: 15 })
      .then((res) => {
        setData(res)
        setOffline(false)
        setError(null)
      })
      .catch((err) => {
        if (isOfflineError(err)) setOffline(true)
        else setError(err instanceof Error ? err.message : 'Failed to load transactions')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const t = setTimeout(load, 250)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, type, category, startDate, endDate, page])

  async function handleDelete(id: number) {
    setDeletingId(id)
    try {
      await deleteTransaction(id)
      show('Transaction deleted', 'success')
      load()
    } catch (err) {
      show(isOfflineError(err) ? 'Unable to connect to DHAN server.' : err instanceof Error ? err.message : 'Could not delete transaction', 'warning')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Transactions</h1>
        <p className="mt-1 text-sm text-slate-500">Every income and expense, straight from your ledger.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative lg:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => {
                setPage(1)
                setSearch(e.target.value)
              }}
              placeholder="Search description, vendor…"
              className="input pl-9"
            />
          </div>
          <select
            value={type}
            onChange={(e) => {
              setPage(1)
              setType(e.target.value)
            }}
            className="input"
          >
            <option value="">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={category}
            onChange={(e) => {
              setPage(1)
              setCategory(e.target.value)
            }}
            className="input"
          >
            <option value="">All categories</option>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setPage(1)
                setStartDate(e.target.value)
              }}
              className="input"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setPage(1)
                setEndDate(e.target.value)
              }}
              className="input"
            />
          </div>
        </div>
      </div>

      {loading && !data ? (
        <LoadingCard label="Loading transactions…" />
      ) : offline ? (
        <ErrorCard offline onRetry={load} />
      ) : error ? (
        <ErrorCard message={error} onRetry={load} />
      ) : !data || data.items.length === 0 ? (
        <EmptyCard label="No transactions found" hint="Try adjusting your filters, or add a new transaction." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-stone-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((tx) => (
                  <tr key={tx.id} className="border-b border-slate-50 last:border-0 hover:bg-stone-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {tx.type === 'income' ? (
                          <ArrowUpCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                        ) : (
                          <ArrowDownCircle className="h-4 w-4 shrink-0 text-rose-400" />
                        )}
                        <span className="font-medium text-slate-700">{tx.description}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{tx.category ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-500">{tx.vendor ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-500">{tx.date}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>
                      {tx.type === 'income' ? '+' : '-'}
                      {formatINR(tx.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setEditing(tx)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Edit">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          disabled={deletingId === tx.id}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
            <p className="text-xs text-slate-400">
              Page {data.page} of {Math.max(data.pages, 1)} · {data.total} transactions
            </p>
            <div className="flex gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => (data.pages && p < data.pages ? p + 1 : p))}
                disabled={data.pages ? page >= data.pages : true}
                className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <TransactionEditModal transaction={editing} onClose={() => setEditing(null)} onSaved={load} />
    </div>
  )
}
