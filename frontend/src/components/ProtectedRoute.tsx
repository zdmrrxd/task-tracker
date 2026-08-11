import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { Role } from '../types/auth'

interface ProtectedRouteProps {
    children: ReactNode
    /** If provided, only users whose role is in this list may view the route. */
    allowedRoles?: Role[]
}

/**
 * Guards a route on the client side:
 *  - not logged in -> redirect to /login
 *  - logged in but wrong role -> redirect to /unauthorized
 *
 * This is a UX convenience only. The backend enforces the same rules
 * independently on every request, so this guard can never be relied upon
 * as the actual security boundary.
 */
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, user } = useAuth()
    const location = useLocation()

    if (isLoading) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-[#FAF8F1] text-[#766D69]">
                <p className="text-xs uppercase tracking-[1.5px]">Loading…</p>
            </div>
        )
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace state={{ from: location }} />
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />
    }

    return <>{children}</>
}