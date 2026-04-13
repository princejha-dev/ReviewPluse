"use client"

import { useEffect, useState } from "react"
import { ShieldAlert, Download, Target } from "lucide-react"
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
    strengths: string[]
    improvements: string[]
  }
}

export default function DashboardPage() {
  const [data, setData] = useState<Summary | null>(null)
  const [trendData, setTrendData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/insights`).then((r) => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sentiment-trend`).then((r) => r.json()),
    ])
      .then(([insightsData, trendResponse]) => {
        if (insightsData.success) {
          setData(insightsData)
        }
        if (trendResponse.trend) {
          setTrendData(trendResponse.trend)
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

  const topIssue = insights.improvements[0] || "None Detected"
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
          <p className="text-[#757682] text-xs font-semibold uppercase tracking-wider">Core Issue Area</p>
          <h2 className="text-lg font-bold mt-2 text-[#1a1b21] capitalize flex items-center gap-2">
            <Target size={18} className="text-[#ef4444]" /> {topIssue}
          </h2>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#e3e1e9]">
          <p className="text-[#757682] text-xs font-semibold uppercase tracking-wider">Core Strength</p>
          <h2 className="text-lg font-bold mt-2 text-[#1a1b21] capitalize leading-tight">
            {topStrength}
          </h2>
        </div>
      </div>

      {/* CHARTS */}
      <div className="space-y-6">
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
            <SentimentTrendChart data={trendData} />
          </div>
        </div>
      </div>
    </div>
  )
}
