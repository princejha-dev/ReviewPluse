"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const linkClass = (path: string) =>
    `block px-4 py-2 rounded-lg transition ${
      pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-600 hover:bg-gray-100"
    }`

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r p-5">

        <h1 className="text-lg font-bold mb-6">📈 ReviewPulse</h1>

        <nav className="space-y-2">
          <Link href="/dashboard" className={linkClass("/dashboard")}>
            📊 Dashboard
          </Link>

          <Link href="/dashboard/feedback" className={linkClass("/dashboard/feedback")}>
            💬 Feedback List
          </Link>

          <Link href="/dashboard/insights" className={linkClass("/dashboard/insights")}>
            📈 Insights
          </Link>

          <Link href="/dashboard/alerts" className={linkClass("/dashboard/alerts")}>
            🚨 Alerts
          </Link>

          <Link href="/dashboard/profile" className={linkClass("/dashboard/profile")}>
            🏪 My Restaurant
          </Link>

          <Link href="/dashboard/settings" className={linkClass("/dashboard/settings")}>
            ⚙️ Settings
          </Link>
        </nav>

        {/* UPLOAD LINK */}
        <div className="mt-10 bg-blue-600 text-white p-4 rounded-xl">
          <p className="font-semibold">Upload More Feedback</p>
          <p className="text-sm mt-1">Analyze new reviews</p>
          <Link href="/#upload">
            <button className="mt-3 bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 transition">
              Upload CSV →
            </button>
          </Link>
        </div>

      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-6">
        {children}
      </main>

    </div>
  )
}