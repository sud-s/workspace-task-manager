"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerSupabase } from "./supabase/server"

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
