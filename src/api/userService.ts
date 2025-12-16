import api from './index'
import type {
  AdminUserDTO,
  AdminUserListResponse,
  UserStatistics,
  CreateUserRequest,
  UpdateUserRequest,
  ResetPasswordRequest
} from '@/api/models/user'

export const UserService = {
  async getAll(params: {
    page?: number
    size?: number
    search?: string
    enabled?: boolean
    locked?: boolean
    sortBy?: string
    sortDir?: string
  }): Promise<AdminUserListResponse> {
    const res = await api.get('/admin/users', { params })
    return res.data
  },

  async getById(id: number): Promise<AdminUserDTO> {
    const res = await api.get(`/admin/users/${id}`)
    return res.data
  },

  async create(data: CreateUserRequest): Promise<AdminUserDTO> {
    const res = await api.post('/admin/users', data)
    return res.data
  },

  async update(id: number, data: UpdateUserRequest): Promise<AdminUserDTO> {
    const res = await api.put(`/admin/users/${id}`, data)
    return res.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/admin/users/${id}`)
  },

  async toggleStatus(id: number): Promise<AdminUserDTO> {
    const res = await api.post(`/admin/users/${id}/toggle-status`)
    return res.data
  },

  async unlock(id: number): Promise<AdminUserDTO> {
    const res = await api.post(`/admin/users/${id}/unlock`)
    return res.data
  },

  async resetPassword(id: number, data: ResetPasswordRequest): Promise<void> {
    await api.post(`/admin/users/${id}/reset-password`, data)
  },

  async changeRole(id: number, role: string): Promise<AdminUserDTO> {
    const res = await api.post(`/admin/users/${id}/change-role`, null, {
      params: { role }
    })
    return res.data
  },

  async getStatistics(): Promise<UserStatistics> {
    const res = await api.get('/admin/users/statistics')
    return res.data
  }
}