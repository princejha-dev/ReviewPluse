"use client"

import { useEffect, useState } from "react"
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend,
} from "recharts"

type IssueItem = { name: string; count: number; percentage: number }
type KPIs = { total_processed: number; issues_found: number; strengths_found: number; negative_rate: number; positive_rate: number }
type InsightsData = { issue_breakdown: IssueItem[]; strength_breakdown: IssueItem[]; kpis: KPIs }
type TrendPoint = { name: string; positive: number; neutral: number; negative: number }

export default function InsightsPage() {
  const [insights, setInsights] = useState<InsightsData | null>(null)
  const [trend, setTrend] = useState<TrendPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("http://127.0.0.1:8000/api/insights").then((r) => r.json()),
      fetch("http://127.0.0.1:8000/api/trend").then((r) => r.json()),
    ])
      .then(([insightsData, trendData]) => {
        setInsights(insightsData)
        setTrend(trendData)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-6">Loading insights...</div>
  if (!insights) return <div className="p-6 text-red-500">Failed to load insights</div>

  const { issue_breakdown, strength_breakdown, kpis } = insights

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-semibold">📈 Insights</h1>
        <p className="text-gray-500">Deep analysis of your restaurant feedback</p>
      </div>

      {/* SENTIMENT TREND */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-2">Sentiment Trend</h2>
        <p className="text-sm text-gray-500 mb-4">How customer sentiment has evolved</p>
        <div className="h-64">
          {trend.length > 0 ? (
            <ResponsiveContainer>
              <LineChart data={trend}>
                <XAxis dataKey="name" /><YAxis /><Tooltip /><Legend />
                <Line type="monotone" dataKey="positive" stroke="#16a34a" strokeWidth={2} />
                <Line type="monotone" dataKey="neutral" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="negative" stroke="#dc2626" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm">No trend data yet.</p>}
        </div>
      </div>

      {/* ISSUES vs STRENGTHS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ISSUES */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-2 text-red-600">⚠️ Issues (Negative Feedback)</h2>
          <div className="h-64">
            {issue_breakdown.length > 0 ? (
              <ResponsiveContainer>
                <BarChart data={issue_breakdown}>
                  <XAxis dataKey="name" /><YAxis /><Tooltip /><Legend />
                  <Bar dataKey="count" fill="#dc2626" name="Complaints" />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-gray-400 text-sm">No issues detected — great!</p>}
          </div>
        </div>

        {/* STRENGTHS */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-2 text-green-600">💪 Strengths (Positive Feedback)</h2>
          <div className="h-64">
            {strength_breakdown.length > 0 ? (
              <ResponsiveContainer>
                <BarChart data={strength_breakdown}>
                  <XAxis dataKey="name" /><YAxis /><Tooltip /><Legend />
                  <Bar dataKey="count" fill="#16a34a" name="Praises" />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-gray-400 text-sm">No strengths detected yet.</p>}
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-blue-600 text-white p-6 rounded-xl shadow">
          <p className="text-3xl font-bold">{kpis.total_processed}</p>
          <p className="text-sm mt-1">Total Analyzed</p>
        </div>
        <div className="bg-green-600 text-white p-6 rounded-xl shadow">
          <p className="text-3xl font-bold">{kpis.positive_rate}%</p>
          <p className="text-sm mt-1">Positive Rate</p>
        </div>
        <div className="bg-red-500 text-white p-6 rounded-xl shadow">
          <p className="text-3xl font-bold">{kpis.negative_rate}%</p>
          <p className="text-sm mt-1">Negative Rate</p>
        </div>
        <div className="bg-orange-500 text-white p-6 rounded-xl shadow">
          <p className="text-3xl font-bold">{kpis.issues_found} / {kpis.strengths_found}</p>
          <p className="text-sm mt-1">Issues / Strengths</p>
        </div>
      </div>

    </div>
  )
}