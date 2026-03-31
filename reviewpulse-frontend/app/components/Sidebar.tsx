"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (route: string) => pathname === route

  const baseClass =
    "flex items-center gap-2 px-4 py-2 rounded-lg transition cursor-pointer"

  return (
    <aside className="w-64 bg-white border-r p-5 flex flex-col justify-between sticky top-0 h-screen z-50">

      {/* TOP */}
      <div>
        <h1 className="text-xl font-bold mb-6 flex items-center gap-2">
          📈 ReviewPulse
        </h1>

        <nav className="space-y-2">

          <Link href="/dashboard" className={`${baseClass} ${
            isActive("/dashboard") ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}>
            📊 Dashboard
          </Link>

          <Link href="/dashboard/feedback" className={`${baseClass} ${
            isActive("/dashboard/feedback") ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}>
            💬 Feedback List
          </Link>

          <Link href="/dashboard/insights" className={`${baseClass} ${
            isActive("/dashboard/insights") ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}>
            📈 Insights
          </Link>

          <Link href="/dashboard/alerts" className={`${baseClass} ${
            isActive("/dashboard/alerts") ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}>
            🚨 Alerts
          </Link>

          <Link href="/dashboard/profile" className={`${baseClass} ${
            isActive("/dashboard/profile") ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}>
            🏪 My Restaurant
          </Link>

          <Link href="/dashboard/settings" className={`${baseClass} ${
            isActive("/dashboard/settings") ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}>
            ⚙️ Settings
          </Link>

        </nav>
      </div>

      {/* BOTTOM */}
      <div className="bg-blue-600 text-white p-4 rounded-xl">
        <p className="font-semibold">Upload Feedback</p>
        <p className="text-sm mt-1">Analyze new reviews</p>
        <Link href="/#upload">
          <button className="bg-white text-blue-600 mt-3 px-3 py-1 rounded hover:bg-gray-100 transition">
            Upload CSV →
          </button>
        </Link>
      </div>

    </aside>
  )
}