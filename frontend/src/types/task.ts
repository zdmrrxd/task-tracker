export interface Task {
    id: number
    title: string
    description: string
    status: string
    priority: string
    dueDate: string | null
}

export interface NewTask {
    title: string
    description: string
    status: string
    priority: string
    dueDate: string
}

export type ViewMode = 'dashboard' | 'tasks'
export type TabFilter = 'ALL' | 'IN_PROGRESS' | 'COMPLETED' | 'UPCOMING'
export type PriorityFilter = 'ALL' | 'LOW' | 'MEDIUM' | 'HIGH'
export type SortMode = 'DEFAULT' | 'PRIORITY_HIGH' | 'PRIORITY_LOW' | 'TITLE' | 'DATE'