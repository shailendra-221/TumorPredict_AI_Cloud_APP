import axios from 'axios'
import { API_URL } from '../utils/constants.js'

const getToken = () => localStorage.getItem('token')

const uploadMRI = async (formData, onUploadProgress) => {
  const response = await axios.post(`${API_URL}/mri/upload`, formData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  })
  return response.data.data
}

const getPatientMRIs = async (patientId) => {
  const response = await axios.get(`${API_URL}/mri/patient/${patientId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  return response.data.data
}

const getMRI = async (id) => {
  const response = await axios.get(`${API_URL}/mri/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  return response.data.data
}

const deleteMRI = async (id) => {
  const response = await axios.delete(`${API_URL}/mri/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  return response.data
}

const mriService = { uploadMRI, getPatientMRIs, getMRI, deleteMRI }
export default mriService;
