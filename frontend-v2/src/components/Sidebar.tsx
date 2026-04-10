"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, UploadCloud, MessageSquareText, Bell, Settings, User } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { name: "Overview", path: "/dashboard", icon: <BarChart3 size={20} /> },
    { name: "Upload Data", path: "/dashboard/upload", icon: <UploadCloud size={20} /> },
    { name: "Feedback", path: "/dashboard/feedback", icon: <MessageSquareText size={20} /> },
    { name: "Alerts", path: "/dashboard/alerts", icon: <Bell size={20} /> },
    { name: "Restaurant Profile", path: "/dashboard/profile", icon: <User size={20} /> },
    { name: "Settings", path: "/dashboard/settings", icon: <Settings size={20} /> },
  ]

  return (
    <aside className="w-64 bg-white border-r border-[#e3e1e9] flex flex-col justify-between sticky top-[68px] h-[calc(100vh-68px)] z-40">
      <div className="p-6">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive
                    ? "bg-[#f4f3fa] text-[#1e3a8a] shadow-sm"
                    : "text-[#757682] hover:bg-[#faf8ff] hover:text-[#1a1b21]"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-6">
        <div className="bg-gradient-to-br from-[#1e3a8a] to-[#2c52c2] text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-white opacity-10 blur-xl"></div>
          <p className="font-bold mb-1 text-sm">Need Help?</p>
          <p className="text-xs text-[#b6c4ff] mb-4">Contact our support team for AI tuning insights.</p>
          <button className="w-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold py-2 rounded-lg transition-colors">
            Support Chat
          </button>
        </div>
      </div>
    </aside>
  )
}
