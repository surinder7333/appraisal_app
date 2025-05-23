"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { createQuestion } from "@/redux/features/questions/questionsThunks"
import DashboardLayout from "@/components/layouts/DashboardLayout"
import { useAuth } from "@/context/AuthContext"

export default function CreateQuestion() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useAuth()

  const [text, setText] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard")
    }
  }, [router, user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      await dispatch(createQuestion({ text })).unwrap()
      router.push("/admin/questions")
    } catch (err) {
      setError(err.message || "Failed to create question")
    } finally {
      setSubmitting(false)
    }
  }

  if (user && user.role !== "admin") {
    return null 
  }

  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Create New Question</h1>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="card">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="text">
              Question Text
            </label>
            <textarea
              className="form-input h-32"
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              placeholder="Enter the appraisal question here..."
            />
          </div>

          <div className="flex justify-end">
            <button type="button" className="btn-secondary mr-2" onClick={() => router.push("/admin/questions")}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Creating..." : "Create Question"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
