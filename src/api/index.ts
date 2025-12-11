// src/api/index.ts
import axios from 'axios'

// Prefer environment override so the panel can point to any server without code changes.
const baseURL =
  import.meta.env.VITE_API_BASE_URL?.toString().trim() ||
  'https://mjavadserver.ir/api'

const api = axios.create({
  baseURL,
  timeout: 15000,
})

// Optional: if you add admin auth token later
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
