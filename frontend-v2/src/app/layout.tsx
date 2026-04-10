"use client"

import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { AuthProvider } from "@/context/AuthContext"
import { usePathname } from "next/navigation"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const isDashboard = pathname ? pathname.startsWith("/dashboard") : false

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          {!isDashboard && <Footer />}
        </AuthProvider>
      </body>
    </html>
  )
}
