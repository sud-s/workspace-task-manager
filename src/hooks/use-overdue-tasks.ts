"use client"

import { useQuery } from "@tanstack/react-query"

type OverdueTask = {
  id: string
  title: string
  due_date: string
  assignee_name: string | null
}

type OverdueResponse = {
  tasks: OverdueTask[]
}

export function useOverdueTasks(projectId: string) {
  return useQuery({
    queryKey: ["overdue-tasks", projectId],
    queryFn: async () => {
      const response = await fetch("/api/overdue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: projectId }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch overdue tasks")
      }

      const data: OverdueResponse = await response.json()
      return data.tasks
    },
    enabled: !!projectId,
  })
}
