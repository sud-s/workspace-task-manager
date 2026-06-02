import Link from "next/link"

export default function DashboardNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800/50 ring-1 ring-zinc-700/50">
        <span className="text-2xl font-bold text-zinc-500">404</span>
      </div>
      <h1 className="mt-6 text-xl font-semibold text-zinc-100">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-sm text-zinc-500">
        This workspace or project doesn&apos;t exist, or you may not have access.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex h-9 items-center justify-center rounded-md bg-emerald-600 px-5 text-sm font-medium text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-500"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
