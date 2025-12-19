import axios from 'axios'
import { API_URL } from '../utils/constants'

const getToken = () => localStorage.getItem('token')

const getPatients = async (params = {}) => {
  const { page = 1, limit = 10, search = '' } = params
  const response = await axios.get(`${API_URL}/patients`, {
    params: { page, limit, search },
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  return response.data
}

const getPatient = async (id) => {
  const response = await axios.get(`${API_URL}/patients/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  return response.data.data
}

const createPatient = async (patientData) => {
  const response = await axios.post(`${API_URL}/patients`, patientData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  return response.data.data
}

const updatePatient = async (id, patientData) => {
  const response = await axios.put(`${API_URL}/patients/${id}`, patientData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  return response.data.data
}

const deletePatient = async (id) => {
  const response = await axios.delete(`${API_URL}/patients/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  return response.data
}

const patientService = {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
}

export default patientService