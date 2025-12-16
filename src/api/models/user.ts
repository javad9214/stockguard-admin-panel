export type UserRole = 'USER' | 'ADMIN' | 'PREMIUM_USER'

export interface AdminUserDTO {
  id: number
  phoneNumber: string
  fullName: string
  profileImageUrl?: string
  role: UserRole
  enabled: boolean
  accountLocked: boolean
  failedLoginAttempts: number
  deviceToken?: string
  deviceId?: string
  createdAt: string
  updatedAt: string
  lastLogin?: string
  accountLockedAt?: string
}

export interface AdminUserListResponse {
  users: AdminUserDTO[]
  currentPage: number
  totalPages: number
  totalElements: number
  pageSize: number
}

export interface UserStatistics {
  totalUsers: number
  activeUsers: number
  lockedUsers: number
  disabledUsers: number
  newUsersToday: number
  newUsersThisWeek: number
  newUsersThisMonth: number
}

export interface CreateUserRequest {
  phoneNumber: string
  password: string
  fullName: string
  role?: UserRole
  enabled?: boolean
}

export interface UpdateUserRequest {
  fullName?: string
  role?: UserRole
  enabled?: boolean
  profileImageUrl?: string
}

export interface ResetPasswordRequest {
  newPassword: string
}