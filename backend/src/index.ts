import express from "express"
import cors from "cors"
import { createClient } from "@supabase/supabase-js"
import type { Request, Response } from "express"

const app = express()

app.use(cors())
app.use(express.json())

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

app.post("/api/overdue", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      res.status(401).json({ error: "Missing Authorization header" })
      return
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }

    const { project_id } = req.body
    if (!project_id || typeof project_id !== "string") {
      res.status(400).json({ error: "project_id is required" })
      return
    }

    const today = new Date().toISOString().split("T")[0]

    const { data: tasks, error } = await supabase
      .from("tasks")
      .select(
        `
        id,
        title,
        due_date,
        assignee:assignee_id (id, email, user_metadata)
      `,
      )
      .eq("project_id", project_id)
      .eq("status", "todo")
      .not("due_date", "is", null)
      .lt("due_date", today)
      .order("due_date", { ascending: true })

    if (error) {
      res.status(500).json({ error: error.message })
      return
    }

    const overdue = (tasks ?? []).map((task) => ({
      id: task.id,
      title: task.title,
      due_date: task.due_date,
      assignee_name:
        (
          task.assignee as {
            user_metadata?: { full_name?: string }
          } | null
        )?.user_metadata?.full_name ?? null,
    }))

    res.json({ tasks: overdue })
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Unknown error",
    })
  }
})

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

const port = parseInt(process.env.PORT ?? "3001", 10)
app.listen(port, "0.0.0.0", () => {
  console.log(`Gize backend running on port ${port}`)
})
