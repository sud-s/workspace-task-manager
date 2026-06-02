"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useSupabase } from "@/providers/supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const supabase = useSupabase()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const resetSuccess = searchParams.get("reset") === "success"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (signInError) {
      setLoading(false)
      setError(signInError.message)
      return
    }

    setLoading(false)
    window.location.href = "/"
  }

  return (
    <>
      <h2 className="text-xl font-semibold text-zinc-100 mb-1">Welcome back</h2>
      <p className="text-sm text-zinc-500 mb-6">Enter your credentials to sign in</p>
      {resetSuccess && (
        <div className="mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-400">
          Password updated successfully. Sign in with your new password.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-medium text-zinc-400">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            className="border-zinc-800 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/30 focus:ring-emerald-500/20"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-medium text-zinc-400">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-zinc-500 hover:text-emerald-400 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-zinc-800 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/30 focus:ring-emerald-500/20"
          />
        </div>
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
        <Button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
        <p className="text-center text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 transition-colors">
            Sign up
          </Link>
        </p>
      </form>
    </>
  )
}
