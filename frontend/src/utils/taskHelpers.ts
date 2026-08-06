export function normalizeStatus(status?: string): string {
    const value = (status || '').trim().toUpperCase()

    if (['COMPLETED', 'DONE'].includes(value)) {
        return 'COMPLETED'
    }

    if (['IN_PROGRESS', 'IN PROGRESS'].includes(value)) {
        return 'IN_PROGRESS'
    }

    return value
}

export function getGreeting(t: (key: string) => string): string {
    const hour = new Date().getHours()

    if (hour >= 5 && hour < 12) {
        return t('goodMorning')
    }

    if (hour >= 12 && hour < 18) {
        return t('goodAfternoon')
    }

    return t('goodEvening')
}

export function formatDueDate(date: string | null): string {
    if (!date) return 'No due date'

    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(`${date}T00:00:00`))
}

export const priorityWeight: Record<string, number> = {
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
}