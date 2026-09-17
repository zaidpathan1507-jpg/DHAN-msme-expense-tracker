import { useEffect, useState } from 'react'
import { FileText, Download, Loader2 } from 'lucide-react'
import { fetchMonthlyReport, downloadMonthlyReportPdf, downloadGstExport } from '@/lib/api'
import { formatINR } from '@/lib/format'
import { useToast } from '@/components/ui/Toast'
import { LoadingCard, ErrorCard, isOfflineError } from '@/components/ui/StateViews'

export function ReportsPage() {
  const { show } = useToast()
  const [report, setReport] = useState<Awaited<ReturnType<typeof fetchMonthlyReport>> | null>(null)
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState<'pdf' | 'gst' | null>(null)

  function load() {
    setLoading(true)
    fetchMonthlyReport()
      .then((res) => {
        setReport(res)
        setOffline(false)
        setError(null)
      })
      .catch((err) => {
        if (isOfflineError(err)) setOffline(true)
        else setError(err instanceof Error ? err.message : 'Failed to load report')
      })
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleDownload(kind: 'pdf' | 'gst') {
    setDownloading(kind)
    try {
      if (kind === 'pdf') await downloadMonthlyReportPdf()
      else await downloadGstExport()
      show('Download started', 'success')
    } catch (err) {
      show(isOfflineError(err) ? 'Unable to connect to DHAN server.' : err instanceof Error ? err.message : 'Could not generate download', 'warning')
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Reports</h1>
        <p className="mt-1 text-sm text-slate-500">Generate and download financial reports for your business.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <FileText className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <p className="font-semibold text-slate-800">Monthly Report (PDF)</p>
          <p className="mt-1 flex-1 text-sm text-slate-500">Income, expenses, category and vendor breakdown for this period.</p>
          <button
            onClick={() => handleDownload('pdf')}
            disabled={downloading === 'pdf'}
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-900/15 transition hover:shadow-md active:scale-[0.98] disabled:opacity-60"
          >
            {downloading === 'pdf' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Download PDF
          </button>
        </div>

        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <FileText className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <p className="font-semibold text-slate-800">GST-ready demo export (CSV)</p>
          <p className="mt-1 flex-1 text-sm text-slate-500">A GST-ready demo export of your transactions. Not an officially validated filing format.</p>
          <button
            onClick={() => handleDownload('gst')}
            disabled={downloading === 'gst'}
            className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 disabled:opacity-60"
          >
            {downloading === 'gst' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Download CSV
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingCard label="Generating report preview…" />
      ) : offline ? (
        <ErrorCard offline onRetry={load} />
      ) : error ? (
        <ErrorCard message={error} onRetry={load} />
      ) : (
        report && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-semibold text-slate-900">{report.business_name}</h3>
                <p className="text-sm text-slate-400">{report.period}</p>
              </div>
              <p className="text-xs text-slate-400">{report.transaction_count} transactions</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <ReportStat label="Total income" value={formatINR(report.total_income)} />
              <ReportStat label="Total expenses" value={formatINR(report.total_expenses)} />
              <ReportStat label="Net cash flow" value={formatINR(report.net_cash_flow)} />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Category breakdown</p>
                <div className="space-y-1">
                  {report.category_breakdown.map((c) => (
                    <div key={c.category} className="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2 text-sm">
                      <span className="text-slate-600">{c.category}</span>
                      <span className="font-semibold text-slate-800">{formatINR(c.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Vendor summary</p>
                <div className="space-y-1">
                  {report.vendor_summary.map((v) => (
                    <div key={v.vendor} className="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2 text-sm">
                      <span className="text-slate-600">{v.vendor}</span>
                      <span className="font-semibold text-slate-800">{formatINR(v.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  )
}

function ReportStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-stone-50 px-4 py-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-0.5 text-lg font-bold text-slate-900">{value}</p>
    </div>
  )
}
