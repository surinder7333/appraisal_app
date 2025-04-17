"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { fetchAppraisals } from "@/redux/features/appraisals/appraisalsThunks"
import DashboardLayout from "@/components/layouts/DashboardLayout"
import { useAuth } from "@/context/AuthContext"
import AppraisalList from "@/components/appraisals/AppraisalList"

export default function Appraisals() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useAuth()
  const { appraisals, loading } = useSelector((state) => state.appraisals)

  useEffect(() => {
    dispatch(fetchAppraisals())
  }, [dispatch])

  const handleCreateAppraisal = (userId) => {
    router.push(`/appraisals/create/${userId}`)
  }

  const handleViewAppraisal = (appraisalId) => {
    router.push(`/appraisals/${appraisalId}`)
  }

  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Appraisals</h1>

        {loading ? (
          <p>Loading appraisals...</p>
        ) : (
          <AppraisalList
            appraisals={appraisals}
            userRole={user?.role}
            onViewAppraisal={handleViewAppraisal}
            onCreateAppraisal={handleCreateAppraisal}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
