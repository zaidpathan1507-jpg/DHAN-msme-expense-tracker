import { useState, type FormEvent } from 'react'
import { ArrowLeft, Eye, EyeOff, TrendingUp, Receipt, Activity, HeartPulse } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { DemoAccountModal } from '@/components/auth/DemoAccountModal'
import { loginWithMobile, setAuthToken } from '@/lib/api'
import { isOfflineError } from '@/components/ui/StateViews'
import { useAppStore } from '@/lib/store'

const FLOW_STEPS = [
  { label: 'Income', icon: TrendingUp },
  { label: 'Expenses', icon: Receipt },
  { label: 'Cash Flow', icon: Activity },
  { label: 'Growth', icon: HeartPulse },
]

const FLOATING_METRICS = [
  { label: 'Total Income', value: '₹2,48,500', position: 'top-4 -left-8' },
  { label: 'Total Expenses', value: '₹1,32,400', position: 'top-28 -right-6' },
  { label: 'Net Cash Flow', value: '₹1,16,100', position: 'bottom-20 -left-10' },
  { label: 'Business Health', value: '82/100', position: 'bottom-0 -right-4' },
]

interface LoginPageProps {
  onBack: () => void
  onSuccess: () => void
}

export function LoginPage({ onBack, onSuccess }: LoginPageProps) {
  const { refresh } = useAppStore()
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<{ mobile?: string; password?: string; form?: string }>({})
  const [loading, setLoading] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [demoOpen, setDemoOpen] = useState(false)

  function finishAndEnter() {
    setLeaving(true)
    setTimeout(onSuccess, 280)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const nextErrors: { mobile?: string; password?: string } = {}
    if (!mobile.trim()) nextErrors.mobile = 'Enter your mobile number'
    if (!password.trim()) nextErrors.password = 'Enter your password'
    setErrors(nextErrors)
    if (nextErrors.mobile || nextErrors.password) return

    setLoading(true)
    try {
      const res = await loginWithMobile(mobile.trim(), password)
      setAuthToken(res.access_token)
      await refresh()
      finishAndEnter()
    } catch (err) {
      if (isOfflineError(err)) {
        setErrors({ form: 'Unable to connect to DHAN server.' })
      } else {
        setErrors({ form: err instanceof Error ? err.message : 'Invalid mobile number or password' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`relative flex min-h-screen bg-stone-50 ${leaving ? 'animate-page-out' : ''}`}>
      <button
        onClick={onBack}
        className="absolute left-5 top-5 z-20 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-500 backdrop-blur-sm transition hover:border-slate-300 hover:text-slate-700 sm:left-8 sm:top-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back
      </button>

      {/* Left: branding + visualization (desktop only) */}
      <div className="relative hidden w-1/2 flex-col justify-center overflow-hidden bg-gradient-to-br from-emerald-50/70 via-white to-stone-50 px-14 lg:flex xl:px-20">
        <Logo size="lg" />
        <h1 className="mt-8 text-3xl font-extrabold leading-[1.15] tracking-tight text-slate-900 xl:text-4xl">
          Your business money,
          <br />
          finally in one place.
        </h1>
        <p className="mt-4 max-w-sm text-base text-slate-600">Simple financial clarity for MSMEs.</p>

        <div className="relative mt-14">
          <div className="pointer-events-none absolute -inset-x-6 -inset-y-10 -z-10 rounded-[3rem] bg-gradient-to-br from-emerald-100/60 via-transparent to-transparent blur-2xl" />

          {FLOATING_METRICS.map((m, i) => (
            <div
              key={m.label}
              className={`animate-float-slow absolute z-10 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-lg shadow-slate-900/10 ${m.position}`}
              style={{ animationDelay: `${i * 0.5}s` }}
            >
              <p className="text-[11px] font-medium text-slate-400">{m.label}</p>
              <p className="text-base font-bold text-slate-900">{m.value}</p>
            </div>
          ))}

          <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              {FLOW_STEPS.map((step, i) => (
                <div key={step.label} className="flex flex-1 items-center gap-2">
                  <div className="flex-1 rounded-xl border border-slate-100 bg-white p-3 text-center">
                    <step.icon className="mx-auto h-4 w-4 text-emerald-600" strokeWidth={2.25} />
                    <p className="mt-1.5 text-[11px] font-semibold text-slate-600">{step.label}</p>
                  </div>
                  {i < FLOW_STEPS.length - 1 && <span className="shrink-0 text-emerald-400">→</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right: login card */}
      <div className="flex w-full flex-1 flex-col items-center justify-center px-5 py-16 lg:w-1/2">
        <div className="mb-8 flex flex-col items-center lg:hidden">
          <Logo />
          <p className="mt-2 text-sm text-slate-500">Know your money. Grow your business.</p>
        </div>

        <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/5 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900">Welcome back</h2>
          <p className="mt-1.5 text-sm text-slate-500">Sign in to continue to your DHAN workspace.</p>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
            {errors.form && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-600">{errors.form}</div>
            )}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Business Mobile Number</label>
              <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white transition focus-within:border-emerald-300 focus-within:ring-2 focus-within:ring-emerald-100">
                <span className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-500">+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter mobile number"
                  className="w-full bg-transparent px-3.5 py-2.5 text-sm text-slate-700 outline-none"
                />
              </div>
              {errors.mobile && <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.mobile}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Password</label>
              <div className="relative flex items-center rounded-xl border border-slate-200 bg-white transition focus-within:border-emerald-300 focus-within:ring-2 focus-within:ring-emerald-100">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-transparent px-3.5 py-2.5 text-sm text-slate-700 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="mr-2.5 shrink-0 text-slate-400 transition hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.password}</p>}
            </div>

            <label className="flex select-none items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-400"
              />
              Remember me
            </label>

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-900/25 active:translate-y-0 disabled:pointer-events-none disabled:opacity-80"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Signing you in...
                </>
              ) : (
                <>
                  Sign in to DHAN
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <button onClick={() => setDemoOpen(true)} className="font-semibold text-emerald-700 hover:text-emerald-800">
              Create demo account
            </button>
          </p>

          <p className="mt-4 text-center text-xs font-medium text-slate-400">Demo Mode • No real account required</p>
        </div>
      </div>

      <DemoAccountModal open={demoOpen} onClose={() => setDemoOpen(false)} onContinue={finishAndEnter} />
    </div>
  )
}
