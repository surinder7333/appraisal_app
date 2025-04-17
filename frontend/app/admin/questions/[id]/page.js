"use client"
import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { fetchQuestionById, updateQuestion } from "@/redux/features/questions/questionsThunks"
import DashboardLayout from "@/components/layouts/DashboardLayout"
import { useAuth } from "@/context/AuthContext"

export default function EditQuestion({ params }) {
  const { id } = use(params)
  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useAuth()
  const { question, loading } = useSelector((state) => state.questions)

  const [text, setText] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard")
    }

    dispatch(fetchQuestionById(id))
  }, [dispatch, id, router, user])

  useEffect(() => {
    if (question) {
      setText(question.text || "")
    }
  }, [question])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      await dispatch(updateQuestion({ id, questionData: { text } })).unwrap()
      router.push("/admin/questions")
    } catch (err) {
      setError(err.message || "Failed to update question")
    } finally {
      setSubmitting(false)
    }
  }

  if (user && user.role !== "admin") {
    return null 
  }

  if (loading || !question) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Loading...</h1>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Edit Question</h1>

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
            />
          </div>

          <div className="flex justify-end">
            <button type="button" className="btn-secondary mr-2" onClick={() => router.push("/admin/questions")}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Updating..." : "Update Question"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
