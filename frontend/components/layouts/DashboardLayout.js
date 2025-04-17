"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Users, ClipboardList, LogOut, Menu, X, Home, Settings } from "lucide-react"

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className={`fixed inset-0 z-20 transition-opacity ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="absolute inset-0 bg-black opacity-50" onClick={closeSidebar}></div>
      </div>

      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:inset-auto md:h-screen`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="text-xl font-bold">Appraisal System</div>
          <button className="p-1 rounded-md md:hidden focus:outline-none" onClick={closeSidebar}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-4 py-6">
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-500">Logged in as</div>
            <div className="font-medium">{user?.name || "User"}</div>
            <div className="text-sm text-gray-500 capitalize">{user?.role || "User"}</div>
          </div>

          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
              onClick={closeSidebar}
            >
              <Home className="w-5 h-5 mr-3" />
              Dashboard
            </Link>

            <Link
              href="/appraisals"
              className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
              onClick={closeSidebar}
            >
              <ClipboardList className="w-5 h-5 mr-3" />
              Appraisals
            </Link>

            {user?.role === "admin" && (
              <>
                <Link
                  href="/admin/users"
                  className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                  onClick={closeSidebar}
                >
                  <Users className="w-5 h-5 mr-3" />
                  Users
                </Link>

                <Link
                  href="/admin/questions"
                  className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                  onClick={closeSidebar}
                >
                  <Settings className="w-5 h-5 mr-3" />
                  Questions
                </Link>
              </>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </nav>
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between h-16 px-4 bg-white border-b md:px-6">
          <button className="p-1 rounded-md md:hidden focus:outline-none" onClick={toggleSidebar}>
            <Menu className="w-6 h-6" />
          </button>

          <div className="text-lg font-bold md:hidden">Appraisal System</div>

          <div className="flex items-center">
            <div className="text-sm font-medium md:block hidden">{user?.name || "User"}</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-100">{children}</main>
      </div>
    </div>
  )
}
