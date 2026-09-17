import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { fetchBusinessProfile, updateBusinessProfile, type BusinessProfile } from '@/lib/api'
import { useToast } from '@/components/ui/Toast'
import { LoadingCard, ErrorCard, isOfflineError } from '@/components/ui/StateViews'

const BUSINESS_TYPES = ['Retail', 'Wholesale', 'Manufacturing', 'Services', 'Trading', 'Other']

export function SettingsPage() {
  const { show } = useToast()
  const [profile, setProfile] = useState<Partial<BusinessProfile>>({})
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function load() {
    setLoading(true)
    fetchBusinessProfile()
      .then((res) => {
        setProfile(res)
        setOffline(false)
        setError(null)
      })
      .catch((err) => {
        if (isOfflineError(err)) setOffline(true)
        else setError(err instanceof Error ? err.message : 'Failed to load business profile')
      })
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  function set<K extends keyof BusinessProfile>(key: K, value: BusinessProfile[K]) {
    setProfile((p) => ({ ...p, [key]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await updateBusinessProfile({
        business_name: profile.business_name,
        business_type: profile.business_type,
        owner_name: profile.owner_name,
        mobile: profile.mobile,
        email: profile.email,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        gst_number: profile.gst_number,
        financial_year: profile.financial_year,
      })
      setProfile(updated)
      show('Business profile updated', 'success')
    } catch (err) {
      show(isOfflineError(err) ? 'Unable to connect to DHAN server.' : err instanceof Error ? err.message : 'Could not save changes', 'warning')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your business profile and preferences.</p>
      </div>

      {loading ? (
        <LoadingCard label="Loading business profile…" />
      ) : offline ? (
        <ErrorCard offline onRetry={load} />
      ) : error ? (
        <ErrorCard message={error} onRetry={load} />
      ) : (
        <form onSubmit={handleSave} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">Business details</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Business name">
                <input value={profile.business_name ?? ''} onChange={(e) => set('business_name', e.target.value)} className="input" />
              </Field>
              <Field label="Business type">
                <select value={profile.business_type ?? ''} onChange={(e) => set('business_type', e.target.value)} className="input">
                  <option value="">Select type</option>
                  {BUSINESS_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Owner name">
                <input value={profile.owner_name ?? ''} onChange={(e) => set('owner_name', e.target.value)} className="input" />
              </Field>
              <Field label="GST number">
                <input value={profile.gst_number ?? ''} onChange={(e) => set('gst_number', e.target.value)} className="input" />
              </Field>
              <Field label="Financial year">
                <input value={profile.financial_year ?? ''} onChange={(e) => set('financial_year', e.target.value)} placeholder="e.g. 2026-27" className="input" />
              </Field>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">Contact</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Mobile number">
                <input value={profile.mobile ?? ''} onChange={(e) => set('mobile', e.target.value)} className="input" />
              </Field>
              <Field label="Email">
                <input type="email" value={profile.email ?? ''} onChange={(e) => set('email', e.target.value)} className="input" />
              </Field>
              <Field label="Address">
                <input value={profile.address ?? ''} onChange={(e) => set('address', e.target.value)} className="input" />
              </Field>
              <Field label="City">
                <input value={profile.city ?? ''} onChange={(e) => set('city', e.target.value)} className="input" />
              </Field>
              <Field label="State">
                <input value={profile.state ?? ''} onChange={(e) => set('state', e.target.value)} className="input" />
              </Field>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-900/15 transition hover:shadow-md active:scale-[0.98] disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      )}
    </div>
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
