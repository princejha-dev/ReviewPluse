"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!user) {
      router.replace("/login")
    }
  }, [user, router])

  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8ff]">
        <div className="animate-spin h-8 w-8 border-4 border-[#1e3a8a] rounded-full border-t-transparent"></div>
      </div>
    )
  }

  return <>{children}</>
}
