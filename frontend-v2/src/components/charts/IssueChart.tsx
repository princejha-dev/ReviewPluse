"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

type Props = {
  data: { name: string; value: number }[]
}

export default function IssueChart({ data }: Props) {
  if (!data || data.length === 0) {
     return <div className="h-full w-full flex items-center justify-center text-[#757682]">No issue data available.</div>
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e3e1e9" />
        <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis 
          dataKey="name" 
          type="category" 
          width={100} 
          fontSize={12} 
          tickLine={false} 
          axisLine={false}
          tickFormatter={(val) => val.split('_').join(' ')} 
        />
        <Tooltip 
          cursor={{ fill: 'transparent' }} 
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
        />
        <Bar dataKey="value" fill="#b6c4ff" radius={[0, 4, 4, 0]} barSize={24} />
      </BarChart>
    </ResponsiveContainer>
  )
}
