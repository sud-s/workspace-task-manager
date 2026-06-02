"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Plus, Users, Settings, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { WorkspaceSwitcher } from "./workspace-switcher"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"
import { useWorkspaceStore } from "@/stores/workspace-store"
import { useProjects } from "@/hooks/use-projects"
import { Skeleton } from "@/components/ui/skeleton"
import { ThemeToggle } from "./theme-toggle"

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname()
  const currentWorkspaceId = useWorkspaceStore((s) => s.currentWorkspaceId)
  const { data: projects, isLoading } = useProjects(currentWorkspaceId ?? "")

  const workspacePath = currentWorkspaceId ? `/${currentWorkspaceId}` : "/"

  return (
    <>
      <div className="p-4">
        <WorkspaceSwitcher />
      </div>

      <Separator className="bg-border/50" />

      <nav className="flex-1 space-y-1 p-3">
        <Link
          href={workspacePath}
          onClick={onNavClick}
          className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent/60 hover:text-accent-foreground ${
            pathname === workspacePath
              ? "bg-accent/60 text-accent-foreground shadow-sm"
              : "text-muted-foreground"
          }`}
        >
          <Home className={`h-4 w-4 transition-all ${
            pathname === workspacePath ? "text-emerald-400" : "text-muted-foreground group-hover:text-card-foreground"
          }`} />
          Dashboard
          {pathname === workspacePath && (
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
          )}
        </Link>

        <Separator className="my-3 bg-border/50" />

        <div className="flex items-center justify-between px-3 py-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
            Projects
          </span>
          <CreateProjectDialog workspaceId={currentWorkspaceId ?? ""}>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-card-foreground hover:bg-accent">
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </CreateProjectDialog>
        </div>

        {isLoading ? (
          <div className="space-y-1.5 px-1">
            <Skeleton className="h-9 w-full bg-accent" />
            <Skeleton className="h-9 w-full bg-accent" />
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="space-y-0.5 px-1">
            {projects.map((project) => {
              const isActive = pathname.includes(project.id)
              return (
                <Link
                  key={project.id}
                  href={`/${currentWorkspaceId}/projects/${project.id}`}
                  onClick={onNavClick}
                  className={`group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all ${
                    isActive
                      ? "bg-accent/60 text-accent-foreground font-medium"
                      : "text-muted-foreground hover:text-card-foreground hover:bg-accent/40"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all ${
                    isActive ? "bg-emerald-400 shadow-sm shadow-emerald-400/30" : "bg-muted-foreground/40 group-hover:bg-muted-foreground/60"
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
          <p className="px-4 py-3 text-xs text-muted-foreground">
            No projects yet
          </p>
        )}

        <Separator className="my-3 bg-border/50" />

        <Link
          href={currentWorkspaceId ? `/${currentWorkspaceId}/members` : "#"}
          onClick={onNavClick}
          className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent/60 hover:text-accent-foreground ${
            pathname.includes("/members")
              ? "bg-accent/60 text-accent-foreground shadow-sm"
              : "text-muted-foreground"
          }`}
        >
          <Users className={`h-4 w-4 transition-all ${
            pathname.includes("/members") ? "text-emerald-400" : "text-muted-foreground group-hover:text-card-foreground"
          }`} />
          Members
          {pathname.includes("/members") && (
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
          )}
        </Link>

        <Link
          href={currentWorkspaceId ? `/${currentWorkspaceId}/settings` : "#"}
          onClick={onNavClick}
          className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent/60 hover:text-accent-foreground ${
            pathname.includes("/settings")
              ? "bg-accent/60 text-accent-foreground shadow-sm"
              : "text-muted-foreground"
          }`}
        >
          <Settings className={`h-4 w-4 transition-all ${
            pathname.includes("/settings") ? "text-emerald-400" : "text-muted-foreground group-hover:text-card-foreground"
          }`} />
          Settings
          {pathname.includes("/settings") && (
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
          )}
        </Link>
      </nav>

      <div className="border-t border-border/50 p-3 flex items-center gap-2">
        <CreateWorkspaceDialog>
          <button className="flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent/60 hover:text-accent-foreground">
            <Plus className="h-4 w-4" />
            New Workspace
          </button>
        </CreateWorkspaceDialog>
        <ThemeToggle />
      </div>
    </>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex h-full w-64 flex-col border-r border-border/50 bg-card/40 backdrop-blur-xl">
      <SidebarContent />
    </aside>
  )
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="lg:hidden h-9 w-9 text-muted-foreground hover:text-card-foreground"
      >
        <Menu className="h-5 w-5" />
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div             className="fixed inset-y-0 left-0 w-72 bg-background border-r border-border/50 shadow-2xl" style={{ animation: "slide-up 0.2s ease-out" }}>
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-end p-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  className="h-8 w-8 text-muted-foreground hover:text-card-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <SidebarContent onNavClick={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
