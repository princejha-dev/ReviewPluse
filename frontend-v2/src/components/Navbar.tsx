"use client"

import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { useState, useEffect } from "react"

export default function Navbar() {
  const { user, logout } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
      {/* LOGO */}
      <Link href="/" className="text-2xl font-bold text-[#1e3a8a] tracking-tight">
        🌊 ReviewPulse
      </Link>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">
        {!user ? (
          <>
            <Link href="/login" className="text-gray-600 hover:text-[#1e3a8a] font-medium transition-colors">
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-gradient-to-r from-[#1e3a8a] to-[#2c52c2] text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all font-medium"
            >
              Sign Up Let's Go
            </Link>
          </>
        ) : (
          <>
            <div className="flex flex-col text-right">
              <span className="text-gray-900 font-semibold text-sm">
                {user.name}
              </span>
              <span className="text-gray-500 text-xs uppercase tracking-wider">
                {user.role}
              </span>
            </div>

            {user.role === "business" && (
              <Link
                href="/dashboard"
                className="bg-[#f4f3fa] text-[#1e3a8a] px-4 py-2 rounded-lg font-medium hover:bg-[#e9e7ef] transition-colors"
              >
                Dashboard
              </Link>
            )}

            <button
              onClick={logout}
              className="text-red-500 font-medium hover:text-red-700 transition-colors"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  )
}
