export function Logo({ className = '', mark = true, size = 'md' }: { className?: string; mark?: boolean; size?: 'sm' | 'md' | 'lg' }) {
  const textSize = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-lg' : 'text-2xl'
  const markSize = size === 'lg' ? 'h-10 w-10 text-lg' : size === 'sm' ? 'h-7 w-7 text-xs' : 'h-9 w-9 text-sm'

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {mark && (
        <span
          className={`flex ${markSize} items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 font-bold text-white shadow-sm shadow-emerald-900/20`}
        >
          ₹
        </span>
      )}
      <span className={`${textSize} font-bold tracking-tight text-slate-900`}>DHAN</span>
    </div>
  )
}
