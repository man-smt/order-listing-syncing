import axios from 'axios'

export const API_BASE_URL = 'http://localhost:8080/api'

export const fetchData = async () => {
  const response = await axios.get(`${API_BASE_URL}/orders`)
  return response?.data
}

export const syncData = async () => {
  const response = await axios.post(`${API_BASE_URL}/orders/sync`)
  return response?.data
}
