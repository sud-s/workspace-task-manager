import { redirect } from "next/navigation"
import { createServerSupabase } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: workspaces } = await supabase
    .from("workspaces")
    .select("id")
    .limit(1)

  if (workspaces && workspaces.length > 0) {
    redirect(`/${workspaces[0].id}`)
  }

  redirect("/dashboard")
}
