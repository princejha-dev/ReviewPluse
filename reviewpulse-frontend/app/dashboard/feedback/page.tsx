"use client"

import { useState, useEffect } from "react"

type Feedback = {
  id: number
  text: string
  sentiment: string
  issue: string
  category_type: string
  rating: number | null
  processed: boolean
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/feedback")
      .then((res) => res.json())
      .then((data) => {
        setFeedbacks(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = filter === "all"
    ? feedbacks
    : feedbacks.filter((f) => f.sentiment === filter)

  if (loading) return <div className="p-6">Loading feedback...</div>

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold">Feedback List</h1>
        <p className="text-gray-500 text-sm">
          All uploaded reviews with AI analysis results
        </p>
      </div>

      {/* FILTER */}
      <div className="flex gap-3">
        {["all", "positive", "neutral", "negative"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-white border text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* COUNT */}
      <p className="text-sm text-gray-500">{filtered.length} reviews</p>

      {/* LIST */}
      {filtered.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow text-center text-gray-400">
          No feedback found. Upload a CSV from the home page to get started.
        </div>
      ) : (
        filtered.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow p-5 space-y-3">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  item.sentiment === "positive" ? "bg-green-100 text-green-700" :
                  item.sentiment === "negative" ? "bg-red-100 text-red-700" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {item.sentiment}
                </span>

                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  item.category_type === "strength" ? "bg-green-50 text-green-600" :
                  item.category_type === "issue" ? "bg-red-50 text-red-600" :
                  "bg-yellow-50 text-yellow-600"
                }`}>
                  {item.category_type === "strength" ? "💪 Strength" :
                   item.category_type === "issue" ? "⚠️ Issue" : "📝 Observation"}
                </span>
              </div>

              {item.rating && (
                <span className="text-sm text-gray-400">⭐ {item.rating}/5</span>
              )}
            </div>

            <p className="text-gray-800">{item.text}</p>

            <span className="inline-block text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full capitalize">
              📂 {item.issue.replace("_", " ")}
            </span>

          </div>
        ))
      )}

    </div>
  )
}