import { createSlice } from "@reduxjs/toolkit"
import {
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  fetchTeamMembers,
  fetchUserRelationships,
} from "./usersThunks"

const initialState = {
  users: [],
  user: null,
  teamMembers: [],
  relationships: {
    manager: null,
    peers: [],
    juniors: [],
  },
  loading: false,
  error: null,
}

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload
        state.loading = false
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.user = action.payload
        state.loading = false
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload)
        state.loading = false
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((user) => user._id === action.payload._id)
        if (index !== -1) {
          state.users[index] = action.payload
        }
        state.user = action.payload
        state.loading = false
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // Fetch team members
      .addCase(fetchTeamMembers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.teamMembers = action.payload
        state.loading = false
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // Fetch user relationships
      .addCase(fetchUserRelationships.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserRelationships.fulfilled, (state, action) => {
        state.relationships = action.payload
        state.loading = false
      })
      .addCase(fetchUserRelationships.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default usersSlice.reducer
