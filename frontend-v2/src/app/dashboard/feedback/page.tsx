"use client"

import { useEffect, useState } from "react"
import { MessageSquareText, Zap } from "lucide-react"

type Insights = {
   assessment: string
   improvements: string[]
   recommendations: string[]
   strengths: string[]
}

export default function FeedbackPage() {
   const [insights, setInsights] = useState<Insights | null>(null)
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/insights`)
         .then((r) => r.json())
         .then((data) => {
            if (data.success) setInsights(data.insights)
            setLoading(false)
         })
         .catch((e) => {
            console.error("Insights failed to load:", e)
            setLoading(false)
         })
   }, [])

   if (loading) return (
      <div className="flex items-center justify-center h-64">
         <div className="animate-spin h-8 w-8 border-4 border-[#1e3a8a] rounded-full border-t-transparent"></div>
      </div>
   )

   if (!insights) return (
      <div className="bg-[#ffdad6] text-[#93000a] p-6 rounded-xl flex items-center gap-3 w-full">
         <MessageSquareText /> No feedback processing data found. Upload CSV first.
      </div>
   )

   return (
      <div className="max-w-5xl space-y-8">
         <div className="mb-4">
            <h1 className="text-3xl font-bold text-[#1a1b21] flex items-center gap-2 tracking-tight">
               <MessageSquareText className="text-[#10b981]" /> AI Feedback Intelligence
            </h1>
            <p className="text-[#444651] mt-2">Deep learning assessment of customer feedback.</p>
         </div>

         <div className="bg-white p-10 rounded-3xl shadow-sm border border-[#1e3a8a] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <Zap size={128} className="text-[#1e3a8a]" />
            </div>
            <h3 className="text-xl font-bold text-[#1e3a8a] mb-6 relative z-10 flex items-center gap-3">
               🧠 Executive Assessment
            </h3>
            <p className="text-lg font-medium text-[#1a1b21] italic mb-10 relative z-10 leading-relaxed border-l-4 border-[#1e3a8a] pl-4">"{insights.assessment}"</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
               <div className="bg-[#f4f3fa] p-6 rounded-2xl">
                  <h5 className="text-sm font-bold uppercase tracking-wider text-[#10b981] mb-4 flex items-center gap-2">Core Strengths</h5>
                  <ul className="text-[#444651] space-y-3">
                     {insights.strengths.map((s, i) => (
                        <li key={i} className="flex gap-3"><span className="text-[#10b981]">✓</span> {s}</li>
                     ))}
                  </ul>
               </div>
               <div className="bg-[#f4f3fa] p-6 rounded-2xl">
                  <h5 className="text-sm font-bold uppercase tracking-wider text-[#ef4444] mb-4 flex items-center gap-2">Areas to Improve</h5>
                  <ul className="text-[#444651] space-y-3">
                     {insights.improvements.map((s, i) => (
                        <li key={i} className="flex gap-3"><span className="text-[#ef4444]">×</span> {s}</li>
                     ))}
                  </ul>
               </div>
            </div>

            <div className="mt-8 bg-gradient-to-br from-[#1e3a8a] to-[#2c52c2] p-8 rounded-2xl text-white relative z-10">
               <h5 className="text-sm font-bold uppercase tracking-wider text-[#b6c4ff] mb-4">Strategic Action Items</h5>
               <ul className="space-y-3">
                  {insights.recommendations.map((s, i) => (
                     <li key={i} className="flex gap-3 font-medium"><div className="w-6 h-6 flex-shrink-0 bg-white/20 rounded-full flex items-center justify-center text-xs">{i + 1}</div> {s}</li>
                  ))}
               </ul>
            </div>
         </div>
      </div>
   )
}
