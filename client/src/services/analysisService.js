// import axios from 'axios'
// import { API_URL } from '../utils/constants'

// const getToken = () => localStorage.getItem('token')

// const detectTumour = async (mriImageId) => {
//   const response = await axios.post(
//     `${API_URL}/analysis/tumour-detection`,
//     { mriImageId },
//     { headers: { Authorization: `Bearer ${getToken()}` } }
//   )
//   return response.data.data
// }

// const detectBiomarkers = async (analysisId) => {
//   const response = await axios.post(
//     `${API_URL}/analysis/biomarker-detection`,
//     { analysisId },
//     { headers: { Authorization: `Bearer ${getToken()}` } }
//   )
//   return response.data.data
// }

// const getAnalysis = async (id) => {
//   const response = await axios.get(`${API_URL}/analysis/${id}`, {
//     headers: { Authorization: `Bearer ${getToken()}` },
//   })
//   return response.data.data
// }

// const getPatientAnalyses = async (patientId) => {
//   const response = await axios.get(`${API_URL}/analysis/patient/${patientId}`, {
//     headers: { Authorization: `Bearer ${getToken()}` },
//   })
//   return response.data.data
// }

// const analysisService = {
//   detectTumour,
//   detectBiomarkers,
//   getAnalysis,
//   getPatientAnalyses,
// }

// export default analysisService
import axios from 'axios'
import { API_URL } from '../utils/constants'

const getToken = () => localStorage.getItem('token')

const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
})

/* =====================
   Tumour Detection
===================== */
const detectTumour = async (mriImageId) => {
  const response = await axios.post(
    `${API_URL}/analysis/tumour-detection`,
    { mriImageId },
    { headers: authHeader() }
  )

  // MUST return analysis object
  return response.data.data
}

/* =====================
   Biomarker Detection
===================== */
const detectBiomarkers = async (payload) => {
  const response = await axios.post(
    `${API_URL}/analysis/biomarker-detection`,
    payload, // <-- DO NOT wrap again
    { headers: authHeader() }
  )

  return response.data.data
}

/* =====================
   Get Analysis
===================== */
const getAnalysis = async (id) => {
  const response = await axios.get(
    `${API_URL}/analysis/${id}`,
    { headers: authHeader() }
  )

  return response.data.data
}

/* =====================
   Get Patient Analyses
===================== */
const getPatientAnalyses = async (patientId) => {
  const response = await axios.get(
    `${API_URL}/analysis/patient/${patientId}`,
    { headers: authHeader() }
  )

  return response.data.data
}

const analysisService = {
  detectTumour,
  detectBiomarkers,
  getAnalysis,
  getPatientAnalyses,
}

export default analysisService
