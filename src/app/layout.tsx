import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { QueryProvider } from "@/providers/query-provider"
import { SupabaseProvider } from "@/providers/supabase-provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Gize — Time is everything",
    template: "%s — Gize",
  },
  description:
    "Multi-workspace task management app. Organize projects, track tasks in real-time, and keep your team aligned.",
  keywords: [
    "task management",
    "project management",
    "workspace",
    "productivity",
    "team collaboration",
  ],
  openGraph: {
    title: "Gize — Time is everything",
    description:
      "Multi-workspace task management app. Organize projects, track tasks in real-time, and keep your team aligned.",
    type: "website",
    siteName: "Gize",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">
        <QueryProvider>
          <SupabaseProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "hsl(240 10% 6%)",
                  border: "1px solid hsl(240 4% 16%)",
                  color: "hsl(0 0% 98%)",
                },
              }}
            />
          </SupabaseProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
