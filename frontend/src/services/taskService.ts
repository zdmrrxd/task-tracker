import axios from 'axios'
import type { NewTask, Task } from '../types/task'

const API_BASE_URL = 'http://localhost:8080/api/tasks'

export const taskService = {
    async getAll(): Promise<Task[]> {
        const response = await axios.get<Task[]>(API_BASE_URL)
        return response.data
    },

    async create(taskData: NewTask): Promise<Task> {
        const response = await axios.post<Task>(API_BASE_URL, taskData)
        return response.data
    },

    async update(id: number, taskData: NewTask): Promise<Task> {
        const response = await axios.put<Task>(
            `${API_BASE_URL}/${id}`,
            taskData
        )
        return response.data
    },

    async delete(id: number): Promise<void> {
        await axios.delete(`${API_BASE_URL}/${id}`)
    },
}