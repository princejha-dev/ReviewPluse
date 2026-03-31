import { restaurants } from "@/data/restaurants"
import Link from "next/link"

export default function RestaurantsPage() {
  return (
    <main className="bg-gray-50 min-h-screen px-6 py-24">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <h1 className="text-4xl font-bold text-gray-900">
          Explore Restaurants
        </h1>

        <p className="text-gray-600 mt-2 mb-6">
          Discover restaurants with transparent feedback and real improvement tracking
        </p>

        {/* SEARCH */}
        <input
          placeholder="Search by name or location..."
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
        />

        {/* FILTERS */}
        <div className="flex gap-3 flex-wrap mb-10">
          {["All", "Cafe", "Italian", "Japanese", "Fine Dining"].map((tag, i) => (
            <button
              key={i}
              className={`px-4 py-2 rounded-full text-sm border ${
                i === 0
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-8">
          {restaurants.map((r) => (
            <Link key={r.id} href={`/restaurants/${r.id}`}>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer">

                {/* IMAGE */}
                <img
                  src={r.image}
                  alt={r.name}
                  className="w-full h-48 object-cover"
                />

                {/* CONTENT */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{r.name}</h3>

                  <p className="text-gray-500 text-sm">
                    📍 {r.location}
                  </p>

                  <div className="flex justify-between items-center mt-3">
                    <span className="text-yellow-600 text-sm">
                      ⭐ {r.rating}
                    </span>

                    <span className="text-green-600 text-sm">
                      {r.positive} Positive
                    </span>
                  </div>

                  <p className="text-red-500 text-sm mt-2">
                    ⚠ {r.issue}
                  </p>
                </div>

              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  )
}