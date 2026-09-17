import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { isOfflineError } from '@/components/ui/StateViews'
import { updateTransaction, type TransactionsPage } from '@/lib/api'
import { EXPENSE_CATEGORIES, INCOME_SOURCES, PAYMENT_METHODS } from '@/data/fixtures'

type TxItem = TransactionsPage['items'][number]

export function TransactionEditModal({
  transaction,
  onClose,
  onSaved,
}: {
  transaction: TxItem | null
  onClose: () => void
  onSaved: () => void
}) {
  const { show } = useToast()
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [vendor, setVendor] = useState('')
  const [date, setDate] = useState('')
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0])
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!transaction) return
    setAmount(String(transaction.amount))
    setCategory(transaction.category ?? '')
    setVendor(transaction.vendor ?? '')
    setDate(transaction.date)
    setPaymentMethod(transaction.payment_method || PAYMENT_METHODS[0])
    setNotes(transaction.notes ?? '')
  }, [transaction])

  if (!transaction) return null

  const options = transaction.type === 'income' ? INCOME_SOURCES : EXPENSE_CATEGORIES

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = parseFloat(amount)
    if (!value || value <= 0 || !transaction) return
    setSaving(true)
    try {
      await updateTransaction(transaction.id, {
        type: transaction.type,
        amount: value,
        description: transaction.description || category || vendor || transaction.type,
        category,
        vendor,
        date,
        payment_method: paymentMethod,
        notes,
      })
      show('Transaction updated', 'success')
      onSaved()
      onClose()
    } catch (err) {
      show(isOfflineError(err) ? 'Unable to connect to DHAN server.' : err instanceof Error ? err.message : 'Could not update transaction', 'warning')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={!!transaction} onClose={onClose} title={`Edit ${transaction.type === 'income' ? 'Income' : 'Expense'}`} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Amount (₹)</span>
            <input type="number" required min={1} value={amount} onChange={(e) => setAmount(e.target.value)} className="input" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">{transaction.type === 'income' ? 'Source' : 'Category'}</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
              <option value="">Select</option>
              {options.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {transaction.type === 'expense' && (
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-500">Vendor</span>
              <input value={vendor} onChange={(e) => setVendor(e.target.value)} className="input" />
            </label>
          )}
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Date</span>
            <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="input" />
          </label>
        </div>
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
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-500">Notes</span>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="input resize-none" />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="mt-2 w-full rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-900/15 transition hover:shadow-md active:scale-[0.99] disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </Modal>
  )
}
