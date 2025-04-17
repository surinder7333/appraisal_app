"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { fetchUserById, updateUser, fetchUsers } from "@/redux/features/users/usersThunks"
import DashboardLayout from "@/components/layouts/DashboardLayout"
import { useAuth } from "@/context/AuthContext"

export default function EditUser({ params }) {
  const { id } = params
  const router = useRouter()
  const dispatch = useDispatch()
  const { user: currentUser } = useAuth()
  const { user, users, loading } = useSelector((state) => state.users)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    manager: "",
    peers: [],
    juniors: [],
  })
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (currentUser && currentUser.role !== "admin") {
      router.push("/dashboard")
    }

    dispatch(fetchUserById(id))
    dispatch(fetchUsers())
  }, [dispatch, id, router, currentUser])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "staff",
        manager: user.manager || "",
        peers: user.peers || [],
        juniors: user.juniors || [],
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleMultiSelect = (e) => {
    const { name, options } = e.target
    const selected = []
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value)
      }
    }
    setFormData((prev) => ({
      ...prev,
      [name]: selected,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      await dispatch(updateUser({ id, userData: formData })).unwrap()
      router.push("/admin/users")
    } catch (err) {
      setError(err.message || "Failed to update user")
    } finally {
      setSubmitting(false)
    }
  }

  if (currentUser && currentUser.role !== "admin") {
    return null 
  }

  if (loading || !user) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Loading...</h1>
        </div>
      </DashboardLayout>
    )
  }

  const managers = users.filter((u) => u.role === "manager" && u._id !== id)
  const peers = users.filter((u) => u._id !== id && u._id !== formData.manager)
  const potentialJuniors = users.filter((u) => u.role === "staff" && u._id !== id)

  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Edit User: {user.name}</h1>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Full Name
              </label>
              <input
                className="form-input"
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="form-input"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                Role
              </label>
              <select
                className="form-input"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            {formData.role === "staff" && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="manager">
                  Manager
                </label>
                <select
                  className="form-input"
                  id="manager"
                  name="manager"
                  value={formData.manager}
                  onChange={handleChange}
                >
                  <option value="">Select Manager</option>
                  {managers.map((manager) => (
                    <option key={manager._id} value={manager._id}>
                      {manager.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mb-4 md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="peers">
                Peers (Hold Ctrl/Cmd to select multiple)
              </label>
              <select
                className="form-input"
                id="peers"
                name="peers"
                multiple
                value={formData.peers}
                onChange={handleMultiSelect}
              >
                {peers.map((peer) => (
                  <option key={peer._id} value={peer._id}>
                    {peer.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4 md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="juniors">
                Juniors (Hold Ctrl/Cmd to select multiple)
              </label>
              <select
                className="form-input"
                id="juniors"
                name="juniors"
                multiple
                value={formData.juniors}
                onChange={handleMultiSelect}
              >
                {potentialJuniors.map((junior) => (
                  <option key={junior._id} value={junior._id}>
                    {junior.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button type="button" className="btn-secondary mr-2" onClick={() => router.push("/admin/users")}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Updating..." : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
