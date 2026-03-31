"use client"

import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { useState, useEffect } from "react"

export default function Navbar() {
  const { user, logout } = useAuth()
  const [mounted, setMounted] = useState(false)

  // 🔥 FIX hydration issue
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white border-b">

      {/* LOGO */}
      <Link href="/" className="text-xl font-bold text-blue-600">
        ReviewPulse
      </Link>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">

        {!user ? (
          <>
            <Link href="/login" className="text-gray-600 hover:text-black">
              Login
            </Link>

            <Link
              href="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <span className="text-gray-700 font-medium">
              {user.name}
            </span>

            {/* BUSINESS ONLY */}
            {user.role === "business" && (
              <Link
                href="/dashboard"
                className="text-blue-600 font-medium"
              >
                Dashboard
              </Link>
            )}

            <button
              onClick={logout}
              className="text-red-500 font-medium"
            >
              Logout
            </button>
          </>
        )}

      </div>
    </header>
  )
}