import { configureStore } from "@reduxjs/toolkit"
import usersReducer from "./features/users/usersSlice"
import questionsReducer from "./features/questions/questionsSlice"
import appraisalsReducer from "./features/appraisals/appraisalsSlice"

export const store = configureStore({
  reducer: {
    users: usersReducer,
    questions: questionsReducer,
    appraisals: appraisalsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
