"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a CSV file first")
      return
    }
    setUploading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("http://127.0.0.1:8000/api/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.detail || "Upload failed")

      setResult(`✅ ${data.reviews_uploaded} reviews uploaded & processed! Redirecting...`)
      setTimeout(() => router.push("/dashboard"), 2000)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed"
      setError(message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="bg-white">

      {/* HERO */}
      <section className="text-center py-28 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto">

          <span className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium">
            ● AI-Powered Restaurant Feedback Analysis
          </span>

          <h1 className="mt-6 text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
            Understand Your
            <br />
            <span className="text-blue-600">
              Customer Feedback
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Upload your reviews CSV and let AI analyze sentiment, detect issues, and highlight strengths instantly.
          </p>

          <div className="mt-12 pt-6 border-t border-gray-200 flex justify-center gap-8 text-sm text-gray-500">
            <span>🍽️ Restaurant Focused</span>
            <span>🤖 AI-Powered</span>
            <span>⚡ Instant Results</span>
          </div>

        </div>
      </section>

      {/* UPLOAD SECTION */}
      <section id="upload" className="py-20 px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto">

          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Get Started
          </h2>
          <p className="text-gray-600 mb-8 text-center">
            Upload your customer feedback CSV file. We&apos;ll analyze sentiment and categorize into:
            <br />
            <span className="font-medium text-gray-800">Staff · Food Quality · Ambience · Wait Time · Hygiene</span>
          </p>

          <div className="bg-white p-8 rounded-2xl shadow-lg space-y-6">

            {/* File Input */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => {
                  setFile(e.target.files?.[0] || null)
                  setError(null)
                  setResult(null)
                }}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <div className="text-4xl mb-3">📄</div>
                <p className="font-medium text-gray-700">
                  {file ? file.name : "Click to select CSV file"}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Must contain a &quot;review_text&quot; column
                </p>
              </label>
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={uploading || !file}
              className={`w-full py-3 rounded-xl font-medium text-white transition ${
                uploading || !file
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
              }`}
            >
              {uploading ? "⏳ Uploading & Processing..." : "Upload & Analyze →"}
            </button>

            {/* Status Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm">
                {error}
              </div>
            )}
            {result && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-sm">
                {result}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 bg-white text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">

          <div>
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">1</div>
            <h3 className="font-semibold text-gray-900">Upload CSV</h3>
            <p className="text-gray-600 text-sm">Upload your customer feedback CSV file</p>
          </div>

          <div>
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">2</div>
            <h3 className="font-semibold text-gray-900">AI Analyzes</h3>
            <p className="text-gray-600 text-sm">AI processes feedback in batches of 15 — detecting sentiment &amp; categories</p>
          </div>

          <div>
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">3</div>
            <h3 className="font-semibold text-gray-900">View Dashboard</h3>
            <p className="text-gray-600 text-sm">See strengths, issues, alerts, and insights instantly</p>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What You Get</h2>
          <p className="text-gray-600 mb-12">AI-powered insights specifically designed for restaurants</p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-xl shadow-sm bg-white hover:shadow-md transition">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="font-semibold text-gray-900 mb-2">Sentiment Analysis</h3>
              <p className="text-gray-600 text-sm">Positive, negative, neutral — automatically detected</p>
            </div>
            <div className="p-6 border rounded-xl shadow-sm bg-white hover:shadow-md transition">
              <div className="text-3xl mb-4">🚨</div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Alerts</h3>
              <p className="text-gray-600 text-sm">Get notified about negative spikes and repeated complaints</p>
            </div>
            <div className="p-6 border rounded-xl shadow-sm bg-white hover:shadow-md transition">
              <div className="text-3xl mb-4">💪</div>
              <h3 className="font-semibold text-gray-900 mb-2">Strengths & Issues</h3>
              <p className="text-gray-600 text-sm">Know what your restaurant excels at and what needs improvement</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-sm text-gray-500 py-6 border-t bg-white">
        © 2026 ReviewPulse. All rights reserved.
      </footer>

    </main>
  )
}