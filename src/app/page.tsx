import { redirect } from "next/navigation"
import Link from "next/link"
import { createServerSupabase } from "@/lib/supabase/server"
import {
  Layers,
  FolderKanban,
  CheckSquare,
  Radio,
  ArrowRight,
} from "lucide-react"

export default async function HomePage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: workspaces } = await supabase
      .from("workspaces")
      .select("id")
      .limit(1)

    if (workspaces && workspaces.length > 0) {
      redirect(`/${workspaces[0].id}`)
    }

    redirect("/dashboard")
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-zinc-950">
      <div className="pointer-events-none fixed inset-0 bg-grid-white" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(142_76%_46%_/_0.1),transparent_60%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsl(142_76%_46%_/_0.05),transparent_50%)]" />

      <div className="pointer-events-none fixed top-1/3 left-1/4 h-80 w-80 rounded-full bg-emerald-500/10 blur-[120px] animate-float" />
      <div className="pointer-events-none fixed bottom-1/3 right-1/4 h-64 w-64 rounded-full bg-emerald-500/8 blur-[100px] animate-float-delayed" />

      <nav className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 shadow-lg shadow-emerald-500/30">
            <span className="text-sm font-bold text-white">G</span>
          </div>
          <span className="text-lg font-semibold text-zinc-100">gize</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-9 items-center justify-center rounded-md bg-emerald-600 px-5 text-sm font-medium text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-500"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6">
        <section className="flex flex-1 flex-col items-center justify-center pb-16 pt-24 text-center">
          <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-1.5 text-xs text-zinc-500 backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            Multi-workspace task management
          </div>

          <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight text-zinc-100 sm:text-6xl md:text-7xl">
            Time is{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 bg-clip-text text-transparent">
              everything
            </span>
            .
            <br />
            <span className="bg-gradient-to-r from-zinc-300 to-zinc-500 bg-clip-text text-transparent">
              Manage it with Gize.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base text-zinc-500 sm:text-lg">
            Organize projects across workspaces, track tasks in real-time, and
            keep your team aligned — all in one place.
          </p>

          <div className="mt-10 flex items-center gap-4">
            <Link
              href="/signup"
              className="group inline-flex h-12 items-center gap-2 rounded-lg bg-emerald-600 px-8 text-base font-medium text-white shadow-xl shadow-emerald-500/25 transition-all hover:bg-emerald-500 hover:shadow-emerald-500/35"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center rounded-lg border border-zinc-800 bg-zinc-900/50 px-8 text-base font-medium text-zinc-400 shadow-sm backdrop-blur-sm transition-all hover:border-zinc-700 hover:text-zinc-200"
            >
              Sign In
            </Link>
          </div>

          <p className="mt-4 text-xs text-zinc-600">
            No credit card required. Start managing in minutes.
          </p>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
              Everything you need to stay on time
            </h2>
            <p className="mt-4 text-zinc-500">
              Gize helps you break down the chaos into manageable pieces.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {[
              {
                icon: Layers,
                title: "Workspaces",
                description:
                  "Separate teams, clients, or personal projects into isolated workspaces with their own members and settings.",
              },
              {
                icon: FolderKanban,
                title: "Projects",
                description:
                  "Create projects within workspaces, track progress with visual indicators, and keep everything organized.",
              },
              {
                icon: CheckSquare,
                title: "Tasks",
                description:
                  "Assign, prioritize, and track tasks with statuses, due dates, and rich details — all in real-time.",
              },
              {
                icon: Radio,
                title: "Real-time Sync",
                description:
                  "Changes propagate instantly across your team. No refresh needed — everyone stays in sync.",
              },
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="card-3d group"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="card-3d-inner animate-slide-up rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-6 opacity-0 [animation-fill-mode:forwards] hover:border-zinc-700/60 hover:bg-zinc-900/80">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 shadow-sm shadow-emerald-500/5">
                      <Icon className="h-5 w-5 text-emerald-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-zinc-100">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="py-24 text-center">
          <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-12 backdrop-blur-sm">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
              Ready to take control of your time?
            </h2>
            <p className="mt-4 text-zinc-500">
              Join Gize and stop losing track of what matters.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-lg bg-emerald-600 px-8 text-base font-medium text-white shadow-xl shadow-emerald-500/25 transition-all hover:bg-emerald-500 hover:shadow-emerald-500/35"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-3 text-xs text-zinc-600">
              Free to start. No credit card required.
            </p>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-zinc-800/50">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <span className="text-emerald-400">Gize</span>
            <span>&middot;</span>
            <span>&copy; {new Date().getFullYear()} Gize. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-600">
            <a
              href="https://github.com/sud-s/workspace-task-manager"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-zinc-400"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
