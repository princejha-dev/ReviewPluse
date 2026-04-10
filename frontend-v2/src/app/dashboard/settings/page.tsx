"use client"

import { Settings, CheckCircle2 } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-8">
       <div className="mb-4">
         <h1 className="text-3xl font-bold text-[#1a1b21] flex items-center gap-2 tracking-tight">
            <Settings className="text-[#1a1b21]" /> Platform Settings
         </h1>
         <p className="text-[#444651] mt-2">Manage your account preferences and integrations.</p>
       </div>

       <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e3e1e9]">
          <h3 className="font-bold text-lg mb-4 text-[#1a1b21]">Notification Preferences</h3>
          <div className="space-y-4 text-sm text-[#444651]">
            <label className="flex items-center gap-3 p-3 bg-[#f4f3fa] rounded-xl cursor-pointer">
               <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#1e3a8a]"/>
               Email me on High Severity Alerts
            </label>
            <label className="flex items-center gap-3 p-3 bg-[#f4f3fa] rounded-xl cursor-pointer">
               <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#1e3a8a]"/>
               Weekly executive summary report
            </label>
            <label className="flex items-center gap-3 p-3 bg-[#f4f3fa] rounded-xl cursor-pointer">
               <input type="checkbox" className="w-5 h-5 accent-[#1e3a8a]"/>
               Daily processing completion notice
            </label>
          </div>

          <hr className="my-8 border-[#e3e1e9]" />
          
          <h3 className="font-bold text-lg mb-4 text-[#1a1b21]">Data Management</h3>
          <p className="text-sm text-[#757682] mb-4">You can export your raw processed data or clear your history.</p>
          <div className="flex gap-4">
             <button className="bg-[#1e3a8a] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#00236f]">Export Data</button>
             <button className="bg-red-50 text-red-600 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-100">Clear History</button>
          </div>
       </div>
    </div>
  )
}
