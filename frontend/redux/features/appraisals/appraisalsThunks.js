import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

// Fetch all appraisals
export const fetchAppraisals = createAsyncThunk("appraisals/fetchAppraisals", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/appraisals`)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch appraisals")
  }
})

// Fetch appraisal by ID
export const fetchAppraisalById = createAsyncThunk(
  "appraisals/fetchAppraisalById",
  async (appraisalId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/appraisals/${appraisalId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch appraisal")
    }
  },
)

// Create appraisal
export const createAppraisal = createAsyncThunk(
  "appraisals/createAppraisal",
  async (appraisalData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/appraisals`, appraisalData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create appraisal")
    }
  },
)

// Fetch appraisals for a manager
export const fetchManagerAppraisals = createAsyncThunk(
  "appraisals/fetchManagerAppraisals",
  async (managerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/appraisals/manager/${managerId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch manager appraisals")
    }
  },
)

// Fetch appraisals for a user
export const fetchUserAppraisals = createAsyncThunk(
  "appraisals/fetchUserAppraisals",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/appraisals/user/${userId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user appraisals")
    }
  },
)
