import api from './index'

interface LoginPayload {
  phoneNumber: string
  password: string
}

interface LoginResponse {
  token: string
}

// Auth service for admin login.
export const AuthService = {
  async login(payload: LoginPayload): Promise<string> {
    try {
      const res = await api.post<LoginResponse>('/auth/login', payload)
      return res.data.token
    } catch (error: any) {
      // Log full error for debugging
      console.error('Login error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url
      })
      
      // Throw specific error message
      if (error.response) {
        const status = error.response.status
        const msg = error.response.data?.message || error.response.data
        
        if (status === 401 || status === 403) {
          throw new Error('Invalid credentials')
        }
        if (status === 404) {
          throw new Error('Login endpoint not found. Check API URL')
        }
        throw new Error(`Server error: ${msg}`)
      }
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Check server connection')
      }
      
      throw new Error(`Network error: ${error.message}`)
    }
  },
}

