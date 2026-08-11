import { apiClient } from './apiClient'
import type { AdminUser } from '../types/admin'
import type { Task } from '../types/task'

class AdminService {
    async getUsers(): Promise<AdminUser[]> {
        const response = await apiClient.get<AdminUser[]>('/admin/users')
        return response.data
    }

    async setUserActive(userId: number, active: boolean): Promise<AdminUser> {
        const response = await apiClient.patch<AdminUser>(`/admin/users/${userId}/status`, { active })
        return response.data
    }

    async getAllTasks(): Promise<Task[]> {
        const response = await apiClient.get<Task[]>('/admin/tasks')
        return response.data
    }
}

export const adminService = new AdminService()