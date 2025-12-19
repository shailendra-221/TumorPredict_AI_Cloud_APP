import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import patientReducer from './slices/patientSlice'
import mriReducer from './slices/mriSlice'
import analysisReducer from './slices/analysisSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patient: patientReducer,
    mri: mriReducer,
    analysis: analysisReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export default store