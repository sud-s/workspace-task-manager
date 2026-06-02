export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 px-4">
      <div className="pointer-events-none absolute inset-0 bg-grid-white" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(142_76%_46%_/_0.12),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsl(142_76%_46%_/_0.06),transparent_50%)]" />
      <div className="pointer-events-none absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px] animate-float" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-emerald-500/8 blur-[80px] animate-float-delayed" />
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center animate-slide-up">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 bg-clip-text text-transparent">
              Gize
            </span>
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Task management, reimagined
          </p>
        </div>
        <div className="animate-scale-in rounded-xl border border-zinc-800/60 bg-zinc-900/60 p-6 backdrop-blur-xl shadow-2xl shadow-emerald-500/5">
          {children}
        </div>
      </div>
    </div>
  )
}
