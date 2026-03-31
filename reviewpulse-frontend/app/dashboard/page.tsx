"use client"

import { useEffect, useState } from "react"
import SentimentTrendChart from "@/app/components/charts/SentimentTrendChart"
import SentimentChart from "@/app/components/charts/SentimentChart"
import IssueChart from "@/app/components/charts/IssueChart"

type Summary = {
  total: number
  total_processed: number
  positive: number
  neutral: number
  negative: number
  issues: Record<string, number>
  strengths: Record<string, number>
}

type Alert = {
  type: string
  title: string
  message: string
  color: string
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("http://127.0.0.1:8000/api/summary").then((r) => r.json()),
      fetch("http://127.0.0.1:8000/api/alerts").then((r) => r.json()),
    ])
      .then(([summaryData, alertsData]) => {
        setSummary(summaryData)
        setAlerts(alertsData)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-6">Loading dashboard...</div>
  if (!summary) return <div className="p-6 text-red-500">Failed to load data. Is the backend running?</div>

  const { total, total_processed, positive, neutral, negative, issues, strengths } = summary
  const positivePercent = total_processed ? Math.round((positive / total_processed) * 100) : 0
  const negativePercent = total_processed ? Math.round((negative / total_processed) * 100) : 0

  const topIssue = issues && Object.keys(issues).length > 0
    ? Object.keys(issues).reduce((a, b) => issues[a] > issues[b] ? a : b).replace("_", " ")
    : "None"

  const topStrength = strengths && Object.keys(strengths).length > 0
    ? Object.keys(strengths).reduce((a, b) => strengths[a] > strengths[b] ? a : b).replace("_", " ")
    : "None"

  // Chart data
  const sentimentData = [
    { name: "Positive", value: positive || 0, color: "#16a34a" },
    { name: "Neutral", value: neutral || 0, color: "#f59e0b" },
    { name: "Negative", value: negative || 0, color: "#dc2626" },
  ]

  const issueData = issues && Object.keys(issues).length > 0
    ? Object.entries(issues).map(([key, value]) => ({ name: key.replace("_", " "), value: Number(value) || 0 }))
    : []

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">AI-powered analysis of your restaurant feedback</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Total Feedback</p>
          <h2 className="text-3xl font-bold mt-2">{total}</h2>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Positive</p>
          <h2 className="text-3xl font-bold mt-2 text-green-600">{positivePercent}%</h2>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Negative</p>
          <h2 className="text-3xl font-bold mt-2 text-red-500">{negativePercent}%</h2>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Top Issue</p>
          <h2 className="text-xl font-semibold mt-2 capitalize text-red-600">🔴 {topIssue}</h2>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Top Strength</p>
          <h2 className="text-xl font-semibold mt-2 capitalize text-green-600">💪 {topStrength}</h2>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm h-[350px]">
          <h2 className="text-lg font-semibold mb-4">Sentiment Overview</h2>
          <SentimentChart data={sentimentData} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm h-[350px]">
          <h2 className="text-lg font-semibold mb-4">Issues Breakdown</h2>
          <IssueChart data={issueData} />
        </div>
      </div>

      {/* TREND */}
      <div className="bg-white p-6 rounded-xl shadow-sm h-[400px]">
        <h2 className="text-lg font-semibold mb-1">Sentiment Trend</h2>
        <p className="text-gray-500 text-sm mb-4">Track how customer sentiment has changed</p>
        <SentimentTrendChart />
      </div>

      {/* ALERTS */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Recent Alerts</h2>
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
            return (
              <div key={idx} className={`border-l-4 ${borderColor} ${bgColor} p-4 rounded-lg`}>
                <p className={`font-medium ${textColor}`}>{alert.title}</p>
                <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}