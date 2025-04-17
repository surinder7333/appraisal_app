import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

// Fetch all questions
export const fetchQuestions = createAsyncThunk("questions/fetchQuestions", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/questions`)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch questions")
  }
})

// Fetch question by ID
export const fetchQuestionById = createAsyncThunk(
  "questions/fetchQuestionById",
  async (questionId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/questions/${questionId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch question")
    }
  },
)

// Create question
export const createQuestion = createAsyncThunk(
  "questions/createQuestion",
  async (questionData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/questions`, questionData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create question")
    }
  },
)

// Update question
export const updateQuestion = createAsyncThunk(
  "questions/updateQuestion",
  async ({ id, questionData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/questions/${id}`, questionData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update question")
    }
  },
)
