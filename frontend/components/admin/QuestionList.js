"use client"

export default function QuestionList({ questions, onEditQuestion }) {
  return (
    <div className="card">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Question</th>
              <th className="py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.length > 0 ? (
              questions.map((question) => (
                <tr key={question._id} className="border-b">
                  <td className="py-2">{question.text}</td>
                  <td className="py-2">
                    <button className="text-blue-500 hover:text-blue-700" onClick={() => onEditQuestion(question._id)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="py-4 text-center">
                  No questions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
