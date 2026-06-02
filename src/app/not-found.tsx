import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800/50">
        <span className="text-2xl font-bold text-zinc-500">404</span>
      </div>
      <h1 className="text-xl font-semibold text-zinc-100">Page not found</h1>
      <p className="max-w-md text-center text-sm text-zinc-500">
        This page doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex h-9 items-center justify-center rounded-md bg-emerald-600 px-5 text-sm font-medium text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-500"
      >
        Go home
      </Link>
    </div>
  )
}
