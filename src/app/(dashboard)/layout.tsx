import { Sidebar } from "@/components/layout/sidebar"
import { UserNav } from "@/components/layout/user-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      <div className="pointer-events-none fixed inset-0 bg-grid-white z-0" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,_hsl(142_76%_46%_/_0.04),transparent_50%)] z-0" />
      <Sidebar />
      <div className="relative z-10 flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-end gap-4 border-b border-zinc-800/50 bg-zinc-950/80 px-6 backdrop-blur-xl">
          <UserNav />
        </header>
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-transparent to-zinc-900/50">
          <div className="mx-auto max-w-6xl p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
