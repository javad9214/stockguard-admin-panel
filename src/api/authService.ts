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
    // Adjust endpoint/body keys if your server differs.
    const res = await api.post<LoginResponse>('/auth/login', payload)
    return res.data.token
  },
}

