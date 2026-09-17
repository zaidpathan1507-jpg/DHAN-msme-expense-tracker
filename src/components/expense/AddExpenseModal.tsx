import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { ReceiptUploader } from './ReceiptUploader'
import { useAppStore } from '@/lib/store'
import { useToast } from '@/components/ui/Toast'
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '@/data/fixtures'
import { isOfflineError } from '@/components/ui/StateViews'

const today = () => new Date().toISOString().slice(0, 10)

export function AddExpenseModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<'manual' | 'receipt'>('manual')
  const { addTransaction } = useAppStore()
  const { show } = useToast()

  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [vendor, setVendor] = useState('')
  const [date, setDate] = useState(today())
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0])
  const [notes, setNotes] = useState('')

  function reset() {
    setAmount('')
    setCategory('')
    setVendor('')
    setDate(today())
    setPaymentMethod(PAYMENT_METHODS[0])
    setNotes('')
    setTab('manual')
  }

  function handleClose() {
    reset()
    onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = parseFloat(amount)
    if (!value || value <= 0 || !category) return
    try {
      await addTransaction({ type: 'expense', amount: value, category, vendor: vendor || 'Unnamed vendor', date, paymentMethod, notes, addedVia: 'manual' })
      show('Expense added successfully', 'success')
      handleClose()
    } catch (err) {
      show(isOfflineError(err) ? 'Unable to connect to DHAN server.' : err instanceof Error ? err.message : 'Could not save expense', 'warning')
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add Expense" subtitle="Log a business expense in a few seconds" maxWidth="max-w-xl">
      <div className="mb-5 flex gap-1 rounded-xl bg-stone-100 p-1">
        {(['manual', 'receipt'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${tab === t ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}
          >
            {t === 'manual' ? 'Manual Entry' : 'Upload Receipt'}
          </button>
        ))}
      </div>

      {tab === 'manual' ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Amount (₹)">
              <input
                type="number"
                required
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="input"
              />
            </Field>
            <Field label="Category">
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
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Vendor">
              <input value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="e.g. ABC Suppliers" className="input" />
            </Field>
            <Field label="Date">
              <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="input" />
            </Field>
          </div>
          <Field label="Payment method">
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="input">
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Notes (optional)">
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Add any details…" className="input resize-none" />
          </Field>
          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-900/15 transition hover:shadow-md active:scale-[0.99]"
          >
            Save Expense
          </button>
        </form>
      ) : (
        <ReceiptUploader onDone={handleClose} />
      )}
    </Modal>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-500">{label}</span>
      {children}
    </label>
  )
}
