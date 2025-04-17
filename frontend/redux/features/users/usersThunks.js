import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

// Fetch all users
export const fetchUsers = createAsyncThunk("users/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch users")
  }
})

// Fetch user by ID
export const fetchUserById = createAsyncThunk("users/fetchUserById", async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch user")
  }
})

// Create user
export const createUser = createAsyncThunk("users/createUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, userData)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to create user")
  }
})

// Update user
export const updateUser = createAsyncThunk("users/updateUser", async ({ id, userData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`, userData)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update user")
  }
})

// Fetch team members (for managers)
export const fetchTeamMembers = createAsyncThunk("users/fetchTeamMembers", async (managerId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/manager/${managerId}/team`)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch team members")
  }
})

// Fetch user relationships (manager, peers, juniors)
export const fetchUserRelationships = createAsyncThunk(
  "users/fetchUserRelationships",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/relationships`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user relationships")
    }
  },
)
