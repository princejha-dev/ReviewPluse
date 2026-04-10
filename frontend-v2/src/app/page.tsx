"use client"

import Link from "next/link"
import { Building2, MessageSquareText, TrendingUp, ShieldAlert, Cpu } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="bg-white flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#f4f3fa]">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#e9e7ef] blur-3xl opacity-50 mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-[#d0d8ff] blur-3xl opacity-50 mix-blend-multiply"></div>
        
        <div className="max-w-7xl mx-auto px-6 py-24 sm:py-32 relative z-10">
          <div className="text-left max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e3a8a]/10 text-[#1e3a8a] text-sm font-semibold tracking-wide mb-6">
              <Cpu size={16} /> The Digital Sommelier for Feedback
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-[#1a1b21] tracking-tight leading-tight mb-8">
              Transform raw feedback into <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1e3a8a] to-[#2c52c2]">culinary intelligence.</span>
            </h1>
            <p className="text-lg md:text-xl text-[#444651] mb-10 leading-relaxed max-w-2xl">
              Upload your customer reviews and let our AI instantly analyze sentiment, detect operational issues, and highlight strengths. Ensure your restaurant makes data-driven decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="bg-gradient-to-r flex items-center justify-center from-[#1e3a8a] to-[#2c52c2] text-white px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all font-semibold text-lg"
              >
                Start Analyzing Free
              </Link>
              <Link
                href="/login"
                className="bg-white text-[#1a1b21] flex items-center justify-center border border-[#e3e1e9] px-8 py-4 rounded-xl hover:bg-[#f4f3fa] transition-colors font-semibold text-lg"
              >
                Log In to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1b21] mb-4">Enterprise-Grade Insights</h2>
            <p className="text-[#444651]">Designed specifically for restaurants to understand what their customers truly think beyond the star rating.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#f4f3fa] p-8 rounded-3xl group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <MessageSquareText size={28} className="text-[#10b981]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1b21] mb-3">Semantic Sentiment</h3>
              <p className="text-[#444651] leading-relaxed">
                Automatically classify text into positive, negative, and neutral sentiments with high accuracy.
              </p>
            </div>

            <div className="bg-[#f4f3fa] p-8 rounded-3xl group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <ShieldAlert size={28} className="text-[#f59e0b]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1b21] mb-3">Smart Alerts</h3>
              <p className="text-[#444651] leading-relaxed">
                Get notified immediately, like a negative spike, issue concentration, or rating mismatches.
              </p>
            </div>

            <div className="bg-[#f4f3fa] p-8 rounded-3xl group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <TrendingUp size={28} className="text-[#1e3a8a]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1b21] mb-3">Issue Categorization</h3>
              <p className="text-[#444651] leading-relaxed">
                We organize complaints into categories: Food Quality, Service, Wait Time, Ambience, and Price.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* HOW IT WORKS */}
      <section className="py-24 bg-[#1a1b21] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">How ReviewPulse Works</h2>
              <ul className="space-y-8">
                <li className="flex gap-4">
                  <div className="w-12 h-12 flex-shrink-0 bg-[#2f3036] rounded-xl flex items-center justify-center font-bold text-[#b6c4ff]">1</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Upload your raw CSV data</h4>
                    <p className="text-[#757682]">Export customer reviews from anywhere and drop the CSV into the secure dashboard.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-12 h-12 flex-shrink-0 bg-[#2f3036] rounded-xl flex items-center justify-center font-bold text-[#b6c4ff]">2</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">AI Batch Processing</h4>
                    <p className="text-[#757682]">Our advanced Groq LLM evaluates each review for tone, sentiment, and context immediately.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-12 h-12 flex-shrink-0 bg-[#2f3036] rounded-xl flex items-center justify-center font-bold text-[#b6c4ff]">3</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Act on Intelligence</h4>
                    <p className="text-[#757682]">View executive summaries, handle critical alerts, and see where to train your staff today.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-[#2f3036] rounded-3xl p-8 border border-[#444651]/30 relative shadow-2xl">
              <div className="absolute top-4 left-4 flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="mt-8 space-y-4">
                <div className="h-10 bg-[#1a1b21] rounded-lg w-3/4 animate-pulse"></div>
                <div className="h-32 bg-[#1a1b21] rounded-lg w-full"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-[#1a1b21] rounded-lg w-full"></div>
                  <div className="h-24 bg-[#1a1b21] rounded-lg w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
