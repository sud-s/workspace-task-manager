"use client"

import { useState } from "react"
import Link from "next/link"
import { useSupabase } from "@/providers/supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignupPage() {
  const supabase = useSupabase()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    })

    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    window.location.href = "/"
  }

  return (
    <>
      <h2 className="text-xl font-semibold text-zinc-100 mb-1">Create Account</h2>
      <p className="text-sm text-zinc-500 mb-6">Enter your details to get started</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs font-medium text-zinc-400">Name</Label>
          <Input
            id="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            className="border-zinc-800 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/30 focus:ring-emerald-500/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-medium text-zinc-400">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-zinc-800 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/30 focus:ring-emerald-500/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-xs font-medium text-zinc-400">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
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
          {loading ? "Creating account..." : "Create Account"}
        </Button>
        <p className="text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 transition-colors">
            Sign in
          </Link>
        </p>
      </form>
    </>
  )
}
