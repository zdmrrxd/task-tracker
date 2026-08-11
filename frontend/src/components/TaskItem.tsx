import { CalendarDays, Eye, Pencil, Trash2 } from 'lucide-react'
import type { Task } from '../types/task'
import { formatDueDate } from '../utils/taskHelpers'
import { useTranslation } from 'react-i18next'

interface TaskItemProps {
    task: Task
    deletingTaskId: number | null
    onEdit: (task: Task) => void
    onDelete: (task: Task) => void
    onView: (task: Task) => void
}

export function TaskItem({ task, deletingTaskId, onEdit, onDelete, onView }: TaskItemProps) {
    const { t } = useTranslation()

    // Status değerini seçili dile dönüştüren yardımcı fonksiyon
    const getStatusText = (status: string) => {
        const uppercaseStatus = (status || '').toUpperCase()
        switch (uppercaseStatus) {
            case 'COMPLETED':
            case 'DONE':
                return t('completed')
            case 'IN_PROGRESS':
                return t('inProgress')
            case 'UPCOMING':
                return t('upcoming')
            default:
                return status
        }
    }

    // Priority değerini seçili dile dönüştüren yardımcı fonksiyon
    const getPriorityText = (priority: string) => {
        const uppercasePriority = (priority || '').toUpperCase()
        switch (uppercasePriority) {
            case 'HIGH':
                return t('high')
            case 'MEDIUM':
                return t('medium')
            case 'LOW':
                return t('low')
            default:
                return priority
        }
    }

    return (
        <article className="flex flex-col gap-4 rounded-[14px] border border-[#24191B]/15 bg-[#FAF8F1] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
                <h3 className="font-serif text-[20px] text-[#24191B]">{task.title}</h3>
                <p className="mt-1.5 max-w-[650px] text-[10px] leading-[1.6] text-[#766D69]">
                    {task.description || t('noDescription')}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[9px] text-[#766D69]">
                    <CalendarDays size={13} strokeWidth={1.6} />
                    <span>
                        {task.dueDate
                            ? `${t('dueDate')}: ${formatDueDate(task.dueDate)}`
                            : t('noDueDate')}
                    </span>
                </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
                <span className="rounded-full border border-[#69ACC2]/40 bg-[#69ACC2]/10 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.8px] text-[#477F92]">
                    {getStatusText(task.status)}
                </span>
                <span className="rounded-full border border-[#60212E]/20 bg-[#60212E]/5 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.8px] text-[#60212E]">
                    {getPriorityText(task.priority)}
                </span>

                <button
                    type="button"
                    onClick={() => onView(task)}
                    className="flex h-8 items-center justify-center gap-1.5 rounded-[9px] border border-[#69ACC2]/30 bg-[#69ACC2]/10 px-3 text-[9px] font-semibold text-[#477F92] transition hover:bg-[#69ACC2] hover:text-white"
                >
                    <Eye size={13} strokeWidth={1.7} />
                    {t('details')}
                </button>

                <button
                    type="button"
                    onClick={() => onEdit(task)}
                    className="flex h-8 items-center justify-center gap-1.5 rounded-[9px] border border-[#24191B]/15 bg-white px-3 text-[9px] font-semibold text-[#5C5350] transition hover:border-[#69ACC2]/50 hover:text-[#477F92]"
                >
                    <Pencil size={13} strokeWidth={1.7} />
                    {t('edit')}
                </button>

                <button
                    type="button"
                    onClick={() => onDelete(task)}
                    disabled={deletingTaskId === task.id}
                    className="flex h-8 items-center justify-center gap-1.5 rounded-[9px] border border-[#60212E]/20 bg-[#60212E]/5 px-3 text-[9px] font-semibold text-[#60212E] transition hover:bg-[#60212E] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <Trash2 size={13} strokeWidth={1.7} />
                    {deletingTaskId === task.id ? t('deleting') : t('delete')}
                </button>
            </div>
        </article>
    )
}