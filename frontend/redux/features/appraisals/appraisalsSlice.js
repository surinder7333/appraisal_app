import { createSlice } from "@reduxjs/toolkit"
import {
  fetchAppraisals,
  fetchAppraisalById,
  createAppraisal,
  fetchManagerAppraisals,
  fetchUserAppraisals,
} from "./appraisalsThunks"

const initialState = {
  appraisals: [],
  appraisal: null,
  managerAppraisals: [],
  userAppraisals: [],
  loading: false,
  error: null,
}

const appraisalsSlice = createSlice({
  name: "appraisals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all appraisals
      .addCase(fetchAppraisals.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAppraisals.fulfilled, (state, action) => {
        state.appraisals = action.payload
        state.loading = false
      })
      .addCase(fetchAppraisals.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // Fetch appraisal by ID
      .addCase(fetchAppraisalById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAppraisalById.fulfilled, (state, action) => {
        state.appraisal = action.payload
        state.loading = false
      })
      .addCase(fetchAppraisalById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // Create appraisal
      .addCase(createAppraisal.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createAppraisal.fulfilled, (state, action) => {
        state.appraisals.push(action.payload)
        state.loading = false
      })
      .addCase(createAppraisal.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // Fetch manager appraisals
      .addCase(fetchManagerAppraisals.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchManagerAppraisals.fulfilled, (state, action) => {
        state.managerAppraisals = action.payload
        state.loading = false
      })
      .addCase(fetchManagerAppraisals.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // Fetch user appraisals
      .addCase(fetchUserAppraisals.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserAppraisals.fulfilled, (state, action) => {
        state.userAppraisals = action.payload
        state.loading = false
      })
      .addCase(fetchUserAppraisals.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default appraisalsSlice.reducer
