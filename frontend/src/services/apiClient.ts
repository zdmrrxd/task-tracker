import axios from 'axios'

export const API_BASE_URL = 'http://localhost:8081/api'

const TOKEN_STORAGE_KEY = 'tasktracker_token'

export const tokenStorage = {
    get(): string | null {
        return localStorage.getItem(TOKEN_STORAGE_KEY)
    },
    set(token: string) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token)
    },
    clear() {
        localStorage.removeItem(TOKEN_STORAGE_KEY)
    },
}

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
})

// Attach the JWT (if present) to every outgoing request.
apiClient.interceptors.request.use((config) => {
    const token = tokenStorage.get()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// A 401 means the token is missing/expired/invalid: clear it and force a fresh login.
// We dispatch a custom event instead of importing the router here to avoid a
// circular dependency between the api layer and the app's routing/auth context.
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            tokenStorage.clear()
            window.dispatchEvent(new CustomEvent('auth:unauthorized'))
        }
        return Promise.reject(error)
    }
)