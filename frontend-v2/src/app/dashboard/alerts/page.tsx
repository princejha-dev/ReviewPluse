"use client"

import { useEffect, useState } from "react"
import { ShieldAlert } from "lucide-react"

type Alert = {
   type: string
   severity: string
   message: string
   details?: any
}

export default function AlertsPage() {
   const [alerts, setAlerts] = useState<Alert[]>([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alerts`)
         .then((r) => r.json())
         .then((data) => {
            if (data.alerts) setAlerts(data.alerts)
            setLoading(false)
         })
         .catch((e) => {
            console.error("Alerts failed to load:", e)
            setLoading(false)
         })
   }, [])

   if (loading) return (
      <div className="flex items-center justify-center h-64">
         <div className="animate-spin h-8 w-8 border-4 border-[#1e3a8a] rounded-full border-t-transparent"></div>
      </div>
   )

   return (
      <div className="max-w-4xl space-y-6">
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1a1b21] flex items-center gap-2 tracking-tight">
               <ShieldAlert className="text-[#ef4444]" /> Critical Alerts
            </h1>
            <p className="text-[#444651] mt-2">Anomaly detection and urgent focus areas.</p>
         </div>

         <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e3e1e9]">
            {alerts.length === 0 ? (
               <p className="text-[#757682] bg-[#f4f3fa] p-6 rounded-xl text-center">All systems healthy. No anomalies detected.</p>
            ) : (
               <div className="space-y-4">
                  {alerts.map((alert, i) => (
                     <div key={i} className={`p-6 rounded-xl border-l-4 ${alert.severity === 'HIGH' ? 'border-[#ef4444] bg-[#ffdad6]' : 'border-[#f59e0b] bg-[#fff8e1]'}`}>
                        <div className="flex items-start justify-between">
                           <div>
                              <h4 className={`font-bold text-lg ${alert.severity === 'HIGH' ? 'text-[#93000a]' : 'text-[#b45309]'}`}>{alert.type.replace(/_/g, " ").toUpperCase()}</h4>
                              <p className="mt-2 text-gray-800 leading-relaxed">{alert.message}</p>
                           </div>
                           <span className={`text-xs font-bold px-3 py-1 rounded-full ${alert.severity === 'HIGH' ? 'bg-[#93000a] text-white' : 'bg-[#b45309] text-white'}`}>
                              {alert.severity}
                           </span>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>
   )
}
