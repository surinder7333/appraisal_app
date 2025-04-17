"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import DashboardLayout from "@/components/layouts/DashboardLayout"
import AdminDashboard from "@/components/dashboard/AdminDashboard"
import ManagerDashboard from "@/components/dashboard/ManagerDashboard"
import StaffDashboard from "@/components/dashboard/StaffDashboard"

export default function Dashboard() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    )
  }

  const renderDashboard = () => {
    switch (user.role) {
      case "admin":
        return <AdminDashboard />
      case "manager":
        return <ManagerDashboard />
      default:
        return <StaffDashboard />
    }
  }

  return <DashboardLayout>{renderDashboard()}</DashboardLayout>
}
