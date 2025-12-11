// src/api/versionService.ts
import api from './index'
import type { AppVersionRequest, AppVersionResponse } from './models/version'

export const VersionService = {
  async getAll(): Promise<AppVersionResponse[]> {
    const res = await api.get("/version/admin/all")
    return res.data
  },

  async getOne(platform: string): Promise<AppVersionResponse> {
    const res = await api.get(`/version/admin/${platform}`)
    return res.data
  },

  async create(data: AppVersionRequest): Promise<AppVersionResponse> {
    const res = await api.post("/version/admin", data)
    return res.data
  },

  async update(platform: string, data: AppVersionRequest): Promise<AppVersionResponse> {
    const res = await api.put(`/version/admin/${platform}`, data)
    return res.data
  },

  async delete(platform: string): Promise<void> {
    await api.delete(`/version/admin/${platform}`)
  }
}
