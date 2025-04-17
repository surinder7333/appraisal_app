"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { fetchQuestions } from "@/redux/features/questions/questionsThunks"
import DashboardLayout from "@/components/layouts/DashboardLayout"
import { useAuth } from "@/context/AuthContext"
import QuestionList from "@/components/admin/QuestionList"

export default function Questions() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useAuth()
  const { questions, loading } = useSelector((state) => state.questions)

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard")
    }

    dispatch(fetchQuestions())
  }, [dispatch, router, user])

  const handleEditQuestion = (questionId) => {
    router.push(`/admin/questions/${questionId}`)
  }

  const handleCreateQuestion = () => {
    router.push("/admin/questions/create")
  }

  if (user && user.role !== "admin") {
    return null 
  }

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Appraisal Questions</h1>
          <button className="btn-primary" onClick={handleCreateQuestion}>
            Add New Question
          </button>
        </div>

        {loading ? (
          <p>Loading questions...</p>
        ) : (
          <QuestionList questions={questions} onEditQuestion={handleEditQuestion} />
        )}
      </div>
    </DashboardLayout>
  )
}
