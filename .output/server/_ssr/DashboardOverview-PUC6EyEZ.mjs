import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { f as formatINR, a as formatCompactINR } from "./format-X1RxzObn.mjs";
import { useAppStore, fetchDashboardCashFlow, fetchCashFlowForecast, fetchAnomalies, fetchCreditReadiness, fetchAnalyticsOverview } from "./router-CetSUMdE.mjs";
import { B as BUSINESS_PROFILE, L as LoadingCard, E as ErrorCard, i as isOfflineError, a as EmptyCard, M as Modal } from "./DashboardShell-DroH9zDJ.mjs";
import { b as TrendingUp, a as TrendingDown, y as Wallet, H as HeartPulse, R as Receipt, z as Calculator, T as TriangleAlert, E as Lightbulb, h as ShieldCheck, G as ArrowRight } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, C as ComposedChart, a as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, A as Area, L as Line, P as PieChart, b as Pie, c as Cell } from "../_libs/recharts.mjs";
function AnimatedNumber({ value, format = (n) => Math.round(n).toString(), duration = 900, className }) {
  const [display, setDisplay] = reactExports.useState(0);
  const fromRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplay(value);
      fromRef.current = value;
      return;
    }
    const from = fromRef.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (value - from) * eased);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        fromRef.current = value;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className, children: format(display) });
}
function MetricCards() {
  const { totalIncome, totalExpenses, netCashFlow, healthScore, transactionCount } = useAppStore();
  const cards = [
    {
      label: "Total Income",
      value: totalIncome,
      badge: "All-time",
      icon: TrendingUp,
      format: formatINR
    },
    {
      label: "Total Expenses",
      value: totalExpenses,
      badge: "All-time",
      icon: TrendingDown,
      format: formatINR
    },
    {
      label: "Net Cash Flow",
      value: netCashFlow,
      badge: `${transactionCount} txns`,
      icon: Wallet,
      format: formatINR
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
    cards.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "animate-slide-up group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        style: { animationDelay: `${i * 80}ms` },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(c.icon, { className: "h-5 w-5", strokeWidth: 2.2 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700", children: c.badge })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-500", children: c.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-2xl font-bold text-slate-900", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedNumber, { value: c.value, format: c.format }) })
        ]
      },
      c.label
    )),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "animate-slide-up group rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        style: { animationDelay: "240ms" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-emerald-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeartPulse, { className: "h-5 w-5", strokeWidth: 2.2 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-1 text-xs font-semibold text-emerald-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "h-3 w-3" }),
              " Prototype"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-300", children: "Business Health" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-2xl font-bold text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedNumber, { value: healthScore, format: (n) => `${Math.round(n)}/100` }) })
        ]
      }
    )
  ] });
}
const RANGES = ["7D", "30D", "3M", "1Y"];
const RANGE_PARAM = { "7D": "7d", "30D": "30d", "3M": "3m", "1Y": "1y" };
function CashFlowChart() {
  const [range, setRange] = reactExports.useState("30D");
  const [data, setData] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [offline, setOffline] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchDashboardCashFlow(RANGE_PARAM[range]).then((points) => {
      if (cancelled) return;
      setData(points.map((p) => ({ ...p, label: p.label ?? p.date })));
      setOffline(false);
      setError(null);
    }).catch((err) => {
      if (cancelled) return;
      if (isOfflineError(err)) setOffline(true);
      else setError(err instanceof Error ? err.message : "Failed to load cash flow");
    }).finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [range]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-slate-900", children: "Cash Flow Overview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "Income, expenses and net cash flow over time" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 rounded-xl bg-stone-100 p-1", children: RANGES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setRange(r),
          className: `rounded-lg px-3 py-1.5 text-xs font-semibold transition ${range === r ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`,
          children: r === "7D" ? "7 Days" : r === "30D" ? "30 Days" : r === "3M" ? "3 Months" : "1 Year"
        },
        r
      )) })
    ] }),
    loading && !data ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingCard, { label: "Loading cash flow…" }) : offline ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorCard, { offline: true, onRetry: () => setRange((r) => r) }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorCard, { message: error, onRetry: () => setRange((r) => r) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-5 text-xs font-medium text-slate-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { color: "#10b981", label: "Income" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { color: "#94a3b8", label: "Expenses" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { color: "#0f172a", label: "Net Cash Flow" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 280, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ComposedChart, { data: data ?? [], margin: { top: 5, right: 8, left: -12, bottom: 0 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "incomeFill", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#10b981", stopOpacity: 0.28 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#10b981", stopOpacity: 0 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "expenseFill", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#94a3b8", stopOpacity: 0.22 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#94a3b8", stopOpacity: 0 })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#eef0f2", vertical: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "label", tick: { fontSize: 11, fill: "#94a3b8" }, axisLine: false, tickLine: false, minTickGap: 20 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tick: { fontSize: 11, fill: "#94a3b8" }, axisLine: false, tickLine: false, tickFormatter: (v) => formatCompactINR(v), width: 56 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartTooltip, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "income", stroke: "#10b981", strokeWidth: 2, fill: "url(#incomeFill)", dot: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "expenses", stroke: "#94a3b8", strokeWidth: 2, fill: "url(#expenseFill)", dot: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { type: "monotone", dataKey: "net", stroke: "#0f172a", strokeWidth: 2, dot: false })
      ] }) })
    ] })
  ] });
}
function Legend({ color, label }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-0.5 w-3.5 rounded-full", style: { backgroundColor: color } }),
    label
  ] });
}
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs shadow-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-1.5 font-semibold text-slate-700", children: label }),
    payload.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize text-slate-400", children: p.dataKey === "net" ? "Net Cash Flow" : p.dataKey }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-800", children: formatINR(p.value) })
    ] }, p.dataKey))
  ] });
}
const COLORS = ["#059669", "#10b981", "#34d399", "#6ee7b7", "#94a3b8", "#cbd5e1", "#e2e8f0", "#0f766e"];
function SpendingBreakdown() {
  const { categoryTotals, totalExpenses } = useAppStore();
  const [selected, setSelected] = reactExports.useState(categoryTotals[0]?.category ?? "");
  const data = reactExports.useMemo(() => categoryTotals.filter((c) => c.amount > 0), [categoryTotals]);
  const active = data.find((d) => d.category === selected) ?? data[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-slate-900", children: "Spending Breakdown" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-5 text-sm text-slate-400", children: "Where your money goes" }),
    data.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyCard, { label: "No expenses yet", hint: "Add an expense to see your spending breakdown" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto h-48 w-48", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Pie,
              {
                data,
                dataKey: "amount",
                nameKey: "category",
                innerRadius: 62,
                outerRadius: 88,
                paddingAngle: 2,
                onClick: (d) => setSelected(d.category),
                cursor: "pointer",
                children: data.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: COLORS[i % COLORS.length], opacity: d.category === selected ? 1 : 0.55, stroke: "white", strokeWidth: 2 }, d.category))
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (v) => formatINR(v) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-none absolute inset-0 flex flex-col items-center justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-slate-400", children: "Total spent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-slate-900", children: formatINR(totalExpenses) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: data.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setSelected(d.category),
            className: `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${selected === d.category ? "bg-emerald-50" : "hover:bg-stone-50"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2.5 w-2.5 shrink-0 rounded-full", style: { backgroundColor: COLORS[i % COLORS.length] } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-sm font-medium text-slate-700", children: d.category }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-400", children: [
                d.percentage,
                "%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-24 shrink-0 text-right text-sm font-semibold text-slate-800", children: formatINR(d.amount) })
            ]
          },
          d.category
        )) })
      ] }),
      active && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in mt-5 rounded-2xl border border-slate-100 bg-stone-50 p-4 sm:p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-slate-400", children: "Category detail" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-lg font-bold text-slate-900", children: active.category })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-500", children: [
            active.percentage,
            "% of total spend"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Receipt, label: "Amount", value: formatINR(active.amount) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Calculator, label: "Avg transaction", value: formatINR(active.averageTransaction) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Receipt, label: "Transactions", value: String(active.transactionCount) })
        ] })
      ] })
    ] })
  ] });
}
function Stat({ icon: Icon, label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 rounded-xl bg-white px-3 py-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 shrink-0 text-emerald-600" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-400", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-semibold text-slate-800", children: value })
    ] })
  ] });
}
const SEVERITY_STYLE = {
  positive: { badge: "bg-emerald-50 text-emerald-700", iconWrap: "bg-emerald-50 text-emerald-600", label: "Positive" },
  watch: { badge: "bg-amber-50 text-amber-700", iconWrap: "bg-amber-50 text-amber-600", label: "Watch" },
  warning: { badge: "bg-rose-50 text-rose-700", iconWrap: "bg-rose-50 text-rose-600", label: "Needs attention" }
};
function InsightsSection() {
  const [openId, setOpenId] = reactExports.useState(null);
  const [insights, setInsights] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [offline, setOffline] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    let cancelled = false;
    Promise.all([fetchCashFlowForecast("normal"), fetchAnomalies(), fetchCreditReadiness(), fetchAnalyticsOverview()]).then(([forecast, anomalies, credit, overview]) => {
      if (cancelled) return;
      const cards = [];
      const nextMonth = forecast.forecast[0];
      cards.push({
        id: "forecast",
        icon: TrendingUp,
        title: "Cash Flow Forecast",
        severity: forecast.trend_direction === "declining" ? "watch" : "positive",
        summary: nextMonth ? `Projected balance for ${nextMonth.label}: ${formatINR(nextMonth.projected_balance)} (${forecast.trend_direction}).` : "Add more transactions to unlock a forecast.",
        detail: `${forecast.disclaimer} Method: ${forecast.method}. This uses your historical income and expense pattern under the "${forecast.scenario_label}" scenario.`
      });
      const topAnomaly = anomalies.items[0];
      cards.push({
        id: "anomaly",
        icon: TriangleAlert,
        title: "Anomaly Alert",
        severity: topAnomaly ? topAnomaly.severity === "high" ? "warning" : "watch" : "positive",
        summary: topAnomaly ? `${topAnomaly.category}: ${topAnomaly.explanation}` : "No unusual expenses detected in your recent transactions.",
        detail: topAnomaly ? `${topAnomaly.explanation} Typical spend in this category is around ${formatINR(topAnomaly.normal_average)}, this transaction was ${formatINR(topAnomaly.amount)} (${topAnomaly.deviation_percentage}% deviation). ${anomalies.note}` : anomalies.note
      });
      cards.push({
        id: "overview",
        icon: Lightbulb,
        title: "Spending Insight",
        severity: "watch",
        summary: overview.insights[0] ?? "Add more transactions to unlock deeper trend insights.",
        detail: overview.insights.join(" ")
      });
      cards.push({
        id: "credit",
        icon: ShieldCheck,
        title: "Credit Readiness",
        severity: credit.score >= 70 ? "positive" : credit.score >= 40 ? "watch" : "warning",
        summary: `Prototype financial indicator score: ${credit.score}/100.`,
        detail: `${credit.disclaimer} Factors — income consistency: ${credit.factors.income_consistency}, expense consistency: ${credit.factors.expense_consistency}, cash flow stability: ${credit.factors.cash_flow_stability}, transaction history: ${credit.factors.transaction_history}. ${credit.methodology}`
      });
      setInsights(cards);
      setOffline(false);
      setError(null);
    }).catch((err) => {
      if (cancelled) return;
      if (isOfflineError(err)) setOffline(true);
      else setError(err instanceof Error ? err.message : "Failed to load insights");
    }).finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);
  const active = insights?.find((i) => i.id === openId);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-[11px] font-bold text-white", children: "D" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-slate-900", children: "DHAN Insights" })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingCard, { label: "Analyzing your finances…" }) : offline ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorCard, { offline: true }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorCard, { message: error }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: insights?.map((insight) => {
      const Icon = insight.icon;
      const style = SEVERITY_STYLE[insight.severity];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col rounded-2xl border border-slate-100 bg-stone-50 p-4 transition hover:border-slate-200 hover:bg-white hover:shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-9 w-9 items-center justify-center rounded-xl ${style.iconWrap}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-[18px] w-[18px]", strokeWidth: 2.2 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `rounded-full px-2 py-1 text-[11px] font-semibold ${style.badge}`, children: style.label })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-slate-800", children: insight.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 flex-1 text-sm leading-relaxed text-slate-500", children: insight.summary }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setOpenId(insight.id),
            className: "mt-3 inline-flex items-center gap-1 self-start text-xs font-semibold text-emerald-700 hover:underline",
            children: [
              "View details ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3" })
            ]
          }
        )
      ] }, insight.id);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open: !!active, onClose: () => setOpenId(null), title: active?.title ?? "", maxWidth: "max-w-md", children: active && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `mb-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${SEVERITY_STYLE[active.severity].badge}`, children: SEVERITY_STYLE[active.severity].label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed text-slate-600", children: active.detail })
    ] }) })
  ] });
}
function greeting() {
  const hour = (/* @__PURE__ */ new Date()).getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
function DashboardOverview() {
  const { loading, offline, error, refresh } = useAppStore();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-slide-up", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-slate-900 sm:text-3xl", children: [
        greeting(),
        ", ",
        BUSINESS_PROFILE.ownerGreetingName
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-slate-500 sm:text-base", children: "Here's how your business is doing." })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingCard, { label: "Loading your dashboard…" }) : offline ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorCard, { offline: true, onRetry: refresh }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorCard, { message: error, onRetry: refresh }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCards, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CashFlowChart, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SpendingBreakdown, {}) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InsightsSection, {})
    ] })
  ] });
}
export {
  DashboardOverview as D
};
