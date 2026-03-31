import { restaurants } from "@/data/restaurants"
import { notFound } from "next/navigation"
import SentimentChart from "@/app/components/charts/SentimentChart"
import IssueChart from "@/app/components/charts/IssueChart"

export default async function RestaurantDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const restaurant = restaurants.find((r) => r.id === id)

  if (!restaurant) return notFound()

  return (
    <main className="bg-gray-50 min-h-screen px-6 py-24">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* 🔥 HERO (UPGRADED) */}
        <div className="bg-white rounded-2xl p-6 shadow flex gap-6">

          {/* image */}
          <div className="w-1/2">
            <img
              src={restaurant.image}
              className="w-full h-80 object-cover rounded-xl"
            />

            {/* thumbnails */}
            <div className="flex gap-3 mt-3">
              {[1, 2, 3].map((i) => (
                <img
                  key={i}
                  src={restaurant.image}
                  className="w-24 h-16 object-cover rounded-lg border"
                />
              ))}
            </div>
          </div>

          {/* content */}
          <div className="flex flex-col justify-between flex-1">

            <div>
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{restaurant.name}</h1>

                {/* rating */}
                <div className="bg-yellow-100 px-4 py-2 rounded-xl font-semibold">
                  ⭐ {restaurant.rating}
                </div>
              </div>

              <p className="text-gray-500 mt-1">{restaurant.location}</p>

              {/* category */}
              <span className="inline-block mt-2 px-3 py-1 bg-gray-100 rounded-full text-sm">
                Fine Dining
              </span>

              <p className="mt-4 text-gray-600">
                {restaurant.description}
              </p>
            </div>

            {/* sentiment + buttons */}
            <div className="mt-6 space-y-4">

              <div className="bg-green-100 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Sentiment Score</p>
                  <p className="text-3xl font-bold text-green-600">
                    {restaurant.sentiment}%
                  </p>
                  <p className="text-xs text-gray-500">
                    Positive feedback from customers
                  </p>
                </div>

                <span className="text-green-600 text-2xl">📈</span>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg">
                  💬 Leave Feedback
                </button>

                <button className="px-4 border rounded-lg">
                  📱 QR Code
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* 🔥 CHARTS */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-4">Sentiment Overview</h2>
            <SentimentChart data={restaurant.sentimentBreakdown} />
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-4">Issue Breakdown</h2>
            <IssueChart data={restaurant.issues} />
          </div>
        </div>

        {/* 🔥 IMPROVEMENT TRACKER (REAL VERSION) */}
        <div className="bg-white p-6 rounded-xl shadow space-y-6">
          <h2 className="font-semibold flex items-center gap-2">
            📈 Improvement Tracker
          </h2>

          {restaurant.issues.map((issue) => (
            <div key={issue.name} className="border-l-4 border-green-500 pl-4 space-y-2">

              <div className="flex justify-between items-center">
                <p className="font-medium">{issue.name}</p>

                <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                  Improved
                </span>
              </div>

              {/* BEFORE */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500 w-12">Before</span>
                <div className="flex-1 bg-gray-200 h-2 rounded">
                  <div className="bg-black h-2 rounded w-[40%]" />
                </div>
                <span className="text-red-500">40%</span>
              </div>

              {/* AFTER */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500 w-12">After</span>
                <div className="flex-1 bg-gray-200 h-2 rounded">
                  <div
                    className="bg-green-500 h-2 rounded"
                    style={{ width: `${issue.value}%` }}
                  />
                </div>
                <span className="text-green-600">{issue.value}%</span>
              </div>

              <p className="text-xs text-gray-500">
                Action: Improvement applied to {issue.name.toLowerCase()}
              </p>
            </div>
          ))}
        </div>

        {/* 🔥 RESOLUTION LOG (CARD STYLE) */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="font-semibold">Resolution Log</h2>

          {restaurant.issues.map((issue) => (
            <div key={issue.name} className="flex gap-4 p-4 bg-gray-50 rounded-xl">

              <div className="text-blue-600 text-xl">✔</div>

              <div className="flex-1">
                <p className="font-medium">{issue.name}</p>
                <p className="text-sm text-gray-500">
                  Action taken to resolve {issue.name.toLowerCase()}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  Impact: Improved performance
                </p>
              </div>

              <p className="text-sm text-gray-400">2026-03-15</p>
            </div>
          ))}
        </div>

        {/* 🔥 CUSTOMER FEEDBACK (REAL VERSION) */}
        <div className="bg-white p-6 rounded-xl shadow space-y-6">
          <h2 className="font-semibold">Customer Feedback</h2>

          {[
            { name: "Sarah", sentiment: "Positive", text: "Amazing food!", tag: "Service Delay" },
            { name: "Emily", sentiment: "Neutral", text: "Long wait time.", tag: "Service Delay" },
            { name: "Lisa", sentiment: "Negative", text: "Very noisy.", tag: "Noise Level" },
          ].map((review, i) => (
            <div key={i} className="border-b pb-4">

              <div className="flex justify-between">
                <p className="font-medium">{review.name}</p>
                <p className="text-sm text-gray-400">3/25/2026</p>
              </div>

              {/* stars */}
              <div className="text-yellow-400">★★★★★</div>

              {/* sentiment badge */}
              <span
                className={`text-xs px-3 py-1 rounded-full ${review.sentiment === "Positive"
                    ? "bg-green-100 text-green-600"
                    : review.sentiment === "Neutral"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}
              >
                {review.sentiment}
              </span>

              <p className="text-gray-600 mt-2">{review.text}</p>

              {/* tag */}
              <div className="mt-2">
                <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                  {review.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}