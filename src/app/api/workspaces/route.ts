import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"
import { createAdminSupabase } from "@/lib/supabase/admin"

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "No session" }, { status: 401 })
    }

    const { name } = await request.json()
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "name is required" }, { status: 400 })
    }

    const admin = createAdminSupabase()
    await admin.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    })

    const { data: workspace, error: wsError } = await admin
      .from("workspaces")
      .insert({ name })
      .select("*")
      .single()

    if (wsError) {
      return NextResponse.json({ error: wsError.message }, { status: 500 })
    }

    return NextResponse.json({ workspace })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    )
  }
}
