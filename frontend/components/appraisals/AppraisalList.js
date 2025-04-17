"use client";
import { useAuth } from "@/context/AuthContext";

export default function AppraisalList({
  appraisals,
  userRole,
  onViewAppraisal,
  onCreateAppraisal,
}) {
  const { user } = useAuth();

  // Filter appraisals based on user role
  const filteredAppraisals = appraisals.filter((appraisal) => {
    if (userRole === "admin") {
      return true;
    } else if (userRole === "manager") {
      return (
        appraisal?.submittedBy?._id === user?._id ||
        (appraisal?.isSelfAppraisal &&
          appraisal?.submittedBy?._id !== user?._id) ||
        (appraisal?.isSelfAppraisal &&
          appraisal?.targetUser?.manager === user?._id)
      );
    } else {
      return appraisal?.submittedBy?._id === user?._id;
    }
  });

  const getTargetUsers = () => {
    const targetUsers = [];

    // 1. Self Appraisal (if not already done)
    const hasSelfAppraisal = appraisals?.some(
      (a) =>
        a?.targetUser?._id === user?._id && a?.submittedBy?._id === user?._id
    );
    if (!hasSelfAppraisal) {
      targetUsers?.push({
        _id: user?._id,
        name: `${user?.name} (Self)`,
        isSelf: true,
      });
    }

    // 2. Manager: Add team members not yet appraised by this manager
    if (userRole === "manager" && user?.teamMembers?.length > 0) {
      user.teamMembers.forEach((member) => {
        const alreadyAppraised = appraisals.some(
          (a) =>
            a.targetUser._id === member._id && a.submittedBy._id === user._id
        );
        if (!alreadyAppraised) {
          targetUsers.push({
            _id: member._id,
            name: member.name,
            relationship: "Team Member",
          });
        }
      });
    }

    return targetUsers;
  };

  const targetUsers = getTargetUsers();


  return (
    <div>
      {targetUsers.length > 0 && (
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">Pending Appraisals</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Name</th>
                  <th className="py-2 text-left">Relationship</th>
                  <th className="py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {targetUsers.map((user, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2">{user.name}</td>
                    <td className="py-2">
                      {user.isSelf ? "Self" : user.relationship}
                    </td>
                    <td className="py-2">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => onCreateAppraisal(user._id)}
                      >
                        Create Appraisal
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Submitted Appraisals</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">Target User</th>
                <th className="py-2 text-left">Submitted By</th>
                <th className="py-2 text-left">Date</th>
                <th className="py-2 text-left">Type</th>
                <th className="py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppraisals.length > 0 ? (
                filteredAppraisals?.map((appraisal) => (
                  <tr key={appraisal?._id} className="border-b">
                    <td className="py-2">{appraisal?.targetUser?.name}</td>
                    <td className="py-2">{appraisal?.submittedBy?.name}</td>
                    <td className="py-2">
                      {new Date(appraisal?.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2">
                      {appraisal?.isSelfAppraisal ? (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          Self
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                          Review
                        </span>
                      )}
                    </td>
                    <td className="py-2">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => onViewAppraisal(appraisal._id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center">
                    No appraisals found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
