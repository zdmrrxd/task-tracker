import { CalendarDays, Eye, Pencil, Trash2 } from 'lucide-react'
import type { Task } from '../types/task'
import { formatDueDate } from '../utils/taskHelpers'

interface TaskItemProps {
    task: Task
    deletingTaskId: number | null
    onEdit: (task: Task) => void
    onDelete: (task: Task) => void
    onView: (task: Task) => void
}

export function TaskItem({ task, deletingTaskId, onEdit, onDelete, onView }: TaskItemProps)  {
    console.log("BASLIK =", task.baslik)
    return (
        <article className="flex flex-col gap-4 rounded-[14px] border border-[#24191B]/15 bg-[#FAF8F1] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
                <h3 className="font-serif text-[20px] text-[#24191B]">{task.baslik}</h3>
                <p className="mt-1.5 max-w-[650px] text-[10px] leading-[1.6] text-[#766D69]">
                    {task.aciklama || 'No description'}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[9px] text-[#766D69]">
                    <CalendarDays size={13} strokeWidth={1.6} />
                    <span>{task.sonTarih ? `Due ${formatDueDate(task.sonTarih)}` : 'No due date'}</span>
                </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
        <span className="rounded-full border border-[#69ACC2]/40 bg-[#69ACC2]/10 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.8px] text-[#477F92]">
          {task.durum}
        </span>
                <span className="rounded-full border border-[#60212E]/20 bg-[#60212E]/5 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.8px] text-[#60212E]">
          {task.oncelik}
        </span>

                <button
                    type="button"
                    onClick={() => onView(task)}
                    className="flex h-8 items-center justify-center gap-1.5 rounded-[9px] border border-[#69ACC2]/30 bg-[#69ACC2]/10 px-3 text-[9px] font-semibold text-[#477F92] transition hover:bg-[#69ACC2] hover:text-white"
                >
                    <Eye size={13} strokeWidth={1.7} />
                    Details
                </button>

                <button
                    type="button"
                    onClick={() => onEdit(task)}
                    className="flex h-8 items-center justify-center gap-1.5 rounded-[9px] border border-[#24191B]/15 bg-white px-3 text-[9px] font-semibold text-[#5C5350] transition hover:border-[#69ACC2]/50 hover:text-[#477F92]"
                >
                    <Pencil size={13} strokeWidth={1.7} />
                    Edit
                </button>

                <button
                    type="button"
                    onClick={() => onDelete(task)}
                    disabled={deletingTaskId === task.id}
                    className="flex h-8 items-center justify-center gap-1.5 rounded-[9px] border border-[#60212E]/20 bg-[#60212E]/5 px-3 text-[9px] font-semibold text-[#60212E] transition hover:bg-[#60212E] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <Trash2 size={13} strokeWidth={1.7} />
                    {deletingTaskId === task.id ? 'Deleting...' : 'Delete'}
                </button>
            </div>
        </article>
    )
}