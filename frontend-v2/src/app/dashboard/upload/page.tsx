"use client"

import { useState } from "react"
import { Upload, FileUp, Sparkles, CheckCircle2, AlertCircle } from "lucide-react"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleUpload = async () => {
    if (!file) return
    setStatus("uploading")

    const formData = new FormData()
    formData.append("file", file)

    try {
      // 1. Upload CSV
      const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
        method: "POST",
        body: formData
      })
      if (!uploadRes.ok) throw new Error("Failed to upload file")

      const uploadData = await uploadRes.json()

      // 2. Trigger Batch AI Processing
      setStatus("processing")
      setMessage(`Uploaded ${uploadData.reviews_uploaded} reviews. Extracing semantics using Groq AI...`)

      const processRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/process-all-batches`, {
        method: "POST"
      })

      if (!processRes.ok) throw new Error("AI Processing failed")

      const processData = await processRes.json()
      setStatus("success")
      setMessage(`Successfully processed ${processData.total_processed} reviews! Navigate to Dashboard to view Insights.`)
    } catch (err: any) {
      console.error(err)
      setStatus("error")
      setMessage(err.message || "An unexpected network error occurred")
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8 pl-4 border-l-4 border-[#1e3a8a]">
        <h1 className="text-3xl font-bold text-[#1a1b21]">Upload Data</h1>
        <p className="text-[#444651] mt-2">Feed raw reviews for the Digital Sommelier to analyze.</p>
      </div>

      <div className="bg-white rounded-3xl p-10 shadow-sm border border-[#e3e1e9] text-center">

        <div className="border-2 border-dashed border-[#b6c4ff] bg-[#faf8ff] rounded-2xl p-12 hover:bg-[#f4f3fa] transition-colors cursor-pointer relative group">
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".csv"
            onChange={(e) => {
              if (e.target.files?.[0]) setFile(e.target.files[0])
            }}
          />
          <FileUp size={48} className="mx-auto text-[#1e3a8a] mb-4 group-hover:-translate-y-1 transition-transform" />
          <h3 className="text-xl font-semibold text-[#1a1b21] mb-2">
            {file ? file.name : "Drag and drop your CSV file"}
          </h3>
          <p className="text-[#757682]">Must contain a <code className="bg-gray-100 px-2 py-0.5 rounded text-sm text-[#ef4444]">review_text</code> column</p>
        </div>

        <div className="mt-8 max-w-sm mx-auto">
          <button
            onClick={handleUpload}
            disabled={status === "uploading" || status === "processing" || !file}
            className="w-full bg-gradient-to-r from-[#1e3a8a] to-[#2c52c2] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 transition-all"
          >
            {status === "idle" && <><Upload size={20} /> Run Analysis</>}
            {status === "uploading" && <><div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div> Uploading...</>}
            {status === "processing" && <><Sparkles size={20} className="animate-pulse" /> Processing via Groq AI...</>}
            {status === "success" && <><CheckCircle2 size={20} /> Success!</>}
            {status === "error" && <><AlertCircle size={20} /> Failed</>}
          </button>
        </div>

        {message && (
          <div className={`mt-6 p-4 rounded-xl ${status === 'error' ? 'bg-[#ffdad6] text-[#93000a]' : 'bg-[#e9e7ef] text-[#1e3a8a]'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
