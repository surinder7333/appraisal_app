"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { fetchUserRelationships } from "@/redux/features/users/usersThunks"
import { fetchUserAppraisals } from "@/redux/features/appraisals/appraisalsThunks"
import { useAuth } from "@/context/AuthContext"
import { ClipboardList, Users } from "lucide-react"

export default function StaffDashboard() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useAuth()
  const { relationships } = useSelector((state) => state.users)
  const { userAppraisals } = useSelector((state) => state.appraisals)

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchUserRelationships(user._id))
      dispatch(fetchUserAppraisals(user._id))
    }
  }, [dispatch, user])

  const hasSelfAppraisal = userAppraisals?.some(
    (appraisal) => appraisal?.targetUser?._id === user?._id && appraisal?.submittedBy?._id === user?._id,
  )

  const pendingAppraisals = [...(relationships.peers || []), ...(relationships.juniors || [])].filter((person) => {
    return !userAppraisals?.some(
      (appraisal) => appraisal?.targetUser?._id === person?._id && appraisal?.submittedBy?._id === user?._id,
    )
  })

  const stats = [
    {
      title: "Self Appraisal",
      value: hasSelfAppraisal ? "Completed" : "Pending",
      icon: <ClipboardList className="w-8 h-8" />,
      color: hasSelfAppraisal ? "bg-green-500" : "bg-yellow-500",
    },
    {
      title: "Pending Appraisals",
      value: pendingAppraisals.length,
      icon: <Users className="w-8 h-8" />,
      color: pendingAppraisals.length > 0 ? "bg-yellow-500" : "bg-green-500",
    },
  ]

  const handleCreateAppraisal = (userId) => {
    router.push(`/appraisals/create/${userId}`)
  }

  const handleCreateSelfAppraisal = () => {
    router.push(`/appraisals/create/${user?._id}`)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Staff Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card flex items-center">
            <div className={`${stat.color} text-white p-4 rounded-lg mr-4`}>{stat.icon}</div>
            <div>
              <h2 className="text-lg font-bold">{stat.value}</h2>
              <p className="text-gray-500">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {!hasSelfAppraisal && (
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">Self Appraisal</h2>
          <p className="mb-4">You haven't submitted your self-appraisal yet.</p>
          <button className="btn-primary" onClick={handleCreateSelfAppraisal}>
            Submit Self Appraisal
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {relationships.peers && relationships.peers.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Your Peers</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Name</th>
                    <th className="py-2 text-left">Email</th>
                    <th className="py-2 text-left">Status</th>
                    <th className="py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {relationships.peers.map((peer) => {
                    const hasAppraisal = userAppraisals?.some(
                      (appraisal) => appraisal?.targetUser?._id === peer?._id && appraisal?.submittedBy?._id === user?._id,
                    )

                    return (
                      <tr key={peer._id} className="border-b">
                        <td className="py-2">{peer.name}</td>
                        <td className="py-2">{peer.email}</td>
                        <td className="py-2">
                          {hasAppraisal ? (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Completed</span>
                          ) : (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">Pending</span>
                          )}
                        </td>
                        <td className="py-2">
                          {hasAppraisal ? (
                            <button
                              className="text-blue-500 hover:text-blue-700"
                              onClick={() => router.push("/appraisals")}
                            >
                              View
                            </button>
                          ) : (
                            <button
                              className="text-blue-500 hover:text-blue-700"
                              onClick={() => handleCreateAppraisal(peer._id)}
                            >
                              Appraise
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {relationships.juniors && relationships.juniors.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Your Juniors</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Name</th>
                    <th className="py-2 text-left">Email</th>
                    <th className="py-2 text-left">Status</th>
                    <th className="py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {relationships.juniors.map((junior) => {
                    const hasAppraisal = userAppraisals?.some(
                      (appraisal) => appraisal?.targetUser?._id === junior?._id && appraisal?.submittedBy?._id === user?._id,
                    )

                    return (
                      <tr key={junior._id} className="border-b">
                        <td className="py-2">{junior.name}</td>
                        <td className="py-2">{junior.email}</td>
                        <td className="py-2">
                          {hasAppraisal ? (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Completed</span>
                          ) : (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">Pending</span>
                          )}
                        </td>
                        <td className="py-2">
                          {hasAppraisal ? (
                            <button
                              className="text-blue-500 hover:text-blue-700"
                              onClick={() => router.push("/appraisals")}
                            >
                              View
                            </button>
                          ) : (
                            <button
                              className="text-blue-500 hover:text-blue-700"
                              onClick={() => handleCreateAppraisal(junior._id)}
                            >
                              Appraise
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
