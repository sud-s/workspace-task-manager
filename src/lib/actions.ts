"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerSupabase, createAdminSupabase } from "./supabase/server"

export interface SignInResult {
  error: string | null
}

export interface SignUpResult {
  error: string | null
  success: boolean
}

export interface SignOutResult {
  error: string | null
}

export async function signInAction(formData: FormData): Promise<SignInResult> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const supabase = await createServerSupabase()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) return { error: error.message }

  revalidatePath("/")
  redirect("/")
}

export async function signUpAction(formData: FormData): Promise<SignUpResult> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  if (!email || !password) {
    return { error: "Email and password are required", success: false }
  }

  const supabase = await createServerSupabase()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  })

  if (error) return { error: error.message, success: false }

  revalidatePath("/")
  redirect("/")
}

export async function signOutAction(): Promise<SignOutResult> {
  const supabase = await createServerSupabase()

  const { error } = await supabase.auth.signOut()

  if (error) return { error: error.message }

  revalidatePath("/login")
  redirect("/login")
}

export async function resetPasswordAction(
  formData: FormData,
): Promise<{ error: string | null; success: boolean }> {
  const email = formData.get("email") as string

  if (!email) {
    return { error: "Email is required", success: false }
  }

  const supabase = await createServerSupabase()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
  })

  if (error) return { error: error.message, success: false }

  return { error: null, success: true }
}

export async function updatePasswordAction(
  formData: FormData,
): Promise<{ error: string | null; success: boolean }> {
  const password = formData.get("password") as string

  if (!password || password.length < 6) {
    return { error: "Password must be at least 6 characters", success: false }
  }

  const supabase = await createServerSupabase()

  const { error } = await supabase.auth.updateUser({ password })

  if (error) return { error: error.message, success: false }

  return { error: null, success: true }
}

export async function updateProfileAction(
  formData: FormData,
): Promise<{ error: string | null; success: boolean }> {
  const name = formData.get("name") as string

  if (!name || !name.trim()) {
    return { error: "Name is required", success: false }
  }

  const supabase = await createServerSupabase()

  const { error } = await supabase.auth.updateUser({
    data: { name: name.trim() },
  })

  if (error) return { error: error.message, success: false }

  revalidatePath("/profile")
  return { error: null, success: true }
}

export async function getUsersByIdsAction(
  userIds: string[],
): Promise<{ id: string; email: string }[]> {
  const admin = await createAdminSupabase()

  const users: { id: string; email: string }[] = []
  for (const userId of userIds) {
    const { data } = await admin.auth.admin.getUserById(userId)
    if (data?.user) {
      users.push({ id: data.user.id, email: data.user.email ?? "" })
    }
  }

  return users
}

export async function inviteMemberByEmailAction(
  workspaceId: string,
  email: string,
  role: string,
): Promise<{ error: string | null }> {
  const admin = await createAdminSupabase()

  const { data: userList, error: lookupError } =
    await admin.auth.admin.listUsers()

  if (lookupError) return { error: lookupError.message }

  const foundUser = userList.users.find((u) => u.email === email)
  if (!foundUser) {
    return { error: "No user found with that email address" }
  }

  const { error } = await admin
    .from("workspace_members")
    .insert({
      workspace_id: workspaceId,
      user_id: foundUser.id,
      role: role as "owner" | "member",
    })

  if (error) return { error: error.message }

  return { error: null }
}
