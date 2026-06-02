"use client"

import { use, useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { useSupabase } from "@/providers/supabase-provider"
import { getProject } from "@/lib/queries"
import { TaskList } from "@/components/tasks/task-list"
import { TaskFilters } from "@/components/tasks/task-filters"
import { TaskDetailPanel } from "@/components/tasks/task-detail-panel"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { OverdueTasksButton } from "@/components/tasks/overdue-tasks-button"
import { Skeleton } from "@/components/ui/skeleton"
import type { TaskFilters as TaskFiltersType } from "@/lib/queries"
import type { TaskStatus } from "@/lib/constants"

type PageProps = {
  params: Promise<{ workspaceId: string; projectId: string }>
}

export default function ProjectPage({ params }: PageProps) {
  const { workspaceId, projectId } = use(params)
  const supabase = useSupabase()
  const searchParams = useSearchParams()
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(supabase, projectId),
    enabled: !!projectId,
  })

  const filters: TaskFiltersType = useMemo(() => {
    const statusParam = searchParams.get("status")
    const assigneeParam = searchParams.get("assignee")
    const statuses = statusParam
      ? (statusParam.split(",").filter(Boolean) as TaskStatus[])
      : undefined
    return {
      ...(statuses && statuses.length > 0 ? { status: statuses } : {}),
      ...(assigneeParam ? { assignee: assigneeParam } : {}),
    }
  }, [searchParams])

  function handleClosePanel() {
    setSelectedTaskId(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          {projectLoading ? (
            <Skeleton className="h-8 w-48" />
          ) : (
            <h1 className="text-2xl font-semibold tracking-tight truncate">
              {project?.name ?? "Project"}
            </h1>
          )}
        </div>
        <div className="flex items-center gap-2">
          <OverdueTasksButton projectId={projectId} />
          <CreateTaskDialog projectId={projectId} workspaceId={workspaceId} />
        </div>
      </div>

      <TaskFilters workspaceId={workspaceId} />

      <TaskList
        projectId={projectId}
        workspaceId={workspaceId}
        filters={filters}
        onTaskClick={setSelectedTaskId}
      />

      <TaskDetailPanel
        taskId={selectedTaskId}
        workspaceId={workspaceId}
        onClose={handleClosePanel}
      />
    </div>
  )
}
