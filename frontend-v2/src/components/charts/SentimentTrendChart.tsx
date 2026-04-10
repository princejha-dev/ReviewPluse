"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const mockData = [
  { day: "Mon", positive: 45, negative: 12, neutral: 10 },
  { day: "Tue", positive: 52, negative: 8, neutral: 15 },
  { day: "Wed", positive: 48, negative: 15, neutral: 11 },
  { day: "Thu", positive: 61, negative: 5, neutral: 8 },
  { day: "Fri", positive: 59, negative: 9, neutral: 12 },
  { day: "Sat", positive: 75, negative: 6, neutral: 18 },
  { day: "Sun", positive: 81, negative: 4, neutral: 14 },
]

export default function SentimentTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={mockData}
        margin={{ top: 5, right: 30, left: -20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e3e1e9" />
        <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip 
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
        />
        <Legend verticalAlign="top" height={36} iconType="circle" />
        <Line type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="neutral" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
