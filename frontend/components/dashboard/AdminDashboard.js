"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { fetchUsers } from "@/redux/features/users/usersThunks"
import { fetchQuestions } from "@/redux/features/questions/questionsThunks"
import { fetchAppraisals } from "@/redux/features/appraisals/appraisalsThunks"
import { Users, ClipboardList, Settings } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { users } = useSelector((state) => state.users)
  const { questions } = useSelector((state) => state.questions)
  const { appraisals } = useSelector((state) => state.appraisals)

  useEffect(() => {
    dispatch(fetchUsers())
    dispatch(fetchQuestions())
    dispatch(fetchAppraisals())
  }, [dispatch])

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: <Users className="w-8 h-8" />,
      color: "bg-blue-500",
      onClick: () => router.push("/admin/users"),
    },
    {
      title: "Total Questions",
      value: questions.length,
      icon: <Settings className="w-8 h-8" />,
      color: "bg-green-500",
      onClick: () => router.push("/admin/questions"),
    },
    {
      title: "Total Appraisals",
      value: appraisals.length,
      icon: <ClipboardList className="w-8 h-8" />,
      color: "bg-purple-500",
      onClick: () => router.push("/appraisals"),
    },
  ]

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="card flex items-center cursor-pointer hover:shadow-lg transition-shadow"
            onClick={stat.onClick}
          >
            <div className={`${stat.color} text-white p-4 rounded-lg mr-4`}>{stat.icon}</div>
            <div>
              <h2 className="text-lg font-bold">{stat.value}</h2>
              <p className="text-gray-500">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Recent Users</h2>
          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Name</th>
                    <th className="py-2 text-left">Email</th>
                    <th className="py-2 text-left">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 5).map((user) => (
                    <tr key={user._id} className="border-b">
                      <td className="py-2">{user.name}</td>
                      <td className="py-2">{user.email}</td>
                      <td className="py-2 capitalize">{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No users found</p>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Recent Appraisals</h2>
          {appraisals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Target User</th>
                    <th className="py-2 text-left">Submitted By</th>
                    <th className="py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {appraisals.slice(0, 5).map((appraisal) => (
                    <tr key={appraisal._id} className="border-b">
                      <td className="py-2">{appraisal.targetUser.name}</td>
                      <td className="py-2">{appraisal.submittedBy.name}</td>
                      <td className="py-2">{new Date(appraisal.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No appraisals found</p>
          )}
        </div>
      </div>
    </div>
  )
}
