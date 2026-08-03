import axios from 'axios'
import type { NewTask, Task } from '../types/task'

const API_BASE_URL = 'http://localhost:8080/api/tasks'

class TaskService {

    async getAll(): Promise<Task[]> {
        const response = await axios.get<Task[]>(API_BASE_URL)
        return response.data
    }

    async getById(id: number): Promise<Task> {
        const response = await axios.get<Task>(`${API_BASE_URL}/${id}`)
        return response.data
    }

    async create(task: NewTask): Promise<Task> {
        const response = await axios.post<Task>(API_BASE_URL, task)
        return response.data
    }

    async update(id: number, task: NewTask): Promise<Task> {
        const response = await axios.put<Task>(
            `${API_BASE_URL}/${id}`,
            task
        )
        return response.data
    }

    async save(task: NewTask, editingTaskId: number | null): Promise<Task> {
        if (editingTaskId !== null) {
            return this.update(editingTaskId, task)
        }

        return this.create(task)
    }

    async delete(id: number): Promise<void> {
        await axios.delete(`${API_BASE_URL}/${id}`)
    }
}

export const taskService = new TaskService()