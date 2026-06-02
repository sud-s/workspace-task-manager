"use client"

import { useParams } from "next/navigation"
import { useWorkspace } from "@/hooks/use-workspaces"
import { useProjects } from "@/hooks/use-projects"
import { useWorkspaceStore } from "@/stores/workspace-store"
import { useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ProjectCard } from "@/components/projects/project-card"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"
import { Separator } from "@/components/ui/separator"

export default function WorkspaceDashboardPage() {
  const params = useParams()
  const workspaceId = params.workspaceId as string
  const setCurrentWorkspaceId = useWorkspaceStore((s) => s.setCurrentWorkspaceId)

  const { data: workspace, isLoading: wsLoading, isError: wsError } = useWorkspace(workspaceId)
  const { data: projects, isLoading: projLoading } = useProjects(workspaceId)

  useEffect(() => {
    if (workspaceId) {
      setCurrentWorkspaceId(workspaceId)
    }
  }, [workspaceId, setCurrentWorkspaceId])

  if (wsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    )
  }

  if (wsError || !workspace) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-xl font-semibold">Workspace not found</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This workspace may have been deleted or you don&apos;t have access.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{workspace.name}</h1>
          <p className="text-sm text-muted-foreground">
            {projects ? `${projects.length} projects` : "Loading projects..."}
          </p>
        </div>
        <CreateProjectDialog workspaceId={workspaceId} />
      </div>

      <Separator />

      {projLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
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
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-muted-foreground">
            No projects yet. Create your first project to get started.
          </p>
        </div>
      )}
    </div>
  )
}
