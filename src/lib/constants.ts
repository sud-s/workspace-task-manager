export const TASK_STATUSES = ["todo", "in_progress", "done"] as const
export type TaskStatus = (typeof TASK_STATUSES)[number]

export const WORKSPACE_ROLES = ["owner", "member"] as const
export type WorkspaceRole = (typeof WORKSPACE_ROLES)[number]

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
}

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  todo: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  done: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
}
