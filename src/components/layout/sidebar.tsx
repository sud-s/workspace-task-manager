"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Plus } from "lucide-react"
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
    <aside className="flex h-full w-64 flex-col border-r bg-card">
      <div className="p-4">
        <WorkspaceSwitcher />
      </div>

      <Separator />

      <nav className="flex-1 space-y-1 p-3">
        <Link
          href={workspacePath}
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
            pathname === workspacePath
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground"
          }`}
        >
          <Home className="h-4 w-4" />
          Dashboard
        </Link>

        <Separator className="my-2" />

        <div className="flex items-center justify-between px-3 py-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Projects
          </span>
          <CreateProjectDialog workspaceId={currentWorkspaceId ?? ""}>
            <Button variant="ghost" size="icon" className="h-5 w-5">
              <Plus className="h-3 w-3" />
            </Button>
          </CreateProjectDialog>
        </div>

        {isLoading ? (
          <div className="space-y-1 px-1">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="space-y-1 px-1">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/${currentWorkspaceId}/projects/${project.id}`}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                  pathname.includes(project.id)
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-primary/40" />
                <span className="truncate">{project.name}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="px-4 py-2 text-xs text-muted-foreground">
            No projects yet
          </p>
        )}
      </nav>

      <Separator />

      <div className="p-3">
        <CreateWorkspaceDialog />
      </div>
    </aside>
  )
}
