import type { ApiClient } from './client'
import type { ApiResponse } from '@game/shared'

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest extends LoginRequest {
  email: string
  displayName?: string
}

export interface LoginResponse {
  user: {
    id: string
    username: string
    email: string
    displayName?: string
    avatarUrl?: string
    isAdmin: boolean
  }
  token: string
  expiresIn: number
}

export interface User {
  id: string
  username: string
  email: string
  displayName?: string
  avatarUrl?: string
  isAdmin: boolean
  createdAt: string
  updatedAt: string
}

export interface UpdateUserRequest {
  displayName?: string
  avatarUrl?: string
}

export interface AuthApi {
  login(data: LoginRequest): Promise<ApiResponse<LoginResponse>>
  register(data: RegisterRequest): Promise<ApiResponse<LoginResponse>>
  logout(data: { token: string }): Promise<ApiResponse>
  me(): Promise<ApiResponse<User>>
  update(data: UpdateUserRequest): Promise<ApiResponse<User>>
  refresh(token: string): Promise<ApiResponse<{ token: string; expiresIn: number }>>
}

export function auth(client: ApiClient): AuthApi {
  return {
    async login(data) {
      return client.post('/v1/auth/login', data)
    },

    async register(data) {
      return client.post('/v1/auth/register', data)
    },

    async logout(data) {
      return client.post('/v1/auth/logout', data)
    },

    async me() {
      return client.get('/v1/auth/me')
    },

    async update(data) {
      return client.put('/v1/auth/update', data)
    },

    async refresh(token) {
      return client.post('/v1/auth/refresh', { token })
    },
  }
}

export default auth