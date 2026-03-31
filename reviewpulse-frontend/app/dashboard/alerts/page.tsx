"use client"

import { useEffect, useState } from "react"

type Alert = {
  type: string
  title: string
  message: string
  color: string
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/alerts")
      .then((res) => res.json())
      .then((data) => {
        setAlerts(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-6">Loading alerts...</div>

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-semibold">🚨 Alerts</h1>
        <p className="text-gray-500 text-sm">
          Real-time alerts based on your feedback analysis
        </p>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow text-center text-gray-400">
          No alerts at this time.
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert, idx) => {
            const borderColor = alert.color === "red" ? "border-red-500" :
              alert.color === "orange" ? "border-orange-500" :
              alert.color === "green" ? "border-green-500" : "border-blue-500"
            const bgColor = alert.color === "red" ? "bg-red-50" :
              alert.color === "orange" ? "bg-orange-50" :
              alert.color === "green" ? "bg-green-50" : "bg-blue-50"
            const textColor = alert.color === "red" ? "text-red-600" :
              alert.color === "orange" ? "text-orange-600" :
              alert.color === "green" ? "text-green-600" : "text-blue-600"
            const typeLabel = alert.type === "critical" ? "CRITICAL" :
              alert.type === "warning" ? "WARNING" :
              alert.type === "success" ? "POSITIVE" : "INFO"

            return (
              <div key={idx} className={`border-l-4 ${borderColor} ${bgColor} p-6 rounded-xl shadow-sm`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`font-semibold text-lg ${textColor}`}>
                    {alert.title}
                  </p>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${bgColor} ${textColor}`}>
                    {typeLabel}
                  </span>
                </div>
                <p className="text-gray-600">{alert.message}</p>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}
