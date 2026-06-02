"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://gize-backend.onrender.com"

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
      const supabase = createClient()
      const { data: session } = await supabase.auth.getSession()
      const token = session?.session?.access_token

      const response = await fetch(`${BACKEND_URL}/api/overdue`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
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
