export default function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">
        <div className="col-span-2">
          <h2 className="text-xl font-bold text-[#1e3a8a] flex items-center gap-2">
            🌊 ReviewPulse
          </h2>
          <p className="text-gray-500 mt-4 text-sm leading-relaxed max-w-sm">
            AI-powered semantic analytics for restaurants. Turn customer feedback into actionable culinary intelligence using advanced natural language processing.
          </p>
        </div>

        <div>
           <h3 className="font-semibold text-gray-900 mb-4 tracking-wide text-sm uppercase">Platform</h3>
           <ul className="space-y-3 text-gray-600 text-sm">
             <li><a href="#" className="hover:text-[#1e3a8a] transition">Features</a></li>
             <li><a href="#" className="hover:text-[#1e3a8a] transition">Pricing</a></li>
             <li><a href="/login" className="hover:text-[#1e3a8a] transition">Login</a></li>
             <li><a href="/signup" className="hover:text-[#1e3a8a] transition">Sign Up</a></li>
           </ul>
        </div>

        <div>
           <h3 className="font-semibold text-gray-900 mb-4 tracking-wide text-sm uppercase">Legal</h3>
           <ul className="space-y-3 text-gray-600 text-sm">
             <li><a href="#" className="hover:text-[#1e3a8a] transition">Privacy Policy</a></li>
             <li><a href="#" className="hover:text-[#1e3a8a] transition">Terms of Service</a></li>
             <li><a href="#" className="hover:text-[#1e3a8a] transition">Contact Us</a></li>
           </ul>
        </div>
      </div>
      <div className="border-t border-gray-100 py-6 text-center text-gray-400 text-xs">
        &copy; {new Date().getFullYear()} ReviewPulse by Analytics Aura. All rights reserved.
      </div>
    </footer>
  )
}
