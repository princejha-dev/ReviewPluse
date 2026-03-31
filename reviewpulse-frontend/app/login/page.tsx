"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"

export default function LoginPage() {
  const [type, setType] = useState<"customer" | "business">("customer")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { login } = useAuth()

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Fill all fields")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await res.json()

      console.log("LOGIN RESPONSE:", data) // 🔥 DEBUG

      // ❌ Handle backend error
      if (!res.ok) {
        alert(data.detail || "Invalid credentials")
        return
      }

      // ❌ Validate response
      if (!data.name || !data.role) {
        alert("Invalid server response")
        return
      }

      // ✅ Save user globally
      login({
        name: data.name,
        role: data.role,
      })

      // ✅ Redirect BASED ON BACKEND (not toggle)
      if (data.role === "business") {
        router.push("/dashboard")
      } else {
        router.push("/restaurants")
      }

    } catch (err) {
      console.error("LOGIN ERROR:", err)
      alert("Backend not running or network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="bg-blue-600 text-white p-2 rounded-lg">📈</div>
          <h1 className="text-xl font-semibold">ReviewPulse</h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-2xl font-semibold text-center">
            Welcome Back
          </h2>

          {/* Toggle (UI only, not used for logic anymore) */}
          <div className="flex bg-gray-100 rounded-full p-1 mt-5">
            <button
              onClick={() => setType("customer")}
              className={`flex-1 py-2 rounded-full ${
                type === "customer"
                  ? "bg-white shadow font-medium"
                  : "text-gray-500"
              }`}
            >
              Customer
            </button>

            <button
              onClick={() => setType("business")}
              className={`flex-1 py-2 rounded-full ${
                type === "business"
                  ? "bg-white shadow font-medium"
                  : "text-gray-500"
              }`}
            >
              Business Owner
            </button>
          </div>

          {/* Form */}
          <div className="mt-6 space-y-4">

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </div>

          {/* Signup */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>

        </div>
      </div>
    </main>
  )
}