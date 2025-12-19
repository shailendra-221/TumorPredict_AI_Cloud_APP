import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import mriService from '../../services/mriService'

const initialState = {
  mriImages: [],
  currentMRI: null,
  uploadProgress: 0,
  isLoading: false,
  isUploading: false,
  isSuccess: false,
  isError: false,
  message: '',
}

export const uploadMRI = createAsyncThunk(
  'mri/upload',
  async (formData, thunkAPI) => {
    try {
      return await mriService.uploadMRI(formData, (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        thunkAPI.dispatch(setUploadProgress(progress))
      })
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const getPatientMRIs = createAsyncThunk(
  'mri/getPatient',
  async (patientId, thunkAPI) => {
    try {
      return await mriService.getPatientMRIs(patientId)
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const getMRI = createAsyncThunk(
  'mri/get',
  async (id, thunkAPI) => {
    try {
      return await mriService.getMRI(id)
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const deleteMRI = createAsyncThunk(
  'mri/delete',
  async (id, thunkAPI) => {
    try {
      await mriService.deleteMRI(id)
      return id
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const mriSlice = createSlice({
  name: 'mri',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isUploading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
      state.uploadProgress = 0
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadMRI.pending, (state) => {
        state.isUploading = true
      })
      .addCase(uploadMRI.fulfilled, (state, action) => {
        state.isUploading = false
        state.isSuccess = true
        state.mriImages.unshift(action.payload)
        state.uploadProgress = 0
      })
      .addCase(uploadMRI.rejected, (state, action) => {
        state.isUploading = false
        state.isError = true
        state.message = action.payload
        state.uploadProgress = 0
      })
      .addCase(getPatientMRIs.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getPatientMRIs.fulfilled, (state, action) => {
        state.isLoading = false
        state.mriImages = action.payload
      })
      .addCase(getPatientMRIs.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getMRI.fulfilled, (state, action) => {
        state.currentMRI = action.payload
      })
      .addCase(deleteMRI.fulfilled, (state, action) => {
        state.mriImages = state.mriImages.filter((m) => m._id !== action.payload)
      })
  },
})

export const { reset, setUploadProgress } = mriSlice.actions
export default mriSlice.reducer
