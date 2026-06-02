"use client"

import { use, useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { useSupabase } from "@/providers/supabase-provider"
import { getProject } from "@/lib/queries"
import { TaskList } from "@/components/tasks/task-list"
import { TaskBoard } from "@/components/tasks/task-board"
import { TaskCalendar } from "@/components/tasks/task-calendar"
import { TaskDetailPanel } from "@/components/tasks/task-detail-panel"
import { TaskFilters } from "@/components/tasks/task-filters"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { OverdueTasksButton } from "@/components/tasks/overdue-tasks-button"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { List, Columns3, CalendarDays } from "lucide-react"
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
  const [view, setView] = useState<"list" | "board" | "calendar">("list")

  const VIEW_OPTIONS = [
    { value: "list", label: "List", icon: List },
    { value: "board", label: "Board", icon: Columns3 },
    { value: "calendar", label: "Calendar", icon: CalendarDays },
  ] as const

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
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0">
          {projectLoading ? (
            <Skeleton className="h-8 w-48 bg-zinc-800/50" />
          ) : (
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white truncate">
                {project?.name ?? "Project"}
              </h1>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center rounded-lg border border-border bg-card p-0.5 shrink-0">
            {VIEW_OPTIONS.map(({ value, label, icon: Icon }) => (
              <Button
                key={value}
                variant="ghost"
                size="sm"
                onClick={() => setView(value)}
                className={`h-8 px-2 text-xs gap-1 ${
                  view === value
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-muted-foreground hover:text-card-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </Button>
            ))}
          </div>
          <OverdueTasksButton projectId={projectId} />
          <CreateTaskDialog projectId={projectId} workspaceId={workspaceId} />
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-zinc-800 via-zinc-800/50 to-transparent" />

      <TaskFilters workspaceId={workspaceId} />

      {view === "list" && (
        <TaskList
          projectId={projectId}
          workspaceId={workspaceId}
          filters={filters}
          onTaskClick={setSelectedTaskId}
        />
      )}

      {view === "board" && (
        <TaskBoard
          projectId={projectId}
          workspaceId={workspaceId}
          filters={filters}
        />
      )}

      {view === "calendar" && (
        <TaskCalendar
          projectId={projectId}
          workspaceId={workspaceId}
          filters={filters}
        />
      )}

      {view === "list" && (
        <TaskDetailPanel
          taskId={selectedTaskId}
          workspaceId={workspaceId}
          projectId={projectId}
          onClose={handleClosePanel}
        />
      )}
    </div>
  )
}
