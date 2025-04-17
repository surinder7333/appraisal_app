"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeamMembers } from "@/redux/features/users/usersThunks";
import { fetchManagerAppraisals } from "@/redux/features/appraisals/appraisalsThunks";
import { useAuth } from "@/context/AuthContext";
import { ClipboardList, UserCheck } from "lucide-react";

export default function ManagerDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { teamMembers } = useSelector((state) => state.users);
  const { managerAppraisals } = useSelector((state) => state.appraisals);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchTeamMembers(user._id));
      dispatch(fetchManagerAppraisals(user._id));
    }
  }, [dispatch, user]);

  const pendingAppraisals = teamMembers.filter((member) => {
    return !managerAppraisals?.some(
      (appraisal) =>
        appraisal.targetUser._id === member._id && !appraisal.isSelfAppraisal
    );
  });

  const stats = [
    {
      title: "Team Members",
      value: teamMembers.length,
      icon: <UserCheck className="w-8 h-8" />,
      color: "bg-blue-500",
    },
    {
      title: "Pending Appraisals",
      value: pendingAppraisals.length,
      icon: <ClipboardList className="w-8 h-8" />,
      color: "bg-yellow-500",
    },
  ];

  const handleCreateAppraisal = (userId) => {
    router.push(`/appraisals/create/${userId}`);
  };


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card flex items-center">
            <div className={`${stat.color} text-white p-4 rounded-lg mr-4`}>
              {stat.icon}
            </div>
            <div>
              <h2 className="text-lg font-bold">{stat.value}</h2>
              <p className="text-gray-500">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Your Team Members</h2>
          {teamMembers.length > 0 ? (
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
                  {teamMembers.map((member) => {
                    const hasAppraisal = managerAppraisals.some(
                      (appraisal) =>
                        appraisal.targetUser._id === member._id &&
                        !appraisal.isSelfAppraisal
                    );

                    return (
                      <tr key={member._id} className="border-b">
                        <td className="py-2">{member.name}</td>
                        <td className="py-2">{member.email}</td>
                        <td className="py-2">
                          {hasAppraisal ? (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                              Completed
                            </span>
                          ) : (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                              Pending
                            </span>
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
                              onClick={() => handleCreateAppraisal(member._id)}
                            >
                              Appraise
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No team members found</p>
          )}
        </div>
      </div>
    </div>
  );
}
