export interface Task {
    id: number
    baslik: string
    aciklama: string
    durum: string
    oncelik: string
    sonTarih: string | null
}

export interface NewTask {
    baslik: string
    aciklama: string
    durum: string
    oncelik: string
    sonTarih: string
}

export type ViewMode = 'dashboard' | 'tasks'
export type TabFilter = 'ALL' | 'IN_PROGRESS' | 'COMPLETED' | 'UPCOMING'
export type PriorityFilter = 'ALL' | 'LOW' | 'MEDIUM' | 'HIGH'
export type SortMode = 'DEFAULT' | 'PRIORITY_HIGH' | 'PRIORITY_LOW' | 'TITLE' | 'DATE'