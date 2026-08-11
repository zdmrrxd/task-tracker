export type Role = 'USER' | 'ADMIN'

export interface AuthUser {
    id: number
    username: string
    email: string
    role: Role
    active: boolean
}

export interface LoginCredentials {
    usernameOrEmail: string
    password: string
}

export interface RegisterPayload {
    username: string
    email: string
    password: string
}

export interface AuthResponse {
    token: string
    user: AuthUser
}