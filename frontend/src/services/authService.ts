import { apiClient } from './apiClient'
import type { AuthResponse, LoginCredentials, RegisterPayload, AuthUser } from '../types/auth'

class AuthService {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
        return response.data
    }

    async register(payload: RegisterPayload): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/register', payload)
        return response.data
    }

    async logout(): Promise<void> {
        await apiClient.post('/auth/logout')
    }

    async me(): Promise<AuthUser> {
        const response = await apiClient.get<AuthUser>('/auth/me')
        return response.data
    }
}

export const authService = new AuthService()