import { Loader2, AlertTriangle, Inbox, WifiOff } from 'lucide-react'

export function LoadingCard({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
      <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      <p className="mt-3 text-sm font-medium text-slate-500">{label}</p>
    </div>
  )
}

export function ErrorCard({ message, offline, onRetry }: { message?: string; offline?: boolean; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 p-12 text-center">
      {offline ? <WifiOff className="h-6 w-6 text-rose-500" /> : <AlertTriangle className="h-6 w-6 text-rose-500" />}
      <p className="mt-3 text-sm font-semibold text-rose-700">
        {offline ? 'Unable to connect to DHAN server.' : 'Something went wrong'}
      </p>
      {message && !offline && <p className="mt-1 max-w-sm text-xs text-rose-500">{message}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-xl border border-rose-300 bg-white px-4 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
        >
          Try again
        </button>
      )}
    </div>
  )
}

export function EmptyCard({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-stone-50 p-12 text-center">
      <Inbox className="h-6 w-6 text-slate-300" />
      <p className="mt-3 text-sm font-semibold text-slate-600">{label}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  )
}

export function isOfflineError(err: unknown) {
  return err instanceof Error && err.name === 'BackendUnavailableError'
}
