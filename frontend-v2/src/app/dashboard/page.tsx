"use client"

import { useEffect, useState } from "react"
import { ShieldAlert, Info, Download, Target, Zap } from "lucide-react"
import SentimentTrendChart from "@/components/charts/SentimentTrendChart"
import SentimentChart from "@/components/charts/SentimentChart"
import IssueChart from "@/components/charts/IssueChart"

type Summary = {
  summary: {
    total_reviews: number
    average_rating: number
    sentiment: {
       positive: { count: number, percentage: number }
       negative: { count: number, percentage: number }
       neutral: { count: number, percentage: number }
    }
    top_issues: Record<string, { count: number, percentage: number, avg_rating: number }>
  }
  insights: {
    assessment: string
    improvements: string[]
    recommendations: string[]
    strengths: string[]
  }
}

type Alert = {
  type: string
  severity: string
  message: string
  details?: any
}

export default function DashboardPage() {
  const [data, setData] = useState<Summary | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("http://127.0.0.1:8000/api/insights").then((r) => r.json()),
      fetch("http://127.0.0.1:8000/api/alerts").then((r) => r.json()),
    ])
      .then(([insightsData, alertsData]) => {
        if(insightsData.success) {
           setData(insightsData)
        }
        if(alertsData.alerts) {
           setAlerts(alertsData.alerts)
        }
        setLoading(false)
      })
      .catch((e) => {
        console.error("Dashboard failed to load:", e)
        setLoading(false)
      })
  }, [])

  if (loading) return (
     <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-[#1e3a8a] rounded-full border-t-transparent"></div>
     </div>
  )

  if (!data) return (
     <div className="bg-[#ffdad6] text-[#93000a] p-6 rounded-xl flex items-center gap-3 w-full">
       <ShieldAlert /> No analysis data found. Navigate to "Upload Data" to process reviews.
     </div>
  )

  // Parse mapped data
  const { summary, insights } = data
  const positive = summary.sentiment.positive.count
  const neutral = summary.sentiment.neutral.count
  const negative = summary.sentiment.negative.count

  const topIssueKey = Object.keys(summary.top_issues)[0]
  const topIssue = topIssueKey ? topIssueKey.replace("_", " ") : "None Detected"

  const topStrength = insights.strengths[0] || "None Detected"

  const sentimentData = [
    { name: "Positive", value: positive, color: "#10b981" },
    { name: "Neutral", value: neutral, color: "#f59e0b" },
    { name: "Negative", value: negative, color: "#ef4444" },
  ]

  const issueData = Object.entries(summary.top_issues).map(([key, val]) => ({
    name: key,
    value: val.count
  }))

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[#1a1b21] tracking-tight">Executive Dashboard</h1>
          <p className="text-[#444651] mt-1">Real-time analytical overview of customer sentiment.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#f4f3fa] text-[#1e3a8a] border border-[#e3e1e9] hover:bg-[#e9e7ef] px-4 py-2 rounded-lg font-medium transition-colors">
          <Download size={16} /> Export Report
        </button>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#e3e1e9]">
          <p className="text-[#757682] text-xs font-semibold uppercase tracking-wider">Total Reviews</p>
          <h2 className="text-3xl font-extrabold mt-2 text-[#1a1b21]">{summary.total_reviews}</h2>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#e3e1e9]">
          <p className="text-[#757682] text-xs font-semibold uppercase tracking-wider">Average Rating</p>
          <h2 className="text-3xl font-extrabold mt-2 text-[#1a1b21]">{summary.average_rating}<span className="text-base font-normal text-gray-400">/5</span></h2>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#e3e1e9]">
          <p className="text-[#757682] text-xs font-semibold uppercase tracking-wider">Negative Ratio</p>
          <h2 className="text-3xl font-extrabold mt-2 text-[#ef4444]">{summary.sentiment.negative.percentage.toFixed(1)}%</h2>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#e3e1e9]">
          <p className="text-[#757682] text-xs font-semibold uppercase tracking-wider">Top Issue Area</p>
          <h2 className="text-lg font-bold mt-2 text-[#1a1b21] capitalize flex items-center gap-2">
             <Target size={18} className="text-[#f59e0b]"/> {topIssue}
          </h2>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#e3e1e9]">
          <p className="text-[#757682] text-xs font-semibold uppercase tracking-wider">Core Strength</p>
          <h2 className="text-lg font-bold mt-2 text-[#1a1b21] capitalize leading-tight">
             {topStrength}
          </h2>
        </div>
      </div>

      {/* BIG GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHARTS */}
        <div className="lg:col-span-2 space-y-6">
           {/* Top 2 charts */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#e3e1e9] h-[320px] flex flex-col">
                <h3 className="font-bold text-[#1a1b21] mb-4">Sentiment Distribution</h3>
                <div className="flex-1 min-h-0">
                  <SentimentChart data={sentimentData} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#e3e1e9] h-[320px] flex flex-col">
                <h3 className="font-bold text-[#1a1b21] mb-4">Issue Concentration</h3>
                <div className="flex-1 min-h-0">
                  <IssueChart data={issueData} />
                </div>
              </div>
           </div>
           
           {/* Trend Line */}
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#e3e1e9] h-[350px] flex flex-col">
              <div className="mb-4">
                 <h3 className="font-bold text-[#1a1b21]">7-Day Sentiment Forecast</h3>
                 <p className="text-xs text-[#757682]">Volume of sentiment categories over the last 7 trailing days.</p>
              </div>
              <div className="flex-1 min-h-0">
                 <SentimentTrendChart />
              </div>
           </div>
        </div>

        {/* FEED / ALERTS & AI */}
        <div className="space-y-6">
           
           {/* ALERTS */}
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#e3e1e9]">
              <h3 className="font-bold text-[#1a1b21] mb-4 flex items-center gap-2">
                 <ShieldAlert size={18} className="text-[#ef4444]" /> Critical Alerts
              </h3>
              {alerts.length === 0 ? (
                 <p className="text-sm text-[#757682] bg-[#f4f3fa] p-3 rounded-lg text-center">All systems healthy. No anomalies detected.</p>
              ) : (
                 <div className="space-y-3">
                   {alerts.map((alert, i) => (
                      <div key={i} className={`p-4 rounded-xl border-l-4 ${alert.severity === 'HIGH' ? 'border-[#ef4444] bg-[#ffdad6]' : 'border-[#f59e0b] bg-[#fff8e1]'}`}>
                         <h4 className={`font-semibold text-sm ${alert.severity === 'HIGH' ? 'text-[#93000a]' : 'text-[#b45309]'}`}>{alert.type.replace(/_/g, " ")}</h4>
                         <p className="text-xs mt-1 text-gray-800">{alert.message}</p>
                      </div>
                   ))}
                 </div>
              )}
           </div>

           {/* AI INSIGHTS */}
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#1e3a8a] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Zap size={64} className="text-[#1e3a8a]"/>
              </div>
              <h3 className="font-bold text-[#1e3a8a] mb-4 relative z-10 flex items-center gap-2">
                 🧠 AI Assessment
              </h3>
              <p className="text-sm font-medium text-[#1a1b21] italic mb-6 relative z-10">"{insights.assessment}"</p>
              
              <div className="space-y-4 relative z-10">
                 <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#10b981] mb-2">Strengths</h5>
                    <ul className="text-sm text-[#444651] space-y-1 list-disc list-inside">
                       {insights.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                 </div>
                 <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#ef4444] mb-2">Areas to Improve</h5>
                    <ul className="text-sm text-[#444651] space-y-1 list-disc list-inside">
                       {insights.improvements.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                 </div>
                 <div className="bg-[#f4f3fa] p-3 rounded-xl">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#1e3a8a] mb-2">Action Items</h5>
                    <ul className="text-sm text-[#1e3a8a] space-y-1 list-disc list-inside">
                       {insights.recommendations.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                 </div>
              </div>
           </div>

        </div>

      </div>
    </div>
  )
}
