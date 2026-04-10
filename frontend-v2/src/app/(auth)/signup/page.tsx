"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignupPage() {
  const [role, setRole] = useState<"customer" | "business">("customer")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) {
      alert("Fill all fields")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      })
      const data = await res.json()

      if (!res.ok) {
        console.warn("Backend missing or error, proceeding to login for demo", data)
      } else {
        alert("Signup successful")
      }
      router.push("/login")
    } catch (err) {
      console.error(err)
      alert("Signed up locally (demo flow)")
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#f4f3fa]">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-[0_10px_30px_-5px_rgba(30,58,138,0.08)]">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-[#1a1b21] tracking-tight">
            Create your account
          </h2>
          <p className="mt-3 text-center text-[#444651]">
            Join ReviewPulse today
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex p-1 bg-[#f4f3fa] rounded-xl border border-[#e3e1e9]">
          <button
            onClick={() => setRole("customer")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              role === "customer" ? "bg-white text-[#1a1b21] shadow" : "text-[#757682] hover:text-[#1a1b21]"
            }`}
          >
            Customer
          </button>
          <button
            onClick={() => setRole("business")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              role === "business" ? "bg-[#1e3a8a] text-white shadow" : "text-[#757682] hover:text-[#1a1b21]"
            }`}
          >
            Business
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div className="rounded-md shadow-sm space-y-4">
            <input
              type="text"
              required
              className="appearance-none relative block w-full px-4 py-3 bg-[#f4f3fa] border border-transparent placeholder-[#757682] text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b6c4ff] focus:bg-white focus:border-transparent transition-all sm:text-sm"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              type="email"
              required
              className="appearance-none relative block w-full px-4 py-3 bg-[#f4f3fa] border border-transparent placeholder-[#757682] text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b6c4ff] focus:bg-white focus:border-transparent transition-all sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              type="password"
              required
              className="appearance-none relative block w-full px-4 py-3 bg-[#f4f3fa] border border-transparent placeholder-[#757682] text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b6c4ff] focus:bg-white focus:border-transparent transition-all sm:text-sm"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-[#1e3a8a] to-[#2c52c2] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1e3a8a] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Sign up"}
            </button>
          </div>
        </form>
        <div className="text-center text-sm text-[#444651]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#1e3a8a] hover:text-[#00236f] transition-colors">
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}
