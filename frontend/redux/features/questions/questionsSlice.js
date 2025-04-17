import { createSlice } from "@reduxjs/toolkit"
import { fetchQuestions, fetchQuestionById, createQuestion, updateQuestion } from "./questionsThunks"

const initialState = {
  questions: [],
  question: null,
  loading: false,
  error: null,
}

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all questions
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.questions = action.payload
        state.loading = false
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // Fetch question by ID
      .addCase(fetchQuestionById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchQuestionById.fulfilled, (state, action) => {
        state.question = action.payload
        state.loading = false
      })
      .addCase(fetchQuestionById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // Create question
      .addCase(createQuestion.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.questions.push(action.payload)
        state.loading = false
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // Update question
      .addCase(updateQuestion.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        const index = state.questions.findIndex((question) => question._id === action.payload._id)
        if (index !== -1) {
          state.questions[index] = action.payload
        }
        state.question = action.payload
        state.loading = false
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default questionsSlice.reducer
