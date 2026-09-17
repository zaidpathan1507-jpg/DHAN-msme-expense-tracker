import { useState } from 'react'
import { CheckCircle2, Loader2, AlertTriangle } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { BUSINESS_PROFILE } from '@/data/fixtures'
import { loginWithMobile, setAuthToken } from '@/lib/api'
import { isOfflineError } from '@/components/ui/StateViews'
import { useAppStore } from '@/lib/store'

const DEMO_MOBILE = '9420311155'
const DEMO_PASSWORD = 'demo1234'

interface DemoAccountModalProps {
  open: boolean
  onClose: () => void
  onContinue: () => void
}

export function DemoAccountModal({ open, onClose, onContinue }: DemoAccountModalProps) {
  const { refresh } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleContinue() {
    setLoading(true)
    setError(null)
    try {
      const res = await loginWithMobile(DEMO_MOBILE, DEMO_PASSWORD)
      setAuthToken(res.access_token)
      await refresh()
      onContinue()
    } catch (err) {
      if (isOfflineError(err)) {
        setError('Unable to connect to DHAN server. Please make sure the backend is running.')
      } else {
        setError(
          'Demo account not found yet. Ask the developer to run "python seed.py" in the backend to create it, then try again.',
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Demo account ready" maxWidth="max-w-sm">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-7 w-7" strokeWidth={2} />
        </span>

        <p className="mt-5 text-sm font-semibold text-slate-500">Business</p>
        <p className="text-lg font-bold text-slate-900">{BUSINESS_PROFILE.name}</p>

        <p className="mt-3 text-sm text-slate-500">Your demo workspace is ready to explore.</p>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-left text-xs font-medium text-amber-700">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <button
          onClick={handleContinue}
          disabled={loading}
          className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-900/25 active:translate-y-0 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
            </>
          ) : (
            <>
              Continue to Dashboard
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </>
          )}
        </button>
      </div>
    </Modal>
  )
}
