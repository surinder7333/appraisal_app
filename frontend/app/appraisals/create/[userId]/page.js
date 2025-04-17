"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestions } from "@/redux/features/questions/questionsThunks";
import { createAppraisal } from "@/redux/features/appraisals/appraisalsThunks";
import { fetchUserById } from "@/redux/features/users/usersThunks";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

export default function CreateAppraisal({ params }) {
  const { userId } = params
  const router = useRouter();
  const dispatch = useDispatch();
  const { user: currentUser } = useAuth();
  const { questions, loading: questionsLoading } = useSelector(
    (state) => state.questions
  );
  const { user: targetUser, loading: userLoading } = useSelector(
    (state) => state.users
  );

  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchQuestions());
    dispatch(fetchUserById(userId));
  }, [dispatch, userId]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const answersArray = Object.keys(answers).map((questionId) => ({
        question: questionId,
        answer: answers[questionId],
      }));

      const res = await dispatch(
        createAppraisal({
          targetUser: userId,
          submittedBy: currentUser._id,
          answers: answersArray,
        })
      ).unwrap();
      if (res) {
        toast.success(res.message);
      }
    } catch (err) {
      toast.error(err);
    } finally {
      router.push("/appraisals");
      setSubmitting(false);
    }
  };

  if (questionsLoading || userLoading) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Loading...</h1>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">
          Appraisal for {targetUser?.name || "User"}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="card">
            {questions.map((question) => (
              <div key={question._id} className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">
                  {question.text}
                </label>
                <textarea
                  className="form-input h-24"
                  value={answers[question._id] || ""}
                  onChange={(e) =>
                    handleAnswerChange(question._id, e.target.value)
                  }
                  required
                />
              </div>
            ))}

            <div className="flex justify-end">
              <button
                type="button"
                className="btn-secondary mr-2"
                onClick={() => router.push("/appraisals")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Appraisal"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
