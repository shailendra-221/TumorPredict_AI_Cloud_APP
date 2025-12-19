// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import analysisService from '../../services/analysisService'

// const initialState = {
//   analyses: [],
//   currentAnalysis: null,
//   biomarkers: [],
//   isAnalyzing: false,
//   isLoading: false,
//   isSuccess: false,
//   isError: false,
//   message: '',
// }

// export const detectTumour = createAsyncThunk(
//   'analysis/detectTumour',
//   async (mriImageId, thunkAPI) => {
//     try {
//       return await analysisService.detectTumour(mriImageId)
//     } catch (error) {
//       const message = error.response?.data?.message || error.message
//       return thunkAPI.rejectWithValue(message)
//     }
//   }
// )

// export const detectBiomarkers = createAsyncThunk(
//   'analysis/detectBiomarkers',
//   async (analysisId, thunkAPI) => {
//     try {
//       return await analysisService.detectBiomarkers(analysisId)
//     } catch (error) {
//       const message = error.response?.data?.message || error.message
//       return thunkAPI.rejectWithValue(message)
//     }
//   }
// )

// export const getAnalysis = createAsyncThunk(
//   'analysis/get',
//   async (id, thunkAPI) => {
//     try {
//       return await analysisService.getAnalysis(id)
//     } catch (error) {
//       const message = error.response?.data?.message || error.message
//       return thunkAPI.rejectWithValue(message)
//     }
//   }
// )

// export const getPatientAnalyses = createAsyncThunk(
//   'analysis/getPatient',
//   async (patientId, thunkAPI) => {
//     try {
//       return await analysisService.getPatientAnalyses(patientId)
//     } catch (error) {
//       const message = error.response?.data?.message || error.message
//       return thunkAPI.rejectWithValue(message)
//     }
//   }
// )

// export const analysisSlice = createSlice({
//   name: 'analysis',
//   initialState,
//   reducers: {
//     reset: (state) => {
//       state.isAnalyzing = false
//       state.isLoading = false
//       state.isSuccess = false
//       state.isError = false
//       state.message = ''
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(detectTumour.pending, (state) => {
//         state.isAnalyzing = true
//       })
//       .addCase(detectTumour.fulfilled, (state, action) => {
//         state.isAnalyzing = false
//         state.isSuccess = true
//         state.currentAnalysis = action.payload
//         state.analyses.unshift(action.payload)
//       })
//       .addCase(detectTumour.rejected, (state, action) => {
//         state.isAnalyzing = false
//         state.isError = true
//         state.message = action.payload
//       })
//       .addCase(detectBiomarkers.fulfilled, (state, action) => {
//         state.biomarkers = action.payload
//       })
//       .addCase(getAnalysis.fulfilled, (state, action) => {
//         state.currentAnalysis = action.payload
//       })
//       .addCase(getPatientAnalyses.pending, (state) => {
//         state.isLoading = true
//       })
//       .addCase(getPatientAnalyses.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.analyses = action.payload
//       })
//   },
// })

// export const { reset } = analysisSlice.actions
// export default analysisSlice.reducer
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import analysisService from '../../services/analysisService'

const initialState = {
  analyses: [],
  currentAnalysis: null,
  currentAnalysisId: null,
  biomarkers: [],
  isAnalyzing: false,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
}

/* ===========================
   THUNKS
=========================== */

// Tumour Detection
export const detectTumour = createAsyncThunk(
  'analysis/detectTumour',
  async (mriImageId, thunkAPI) => {
    try {
      return await analysisService.detectTumour(mriImageId)
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      )
    }
  }
)

// Biomarker Detection
export const detectBiomarkers = createAsyncThunk(
  'analysis/detectBiomarkers',
  async ({ analysisId }, thunkAPI) => {
    try {
      return await analysisService.detectBiomarkers({ analysisId })
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      )
    }
  }
)

// Get single analysis
export const getAnalysis = createAsyncThunk(
  'analysis/get',
  async (id, thunkAPI) => {
    try {
      return await analysisService.getAnalysis(id)
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      )
    }
  }
)

// Get patient analyses
export const getPatientAnalyses = createAsyncThunk(
  'analysis/getPatient',
  async (patientId, thunkAPI) => {
    try {
      return await analysisService.getPatientAnalyses(patientId)
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      )
    }
  }
)

/* ===========================
   SLICE
=========================== */

export const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    reset: (state) => {
      state.isAnalyzing = false
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder

      /* ---- Tumour Detection ---- */
      .addCase(detectTumour.pending, (state) => {
        state.isAnalyzing = true
        state.isError = false
      })
      .addCase(detectTumour.fulfilled, (state, action) => {
        state.isAnalyzing = false
        state.isSuccess = true
        state.currentAnalysis = action.payload
        state.currentAnalysisId = action.payload._id
        state.analyses.unshift(action.payload)
      })
      .addCase(detectTumour.rejected, (state, action) => {
        state.isAnalyzing = false
        state.isError = true
        state.message = action.payload
      })

      /* ---- Biomarker Detection ---- */
      .addCase(detectBiomarkers.pending, (state) => {
        state.isAnalyzing = true
        state.isError = false
      })
      .addCase(detectBiomarkers.fulfilled, (state, action) => {
        state.isAnalyzing = false
        state.isSuccess = true
        state.biomarkers = action.payload
      })
      .addCase(detectBiomarkers.rejected, (state, action) => {
        state.isAnalyzing = false
        state.isError = true
        state.message = action.payload
      })

      /* ---- Get Analysis ---- */
      .addCase(getAnalysis.fulfilled, (state, action) => {
        state.currentAnalysis = action.payload
        state.currentAnalysisId = action.payload._id
      })

      /* ---- Get Patient Analyses ---- */
      .addCase(getPatientAnalyses.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getPatientAnalyses.fulfilled, (state, action) => {
        state.isLoading = false
        state.analyses = action.payload
      })
      .addCase(getPatientAnalyses.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = analysisSlice.actions
export default analysisSlice.reducer

