// src/api/models/version.ts
export type Platform = 'ANDROID' | 'IOS'

// Payload used when creating or updating an app version.
export interface AppVersionRequest {
  platform: Platform
  minVersionCode: number
  lastVersionCode: number
  minVersionName: string
  lastVersionName: string
  updateUrl: string
  releaseNotes?: string
  enabled: boolean
}

// Response shape returned by the backend.
export interface AppVersionResponse extends AppVersionRequest {
  id: number
  createdAt: string
}
