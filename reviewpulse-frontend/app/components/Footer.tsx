export default function Footer() {
  return (
    <footer className="bg-white border-t mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-lg font-semibold text-blue-600">
            ReviewPulse
          </h2>
          <p className="text-gray-600 mt-3 text-sm">
            See what restaurants improve — not just what they promise.
            Transparent feedback and real-time improvement tracking.
          </p>
        </div>

        {/* CUSTOMERS */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">
            For Customers
          </h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>Browse Restaurants</li>
            <li>Sign Up</li>
          </ul>
        </div>

        {/* BUSINESS */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">
            For Businesses
          </h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>List Your Business</li>
            <li>Business Login</li>
          </ul>
        </div>

      </div>

      {/* COPYRIGHT */}
      <div className="text-center text-gray-500 text-sm pb-6">
        © 2026 ReviewPulse. All rights reserved.
      </div>
    </footer>
  )
}