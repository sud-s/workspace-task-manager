"use client"

import { useQuery } from "@tanstack/react-query"
import type { UseQueryResult } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"

const EDGE_FUNCTION_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/overdue-tasks`
  : "https://bfnynfufkrybpffjtunm.supabase.co/functions/v1/overdue-tasks"

type OverdueTask = {
  id: string
  title: string
  due_date: string
  assignee_name: string | null
}

type OverdueResponse = {
  tasks: OverdueTask[]
}

export function useOverdueTasks(projectId: string): UseQueryResult<OverdueTask[]> {
  return useQuery({
    queryKey: ["overdue-tasks", projectId],
    queryFn: async () => {
      const supabase = createClient()
      const { data: session } = await supabase.auth.getSession()
      const token = session?.session?.access_token

      const response = await fetch(EDGE_FUNCTION_URL, {
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
