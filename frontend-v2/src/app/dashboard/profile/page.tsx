"use client"

import { useState } from "react"
import { Save, Store, Mail, MapPin, Link as LinkIcon } from "lucide-react"

export default function ProfilePage() {
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    restaurantName: "The Rusty Spoon",
    email: "manager@rustyspoon.com",
    address: "123 Culinary Lane, NY",
    cuisine: "Modern American",
    website: "https://rustyspoon.com"
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert("Profile updated successfully")
    }, 1000)
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1a1b21]">Restaurant Profile</h1>
        <p className="text-[#444651] mt-2">Manage your establishment details and configuration.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e3e1e9]">
        <form onSubmit={handleSave} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#1a1b21] flex items-center gap-2">
                <Store size={16} className="text-[#1e3a8a]"/> Restaurant Name
              </label>
              <input 
                name="restaurantName"
                value={profile.restaurantName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#f4f3fa] border border-transparent rounded-xl focus:ring-2 focus:ring-[#b6c4ff] focus:bg-white outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#1a1b21] flex items-center gap-2">
                <Mail size={16} className="text-[#1e3a8a]"/> Contact Email
              </label>
              <input 
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#f4f3fa] border border-transparent rounded-xl focus:ring-2 focus:ring-[#b6c4ff] focus:bg-white outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1a1b21] flex items-center gap-2">
              <MapPin size={16} className="text-[#1e3a8a]"/> Address
            </label>
            <input 
              name="address"
              value={profile.address}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#f4f3fa] border border-transparent rounded-xl focus:ring-2 focus:ring-[#b6c4ff] focus:bg-white outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#1a1b21]">Cuisine Type</label>
              <select
                name="cuisine"
                value={profile.cuisine}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#f4f3fa] border border-transparent rounded-xl focus:ring-2 focus:ring-[#b6c4ff] focus:bg-white outline-none transition-all appearance-none"
              >
                <option value="Modern American">Modern American</option>
                <option value="Mexican">Mexican</option>
                <option value="Italian">Italian</option>
                <option value="Asian Fusion">Asian Fusion</option>
                <option value="Fast Casual">Fast Casual</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#1a1b21] flex items-center gap-2">
                <LinkIcon size={16} className="text-[#1e3a8a]"/> Website
              </label>
              <input 
                name="website"
                value={profile.website}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#f4f3fa] border border-transparent rounded-xl focus:ring-2 focus:ring-[#b6c4ff] focus:bg-white outline-none transition-all"
              />
            </div>
          </div>

          <hr className="border-[#e3e1e9]" />

          <div className="pt-2 flex justify-end">
             <button 
                type="submit"
                disabled={loading}
                className="bg-[#1e3a8a] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#00236f] transition-colors flex items-center gap-2"
             >
                <Save size={18} /> {loading ? "Saving..." : "Save Profile"}
             </button>
          </div>
        </form>
      </div>
    </div>
  )
}
