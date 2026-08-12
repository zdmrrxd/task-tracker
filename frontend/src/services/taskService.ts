import { apiClient } from './apiClient'
import type { NewTask, Task } from '../types/task'

class TaskService {

    async getAll(): Promise<Task[]> {
        const response = await apiClient.get<Task[]>('/tasks')
        return response.data
    }

    async getById(id: number): Promise<Task> {
        const response = await apiClient.get<Task>(`/tasks/${id}`)
        return response.data
    }

    async create(task: NewTask): Promise<Task> {
        const response = await apiClient.post<Task>('/tasks', task)
        return response.data
    }

    async update(id: number, task: NewTask): Promise<Task> {
        const response = await apiClient.put<Task>(`/tasks/${id}`, task)
        return response.data
    }

    async save(task: NewTask, editingTaskId: number | null): Promise<Task> {
        if (editingTaskId !== null) {
            return this.update(editingTaskId, task)
        }

        return this.create(task)
    }

    async delete(id: number): Promise<void> {
        await apiClient.delete(`/tasks/${id}`)
    }
}

export const taskService = new TaskService()