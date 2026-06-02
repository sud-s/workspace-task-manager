"use client"

import { useState } from "react"
import { useOverdueTasks } from "@/hooks/use-overdue-tasks"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { formatDate } from "@/lib/utils"

type OverdueTasksButtonProps = {
  projectId: string
}

export function OverdueTasksButton({ projectId }: OverdueTasksButtonProps) {
  const [showOverdue, setShowOverdue] = useState(false)
  const { data: overdueTasks, isLoading, error, refetch } = useOverdueTasks(projectId)

  if (error) {
    return null
  }

  const count = overdueTasks?.length ?? 0

  if (count === 0 && !showOverdue) {
    return null
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setShowOverdue(!showOverdue)
          refetch()
        }}
        className="gap-1.5 border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:text-red-300"
      >
        <AlertCircle className="h-4 w-4" />
        {isLoading ? "Loading..." : `${count} overdue`}
      </Button>

      {showOverdue && overdueTasks && overdueTasks.length > 0 && (
        <div className="absolute top-full mt-2 right-0 z-50 w-80 rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl">
          <h4 className="text-sm font-semibold text-zinc-100 mb-3">Overdue Tasks</h4>
          <div className="space-y-2">
            {overdueTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-lg border border-red-500/10 bg-red-500/5 px-3 py-2.5 text-sm"
              >
                <p className="font-medium text-zinc-200">{task.title}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                  <span>Due {formatDate(task.due_date)}</span>
                  {task.assignee_name && (
                    <>
                      <span>&middot;</span>
                      <span className="text-zinc-400">{task.assignee_name}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
