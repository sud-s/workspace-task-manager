"use client"

import { useParams } from "next/navigation"
import { useWorkspace } from "@/hooks/use-workspaces"
import { useProjects } from "@/hooks/use-projects"
import { useRealtimeProjects } from "@/hooks/use-realtime-projects"
import { useWorkspaceStore } from "@/stores/workspace-store"
import { useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ProjectCard } from "@/components/projects/project-card"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"
import { FolderKanban } from "lucide-react"

export default function WorkspaceDashboardPage() {
  const params = useParams()
  const workspaceId = params.workspaceId as string
  const setCurrentWorkspaceId = useWorkspaceStore((s) => s.setCurrentWorkspaceId)

  const { data: workspace, isLoading: wsLoading, isError: wsError } = useWorkspace(workspaceId)
  const { data: projects, isLoading: projLoading } = useProjects(workspaceId)

  useRealtimeProjects(workspaceId)

  useEffect(() => {
    if (workspaceId) {
      setCurrentWorkspaceId(workspaceId)
    }
  }, [workspaceId, setCurrentWorkspaceId])

  if (wsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 bg-zinc-800/50" />
          <Skeleton className="h-4 w-24 mt-2 bg-zinc-800/50" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-40 bg-zinc-800/50 rounded-xl" />
          <Skeleton className="h-40 bg-zinc-800/50 rounded-xl" />
        </div>
      </div>
    )
  }

  if (wsError || !workspace) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 ring-1 ring-red-500/20 mb-4">
          <FolderKanban className="h-6 w-6 text-red-400" />
        </div>
        <h2 className="text-lg font-semibold text-zinc-200">Workspace not found</h2>
        <p className="mt-1 text-sm text-zinc-500">
          This workspace may have been deleted or you don&apos;t have access.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{workspace.name}</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {projects ? `${projects.length} ${projects.length === 1 ? "project" : "projects"}` : "Loading projects..."}
          </p>
        </div>
        <CreateProjectDialog workspaceId={workspaceId} />
      </div>

      <div className="h-px bg-gradient-to-r from-zinc-800 via-zinc-800/50 to-transparent" />

      {projLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-40 bg-zinc-800/50 rounded-xl" />
          <Skeleton className="h-40 bg-zinc-800/50 rounded-xl" />
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              workspaceId={workspaceId}
              name={project.name}
              taskCounts={project.task_counts}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800/50 ring-1 ring-zinc-700/50 mb-4">
            <FolderKanban className="h-6 w-6 text-zinc-500" />
          </div>
          <h3 className="text-sm font-medium text-zinc-400">No projects yet</h3>
          <p className="mt-1 text-xs text-zinc-600">
            Create your first project to get started.
          </p>
        </div>
      )}
    </div>
  )
}
