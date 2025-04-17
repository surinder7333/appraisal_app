"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppraisalById } from "@/redux/features/appraisals/appraisalsThunks";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/context/AuthContext";

export default function AppraisalDetail({ params }) {
  const { id } = params;
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { appraisal, loading } = useSelector((state) => state.appraisals);

  useEffect(() => {
    dispatch(fetchAppraisalById(id));
  }, [dispatch, id]);

  const canViewAppraisal = () => {
    if (!appraisal || !user) return false;

    // Admin can view all appraisals
    if (user.role === "admin") return true;

    // Manager can view appraisals they submitted or self-appraisals of their team members
    if (user.role === "manager") {
      return (
        appraisal.submittedBy._id === user._id ||
        appraisal.targetUser._id === user._id ||
        (appraisal.isSelfAppraisal && appraisal.targetUser.manager === user._id)
      );
    }

    // Staff can only view appraisals they submitted
    return appraisal.submittedBy._id === user._id;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Loading...</h1>
        </div>
      </DashboardLayout>
    );
  }

  if (!appraisal) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Appraisal not found</h1>
          <button
            className="btn-primary"
            onClick={() => router.push("/appraisals")}
          >
            Back to Appraisals
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (!canViewAppraisal()) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Access Denied</h1>
          <p className="mb-4">
            You do not have permission to view this appraisal.
          </p>
          <button
            className="btn-primary"
            onClick={() => router.push("/appraisals")}
          >
            Back to Appraisals
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">
          Appraisal for {appraisal?.targetUser?.name}
        </h1>

        <div className="card mb-4">
          <div className="mb-4">
            <p className="text-sm text-gray-500">Submitted by</p>
            <p className="font-medium">{appraisal.submittedBy.name}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500">Submission Date</p>
            <p className="font-medium">
              {new Date(appraisal.createdAt).toLocaleDateString()}
            </p>
          </div>

          {appraisal.isSelfAppraisal && (
            <div className="mb-4 inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
              Self Appraisal
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Responses</h2>

          {appraisal.answers.map((answer, index) => (
            <div
              key={index}
              className="mb-6 pb-6 border-b border-gray-200 last:border-0"
            >
              <p className="font-bold mb-2">{answer.question.text}</p>
              <p>{answer.answer}</p>
            </div>
          ))}

          <div className="flex justify-end mt-4">
            <button
              className="btn-primary"
              onClick={() => router.push("/appraisals")}
            >
              Back to Appraisals
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
