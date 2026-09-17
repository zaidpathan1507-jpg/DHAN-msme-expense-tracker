import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { D as DashboardShell, L as LoadingCard, E as ErrorCard, i as isOfflineError } from "./DashboardShell-DroH9zDJ.mjs";
import { useToast, fetchMonthlyReport, downloadMonthlyReportPdf, downloadGstExport } from "./router-CetSUMdE.mjs";
import { f as formatINR } from "./format-X1RxzObn.mjs";
import "../_libs/react-dom.mjs";
import { F as FileText, n as LoaderCircle, D as Download } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/tanstack__history.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
function ReportsPage() {
  const { show } = useToast();
  const [report, setReport] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [offline, setOffline] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [downloading, setDownloading] = reactExports.useState(null);
  function load() {
    setLoading(true);
    fetchMonthlyReport().then((res) => {
      setReport(res);
      setOffline(false);
      setError(null);
    }).catch((err) => {
      if (isOfflineError(err)) setOffline(true);
      else setError(err instanceof Error ? err.message : "Failed to load report");
    }).finally(() => setLoading(false));
  }
  reactExports.useEffect(load, []);
  async function handleDownload(kind) {
    setDownloading(kind);
    try {
      if (kind === "pdf") await downloadMonthlyReportPdf();
      else await downloadGstExport();
      show("Download started", "success");
    } catch (err) {
      show(isOfflineError(err) ? "Unable to connect to DHAN server." : err instanceof Error ? err.message : "Could not generate download", "warning");
    } finally {
      setDownloading(null);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-slate-900 sm:text-3xl", children: "Reports" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-slate-500", children: "Generate and download financial reports for your business." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5", strokeWidth: 2.2 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-slate-800", children: "Monthly Report (PDF)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 flex-1 text-sm text-slate-500", children: "Income, expenses, category and vendor breakdown for this period." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => handleDownload("pdf"),
            disabled: downloading === "pdf",
            className: "mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-900/15 transition hover:shadow-md active:scale-[0.98] disabled:opacity-60",
            children: [
              downloading === "pdf" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
              "Download PDF"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5", strokeWidth: 2.2 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-slate-800", children: "GST-ready demo export (CSV)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 flex-1 text-sm text-slate-500", children: "A GST-ready demo export of your transactions. Not an officially validated filing format." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => handleDownload("gst"),
            disabled: downloading === "gst",
            className: "mt-4 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 disabled:opacity-60",
            children: [
              downloading === "gst" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
              "Download CSV"
            ]
          }
        )
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingCard, { label: "Generating report preview…" }) : offline ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorCard, { offline: true, onRetry: load }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorCard, { message: error, onRetry: load }) : report && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 flex flex-wrap items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-slate-900", children: report.business_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: report.period })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-400", children: [
          report.transaction_count,
          " transactions"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ReportStat, { label: "Total income", value: formatINR(report.total_income) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ReportStat, { label: "Total expenses", value: formatINR(report.total_expenses) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ReportStat, { label: "Net cash flow", value: formatINR(report.net_cash_flow) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400", children: "Category breakdown" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: report.category_breakdown.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600", children: c.category }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-800", children: formatINR(c.amount) })
          ] }, c.category)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400", children: "Vendor summary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: report.vendor_summary.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600", children: v.vendor }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-800", children: formatINR(v.amount) })
          ] }, v.vendor)) })
        ] })
      ] })
    ] })
  ] });
}
function ReportStat({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-stone-50 px-4 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-lg font-bold text-slate-900", children: value })
  ] });
}
function Page() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ReportsPage, {}) });
}
export {
  Page as component
};
