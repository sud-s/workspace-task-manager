"use client"

import { TASK_STATUS_LABELS, type TaskStatus } from "@/lib/constants"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type TaskStatusSelectProps = {
  value: TaskStatus
  onChange: (status: TaskStatus) => void
}

const statusColors: Record<TaskStatus, string> = {
  todo: "text-amber-600 dark:text-amber-400",
  in_progress: "text-blue-600 dark:text-blue-400",
  done: "text-green-600 dark:text-green-400",
}

export function TaskStatusSelect({ value, onChange }: TaskStatusSelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as TaskStatus)}>
      <SelectTrigger className={`w-36 ${statusColors[value]}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.entries(TASK_STATUS_LABELS) as [TaskStatus, string][]).map(
          ([status, label]) => (
            <SelectItem key={status} value={status} className={statusColors[status]}>
              {label}
            </SelectItem>
          ),
        )}
      </SelectContent>
    </Select>
  )
}
