"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { fetchUsers } from "@/redux/features/users/usersThunks"
import DashboardLayout from "@/components/layouts/DashboardLayout"
import { useAuth } from "@/context/AuthContext"
import UserList from "@/components/admin/UserList"

export default function Users() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useAuth()
  const { users, loading } = useSelector((state) => state.users)

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard")
    }

    dispatch(fetchUsers())
  }, [dispatch, router, user])

  const handleEditUser = (userId) => {
    router.push(`/admin/users/${userId}`)
  }

  const handleCreateUser = () => {
    router.push("/admin/users/create")
  }

  if (user && user.role !== "admin") {
    return null 
  }

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Users Management</h1>
          <button className="btn-primary" onClick={handleCreateUser}>
            Add New User
          </button>
        </div>

        {loading ? <p>Loading users...</p> : <UserList users={users} onEditUser={handleEditUser} />}
      </div>
    </DashboardLayout>
  )
}
