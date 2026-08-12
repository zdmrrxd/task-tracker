import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { authService } from '../services/authService'
import { tokenStorage } from '../services/apiClient'
import type { AuthUser, LoginCredentials } from '../types/auth'

interface AuthContextValue {
    user: AuthUser | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (credentials: LoginCredentials) => Promise<AuthUser>
    logout: () => void
    /** Used right after a successful register call, which already returns a user + token. */
    setSession: (user: AuthUser) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const logout = useCallback(() => {
        tokenStorage.clear()
        setUser(null)
        // Fire-and-forget: there's no server session to invalidate for a stateless
        // JWT, this just lets the backend know, but we don't block the UI on it.
        authService.logout().catch(() => undefined)
    }, [])

    // On first load, if a token is already stored, validate it against the backend
    // and restore the session instead of forcing the user to log in again.
    useEffect(() => {
        const token = tokenStorage.get()
        if (!token) {
            setIsLoading(false)
            return
        }

        authService
            .me()
            .then(setUser)
            .catch(() => {
                tokenStorage.clear()
                setUser(null)
            })
            .finally(() => setIsLoading(false))
    }, [])

    // If any API call comes back 401, the interceptor clears the token and fires
    // this event - keep the React state in sync so protected routes redirect.
    useEffect(() => {
        const handleUnauthorized = () => setUser(null)
        window.addEventListener('auth:unauthorized', handleUnauthorized)
        return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }, [])

    const login = useCallback(async (credentials: LoginCredentials) => {
        const { token, user: loggedInUser } = await authService.login(credentials)
        tokenStorage.set(token)
        setUser(loggedInUser)
        return loggedInUser
    }, [])

    const setSession = useCallback((sessionUser: AuthUser) => {
        setUser(sessionUser)
    }, [])

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            isAuthenticated: user !== null,
            isLoading,
            login,
            logout,
            setSession,
        }),
        [user, isLoading, login, logout, setSession]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}