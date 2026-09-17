import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { useAppStore } from '@/lib/store'
import { useToast } from '@/components/ui/Toast'
import { INCOME_SOURCES, PAYMENT_METHODS } from '@/data/fixtures'
import { isOfflineError } from '@/components/ui/StateViews'

const today = () => new Date().toISOString().slice(0, 10)

export function AddIncomeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addTransaction } = useAppStore()
  const { show } = useToast()

  const [amount, setAmount] = useState('')
  const [source, setSource] = useState('')
  const [date, setDate] = useState(today())
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0])
  const [notes, setNotes] = useState('')

  function reset() {
    setAmount('')
    setSource('')
    setDate(today())
    setPaymentMethod(PAYMENT_METHODS[0])
    setNotes('')
  }

  function handleClose() {
    reset()
    onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = parseFloat(amount)
    if (!value || value <= 0 || !source) return
    try {
      await addTransaction({ type: 'income', amount: value, source, date, paymentMethod, notes, addedVia: 'manual' })
      show('Income added successfully', 'success')
      handleClose()
    } catch (err) {
      show(isOfflineError(err) ? 'Unable to connect to DHAN server.' : err instanceof Error ? err.message : 'Could not save income', 'warning')
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add Income" subtitle="Record money coming into your business" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Amount (₹)</span>
            <input type="number" required min={1} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="input" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Source</span>
            <select required value={source} onChange={(e) => setSource(e.target.value)} className="input">
              <option value="" disabled>
                Select source
              </option>
              {INCOME_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Date</span>
            <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="input" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Payment method</span>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="input">
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-500">Notes (optional)</span>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Add any details…" className="input resize-none" />
        </label>
        <button
          type="submit"
          className="mt-2 w-full rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-900/15 transition hover:shadow-md active:scale-[0.99]"
        >
          Save Income
        </button>
      </form>
    </Modal>
  )
}
