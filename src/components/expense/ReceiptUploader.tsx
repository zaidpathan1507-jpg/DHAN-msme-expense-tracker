import { useEffect, useRef, useState } from 'react'
import { UploadCloud, FileImage, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { useToast } from '@/components/ui/Toast'
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '@/data/fixtures'
import { uploadReceipt, type ReceiptExtraction } from '@/lib/api'
import { isOfflineError } from '@/components/ui/StateViews'

const SCAN_STEPS = ['Uploading receipt…', 'Reading amount…', 'Detecting vendor…', 'Categorizing expense…']

type Phase = 'idle' | 'scanning' | 'review'

const today = () => new Date().toISOString().slice(0, 10)

export function ReceiptUploader({ onDone }: { onDone: () => void }) {
  const { addTransaction } = useAppStore()
  const { show } = useToast()
  const [phase, setPhase] = useState<Phase>('idle')
  const [stepIndex, setStepIndex] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState('')
  const [ocrUnavailable, setOcrUnavailable] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const [vendor, setVendor] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(today())
  const [category, setCategory] = useState('')
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0])

  useEffect(() => {
    if (phase !== 'scanning') return
    if (stepIndex >= SCAN_STEPS.length - 1) return
    const t = setTimeout(() => setStepIndex((i) => i + 1), 500)
    return () => clearTimeout(t)
  }, [phase, stepIndex])

  async function startScan(file: File) {
    setFileName(file.name)
    setStepIndex(0)
    setOcrUnavailable(false)
    setPhase('scanning')
    try {
      const result: ReceiptExtraction = await uploadReceipt(file)
      setStepIndex(SCAN_STEPS.length - 1)
      if (result.status === 'ocr_unavailable') {
        setOcrUnavailable(true)
        setVendor('')
        setAmount('')
        setDate(today())
        setCategory('')
      } else {
        setVendor(result.vendor ?? '')
        setAmount(result.amount ? String(result.amount) : '')
        setDate(result.date ?? today())
        setCategory(result.category ?? '')
      }
      setTimeout(() => setPhase('review'), 400)
    } catch (err) {
      if (isOfflineError(err)) {
        show('Unable to connect to DHAN server.', 'warning')
      } else {
        show(err instanceof Error ? err.message : 'Could not process receipt', 'warning')
      }
      setPhase('idle')
    }
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0]
    if (!file) return
    startScan(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = parseFloat(amount)
    if (!value || value <= 0 || !category) return
    try {
      await addTransaction({ type: 'expense', amount: value, category, vendor, date, paymentMethod, addedVia: 'receipt' })
      show('Expense added successfully', 'success')
      onDone()
    } catch (err) {
      show(isOfflineError(err) ? 'Unable to connect to DHAN server.' : err instanceof Error ? err.message : 'Could not save expense', 'warning')
    }
  }

  if (phase === 'idle') {
    return (
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors ${
          dragging ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-stone-50 hover:border-emerald-300 hover:bg-emerald-50/40'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
          <UploadCloud className="h-6 w-6 text-emerald-600" />
        </div>
        <p className="text-sm font-semibold text-slate-700">Drag &amp; drop a receipt, or click to browse</p>
        <p className="mt-1 text-xs text-slate-400">Supports JPG, PNG or PDF — up to 5MB</p>
      </div>
    )
  }

  if (phase === 'scanning') {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-stone-50 px-6 py-14 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
          <FileImage className="h-6 w-6 text-slate-400" />
        </div>
        <p className="mb-1 text-xs font-medium text-slate-400">{fileName || 'receipt.jpg'}</p>
        <div className="mt-4 space-y-2.5">
          {SCAN_STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-2.5 text-sm">
              {i < stepIndex ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : i === stepIndex ? (
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
              ) : (
                <span className="h-4 w-4 rounded-full border-2 border-slate-200" />
              )}
              <span className={i <= stepIndex ? 'font-medium text-slate-700' : 'text-slate-300'}>{step}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {ocrUnavailable ? (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm font-medium text-amber-700">
          <AlertTriangle className="h-4 w-4" />
          Automatic text extraction isn't available right now — please fill in the details manually.
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          Receipt scanned — review and confirm the details below
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-500">Vendor</span>
          <input value={vendor} onChange={(e) => setVendor(e.target.value)} className="input" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-500">Amount (₹)</span>
          <input type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)} className="input" />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-500">Date</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-500">Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
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
      <button
        type="submit"
        className="mt-2 w-full rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-900/15 transition hover:shadow-md active:scale-[0.99]"
      >
        Save Expense
      </button>
    </form>
  )
}
