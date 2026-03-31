"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [type, setType] = useState<"customer" | "business">("customer")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("Fill all fields")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: type, // 🔥 VERY IMPORTANT
        }),
      })

      const data = await res.json()

      console.log("SIGNUP RESPONSE:", data)

      if (!res.ok) {
        alert(data.detail || "Signup failed")
        return
      }

      alert("Signup successful")

      router.push("/login")

    } catch (err) {
      console.error(err)
      alert("Backend not running")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow">

        <h2 className="text-2xl font-semibold text-center mb-4">
          Create Account
        </h2>

        {/* Toggle */}
        <div className="flex bg-gray-100 rounded-full p-1 mb-4">
          <button
            onClick={() => setType("customer")}
            className={`flex-1 py-2 rounded-full ${
              type === "customer" ? "bg-white shadow" : ""
            }`}
          >
            Customer
          </button>

          <button
            onClick={() => setType("business")}
            className={`flex-1 py-2 rounded-full ${
              type === "business" ? "bg-white shadow" : ""
            }`}
          >
            Business
          </button>
        </div>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

        </div>
      </div>
    </main>
  )
}