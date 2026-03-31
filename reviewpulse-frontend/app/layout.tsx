"use client"

import "./globals.css"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import { AuthProvider } from "@/context/AuthContext"
import { usePathname } from "next/navigation"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // ✅ detect dashboard pages
  const isDashboard = pathname.startsWith("/dashboard")

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">

        <AuthProvider>

          {/* NAVBAR */}
          <Navbar />

          {/* MAIN */}
          <main className="flex-1">
            {children}
          </main>

          {/* ❌ HIDE FOOTER IN DASHBOARD */}
          {!isDashboard && <Footer />}

        </AuthProvider>

      </body>
    </html>
  )
}