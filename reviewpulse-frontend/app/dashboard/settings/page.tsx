"use client"

import { useState } from "react"

export default function SettingsPage() {
  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const [threshold, setThreshold] = useState(20)
  const [aiEnabled, setAiEnabled] = useState(true)
  const [autoSuggestions, setAutoSuggestions] = useState(true)

  return (
    <div className="space-y-6">

      {/* TITLE */}
      <h1 className="text-2xl font-bold flex items-center gap-2">
        ⚙️ Settings
      </h1>

      {/* ================= BUSINESS ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">🏪 Business Profile</h2>

        <div className="grid grid-cols-2 gap-4">
          <input className="input" placeholder="Restaurant Name" />
          <input className="input" placeholder="Owner Name" />
          <input className="input" placeholder="Business Email" />
          <input className="input" placeholder="Phone Number" />
          <input className="input col-span-2" placeholder="Location" />
          <input className="input col-span-2" placeholder="Business Hours" />
        </div>
      </div>

      {/* ================= ALERT SETTINGS ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">🚨 Alert Settings</h2>

        <div className="flex items-center justify-between mb-4">
          <span>Enable real-time alerts</span>
          <input
            type="checkbox"
            checked={alertsEnabled}
            onChange={() => setAlertsEnabled(!alertsEnabled)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">
            Negative feedback threshold (%)
          </label>
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="input mt-1"
          />
        </div>
      </div>

      {/* ================= AI SETTINGS ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">🤖 AI Configuration</h2>

        <div className="flex items-center justify-between mb-4">
          <span>Enable Sentiment Analysis</span>
          <input
            type="checkbox"
            checked={aiEnabled}
            onChange={() => setAiEnabled(!aiEnabled)}
          />
        </div>

        <div className="flex items-center justify-between">
          <span>Auto Suggest Improvements</span>
          <input
            type="checkbox"
            checked={autoSuggestions}
            onChange={() => setAutoSuggestions(!autoSuggestions)}
          />
        </div>
      </div>

      {/* ================= FEEDBACK HANDLING ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">💬 Feedback Handling</h2>

        <div className="flex items-center justify-between mb-3">
          <span>Allow public responses</span>
          <input type="checkbox" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <span>Auto-mark resolved after action</span>
          <input type="checkbox" />
        </div>
      </div>

      {/* ================= ACCOUNT ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">🔐 Account</h2>

        <div className="flex gap-3">
          <button className="bg-gray-200 px-4 py-2 rounded">
            Change Password
          </button>

          <button className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
          </button>
        </div>
      </div>

      {/* SAVE */}
      <div className="flex justify-end">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Save Changes
        </button>
      </div>

    </div>
  )
}