"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Plus, Users, Settings } from "lucide-react"
import { WorkspaceSwitcher } from "./workspace-switcher"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"
import { useWorkspaceStore } from "@/stores/workspace-store"
import { useProjects } from "@/hooks/use-projects"
import { Skeleton } from "@/components/ui/skeleton"

export function Sidebar() {
  const pathname = usePathname()
  const currentWorkspaceId = useWorkspaceStore((s) => s.currentWorkspaceId)
  const { data: projects, isLoading } = useProjects(currentWorkspaceId ?? "")

  const workspacePath = currentWorkspaceId ? `/${currentWorkspaceId}` : "/"

  return (
    <aside className="flex h-full w-64 flex-col border-r border-zinc-800/50 bg-zinc-900/40 backdrop-blur-xl">
      <div className="p-4">
        <WorkspaceSwitcher />
      </div>

      <Separator className="bg-zinc-800/50" />

      <nav className="flex-1 space-y-1 p-3">
        <Link
          href={workspacePath}
          className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-zinc-800/60 hover:text-white ${
            pathname === workspacePath
              ? "bg-zinc-800/60 text-white shadow-sm"
              : "text-zinc-400"
          }`}
        >
          <Home className={`h-4 w-4 transition-all ${
            pathname === workspacePath ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-300"
          }`} />
          Dashboard
          {pathname === workspacePath && (
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
          )}
        </Link>

        <Separator className="my-3 bg-zinc-800/50" />

        <div className="flex items-center justify-between px-3 py-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
            Projects
          </span>
          <CreateProjectDialog workspaceId={currentWorkspaceId ?? ""}>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500 hover:text-white hover:bg-zinc-800">
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </CreateProjectDialog>
        </div>

        {isLoading ? (
          <div className="space-y-1.5 px-1">
            <Skeleton className="h-9 w-full bg-zinc-800/50" />
            <Skeleton className="h-9 w-full bg-zinc-800/50" />
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="space-y-0.5 px-1">
            {projects.map((project) => {
              const isActive = pathname.includes(project.id)
              return (
                <Link
                  key={project.id}
                  href={`/${currentWorkspaceId}/projects/${project.id}`}
                  className={`group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all ${
                    isActive
                      ? "bg-zinc-800/60 text-white font-medium"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all ${
                    isActive ? "bg-emerald-400 shadow-sm shadow-emerald-400/30" : "bg-zinc-600 group-hover:bg-zinc-500"
                  }`} />
                  <span className="truncate">{project.name}</span>
                  {isActive && (
                    <span className="ml-auto h-1 w-1 rounded-full bg-emerald-400/50" />
                  )}
                </Link>
              )
            })}
          </div>
        ) : (
          <p className="px-4 py-3 text-xs text-zinc-500">
            No projects yet
          </p>
        )}

        <Separator className="my-3 bg-zinc-800/50" />

        <Link
          href={currentWorkspaceId ? `/${currentWorkspaceId}/members` : "#"}
          className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-zinc-800/60 hover:text-white ${
            pathname.includes("/members")
              ? "bg-zinc-800/60 text-white shadow-sm"
              : "text-zinc-400"
          }`}
        >
          <Users className={`h-4 w-4 transition-all ${
            pathname.includes("/members") ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-300"
          }`} />
          Members
          {pathname.includes("/members") && (
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
          )}
        </Link>

        <Link
          href={currentWorkspaceId ? `/${currentWorkspaceId}/settings` : "#"}
          className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-zinc-800/60 hover:text-white ${
            pathname.includes("/settings")
              ? "bg-zinc-800/60 text-white shadow-sm"
              : "text-zinc-400"
          }`}
        >
          <Settings className={`h-4 w-4 transition-all ${
            pathname.includes("/settings") ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-300"
          }`} />
          Settings
          {pathname.includes("/settings") && (
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
          )}
        </Link>
      </nav>

      <div className="border-t border-zinc-800/50 p-3">
        <CreateWorkspaceDialog>
          <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-all hover:bg-zinc-800/60 hover:text-white">
            <Plus className="h-4 w-4" />
            New Workspace
          </button>
        </CreateWorkspaceDialog>
      </div>
    </aside>
  )
}
