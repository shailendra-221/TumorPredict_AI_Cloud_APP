import axios from 'axios'
import { API_URL } from '../utils/constants'

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData)
  if (response.data.data.token) {
    localStorage.setItem('token', response.data.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.data.user))
  }
  return response.data.data
}

const login = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/login`, userData)
  if (response.data.data.token) {
    localStorage.setItem('token', response.data.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.data.user))
  }
  return response.data.data
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

const authService = { register, login, logout }
export default authService