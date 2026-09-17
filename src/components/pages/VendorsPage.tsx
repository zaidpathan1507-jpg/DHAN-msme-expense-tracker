import { useEffect, useState } from 'react'
import { Search, Store, TrendingUp, TrendingDown, Minus, Plus, Trash2 } from 'lucide-react'
import { fetchVendors, createVendor, deleteVendor, type VendorItem } from '@/lib/api'
import { formatINR } from '@/lib/format'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { LoadingCard, ErrorCard, EmptyCard, isOfflineError } from '@/components/ui/StateViews'

const TREND_ICON = { up: TrendingUp, down: TrendingDown, flat: Minus }
const TREND_COLOR = { up: 'text-amber-600', down: 'text-emerald-600', flat: 'text-slate-400' }

export function VendorsPage() {
  const { show } = useToast()
  const [search, setSearch] = useState('')
  const [vendors, setVendors] = useState<VendorItem[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detail, setDetail] = useState<VendorItem | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [name, setName] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [phone, setPhone] = useState('')

  function load() {
    setLoading(true)
    fetchVendors(search)
      .then((res) => {
        setVendors(res.items)
        setOffline(false)
        setError(null)
      })
      .catch((err) => {
        if (isOfflineError(err)) setOffline(true)
        else setError(err instanceof Error ? err.message : 'Failed to load vendors')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const t = setTimeout(load, 250)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    try {
      await createVendor({ name: name.trim(), contact_person: contactPerson || undefined, phone: phone || undefined })
      show('Vendor added', 'success')
      setAddOpen(false)
      setName('')
      setContactPerson('')
      setPhone('')
      load()
    } catch (err) {
      show(isOfflineError(err) ? 'Unable to connect to DHAN server.' : err instanceof Error ? err.message : 'Could not add vendor', 'warning')
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteVendor(id)
      show('Vendor removed', 'success')
      setDetail(null)
      load()
    } catch (err) {
      show(isOfflineError(err) ? 'Unable to connect to DHAN server.' : err instanceof Error ? err.message : 'Could not remove vendor', 'warning')
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Vendors</h1>
          <p className="mt-1 text-sm text-slate-500">Track who you're spending with and how much.</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-900/15 transition hover:shadow-md active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" /> Add Vendor
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search vendors…" className="input pl-9" />
      </div>

      {loading && !vendors ? (
        <LoadingCard label="Loading vendors…" />
      ) : offline ? (
        <ErrorCard offline onRetry={load} />
      ) : error ? (
        <ErrorCard message={error} onRetry={load} />
      ) : !vendors || vendors.length === 0 ? (
        <EmptyCard label="No vendors yet" hint="Add a vendor or record an expense to see vendors here." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vendors.map((v) => {
            const Icon = TREND_ICON[v.spending_trend]
            return (
              <button
                key={v.id}
                onClick={() => setDetail(v)}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Store className="h-5 w-5" strokeWidth={2.2} />
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-semibold ${TREND_COLOR[v.spending_trend]}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                </div>
                <p className="font-semibold text-slate-800">{v.name}</p>
                <p className="mt-1 text-xs text-slate-400">{v.contact_person || 'No contact on file'}</p>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-[11px] text-slate-400">Total spend</p>
                    <p className="text-lg font-bold text-slate-900">{formatINR(v.total_spend)}</p>
                  </div>
                  <p className="text-xs text-slate-400">{v.transaction_count} txns</p>
                </div>
              </button>
            )
          })}
        </div>
      )}

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.name ?? ''} subtitle={detail?.address ?? undefined} maxWidth="max-w-lg">
        {detail && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <DetailStat label="Total spend" value={formatINR(detail.total_spend)} />
              <DetailStat label="Transactions" value={String(detail.transaction_count)} />
              <DetailStat label="Last transaction" value={detail.last_transaction ?? '—'} />
              <DetailStat label="Contact" value={detail.contact_person ?? '—'} />
              <DetailStat label="Phone" value={detail.phone ?? '—'} />
              <DetailStat label="Trend" value={detail.spending_trend} />
            </div>
            {detail.monthly_spending.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Monthly spending</p>
                <div className="space-y-1">
                  {detail.monthly_spending.map((m) => (
                    <div key={m.period} className="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2 text-sm">
                      <span className="text-slate-500">{m.period}</span>
                      <span className="font-semibold text-slate-800">{formatINR(m.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={() => handleDelete(detail.id)}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
            >
              <Trash2 className="h-4 w-4" /> Remove vendor
            </button>
          </div>
        )}
      </Modal>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Vendor" maxWidth="max-w-sm">
        <form onSubmit={handleAdd} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Vendor name</span>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="input" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Contact person</span>
            <input value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} className="input" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Phone</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input" />
          </label>
          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-900/15 transition hover:shadow-md active:scale-[0.99]"
          >
            Save vendor
          </button>
        </form>
      </Modal>
    </div>
  )
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-stone-50 px-3 py-2.5">
      <p className="text-[11px] text-slate-400">{label}</p>
      <p className="truncate text-sm font-semibold text-slate-800">{value}</p>
    </div>
  )
}
