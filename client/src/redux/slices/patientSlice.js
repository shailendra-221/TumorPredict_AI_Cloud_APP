import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import patientService from '../../services/patientService'

const initialState = {
  patients: [],
  currentPatient: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
}

export const getPatients = createAsyncThunk(
  'patients/getAll',
  async (params, thunkAPI) => {
    try {
      return await patientService.getPatients(params)
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const getPatient = createAsyncThunk(
  'patients/get',
  async (id, thunkAPI) => {
    try {
      return await patientService.getPatient(id)
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const createPatient = createAsyncThunk(
  'patients/create',
  async (patientData, thunkAPI) => {
    try {
      return await patientService.createPatient(patientData)
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const updatePatient = createAsyncThunk(
  'patients/update',
  async ({ id, patientData }, thunkAPI) => {
    try {
      return await patientService.updatePatient(id, patientData)
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const deletePatient = createAsyncThunk(
  'patients/delete',
  async (id, thunkAPI) => {
    try {
      await patientService.deletePatient(id)
      return id
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
    clearCurrentPatient: (state) => {
      state.currentPatient = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPatients.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getPatients.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.patients = action.payload.data
        state.pagination = action.payload.pagination
      })
      .addCase(getPatients.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getPatient.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getPatient.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentPatient = action.payload
      })
      .addCase(getPatient.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.isSuccess = true
        state.patients.unshift(action.payload)
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.isSuccess = true
        state.currentPatient = action.payload
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.isSuccess = true
        state.patients = state.patients.filter((p) => p._id !== action.payload)
      })
  },
})

export const { reset, clearCurrentPatient } = patientSlice.actions
export default patientSlice.reducer
