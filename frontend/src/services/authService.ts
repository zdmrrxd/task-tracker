import { apiClient } from './apiClient'
import { encryptWithPublicKey } from '../utils/crypto'
import type { AuthResponse, LoginCredentials, RegisterPayload, AuthUser } from '../types/auth'

class AuthService {
    private cachedPublicKey: string | null = null
    private publicKeyPromise: Promise<string> | null = null

    private async getPublicKey(): Promise<string> {
        if (this.cachedPublicKey) {
            return this.cachedPublicKey
        }

        if (!this.publicKeyPromise) {
            this.publicKeyPromise = apiClient
                .get<{ publicKey: string }>('/auth/public-key')
                .then((response) => {
                    this.cachedPublicKey = response.data.publicKey
                    return this.cachedPublicKey
                })
        }

        return this.publicKeyPromise
    }

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const publicKey = await this.getPublicKey()
        const encryptedPassword = await encryptWithPublicKey(credentials.password, publicKey)

        const response = await apiClient.post<AuthResponse>('/auth/login', {
            usernameOrEmail: credentials.usernameOrEmail,
            password: encryptedPassword,
        })
        return response.data
    }

    async register(payload: RegisterPayload): Promise<AuthResponse> {
        const publicKey = await this.getPublicKey()
        const encryptedPassword = await encryptWithPublicKey(payload.password, publicKey)

        const response = await apiClient.post<AuthResponse>('/auth/register', {
            username: payload.username,
            email: payload.email,
            password: encryptedPassword,
        })
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