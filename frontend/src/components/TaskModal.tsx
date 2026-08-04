import type { FormEvent } from 'react'
import { CalendarDays, Pencil, Plus, X } from 'lucide-react'
import type { NewTask } from '../types/task'
import { useLanguage } from '../hooks/useLanguage'

interface TaskModalProps {
    isModalOpen: boolean
    editingTaskId: number | null
    newTask: NewTask
    setNewTask: React.Dispatch<React.SetStateAction<NewTask>>
    errors: { title: string; description: string }
    isSaving: boolean
    today: string
    onClose: () => void
    onSave: (e: FormEvent<HTMLFormElement>) => void
}

export function TaskModal({
                              isModalOpen,
                              editingTaskId,
                              newTask,
                              setNewTask,
                              errors,
                              isSaving,
                              today,
                              onClose,
                              onSave,
                          }: TaskModalProps) {
    const { t } = useLanguage()

    if (!isModalOpen) return null

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#24191B]/45 p-4 backdrop-blur-[3px]"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose()
                }
            }}
        >
            <div className="w-full max-w-[560px] overflow-hidden rounded-[22px] border border-[#24191B]/15 bg-[#FAF8F1] shadow-[0_30px_80px_rgba(36,25,27,0.25)]">
                <div className="flex items-start justify-between border-b border-[#24191B]/15 px-6 py-5">
                    <div>
                        <p className="mb-2 text-[8px] font-bold uppercase tracking-[1.8px] text-[#60212E]">
                            {editingTaskId !== null ? t.editTask?.toUpperCase() : t.newTask?.toUpperCase()}
                        </p>
                        <h2 className="font-serif text-[30px] font-normal tracking-[-0.8px] text-[#24191B]">
                            {editingTaskId !== null ? t.editTask : t.createTask}
                            <span className="text-[#69ACC2]">.</span>
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#24191B]/15 bg-white text-[#766D69] transition hover:text-[#60212E]"
                    >
                        <X size={17} />
                    </button>
                </div>

                <form onSubmit={onSave} className="space-y-5 p-6">
                    <div>
                        <label
                            htmlFor="task-title"
                            className="mb-2 block text-[9px] font-bold uppercase tracking-[1px] text-[#60212E]"
                        >
                            {t.title} *
                        </label>
                        <input
                            id="task-title"
                            type="text"
                            value={newTask.title}
                            onChange={(event) =>
                                setNewTask({ ...newTask, title: event.target.value })
                            }
                            placeholder={t.taskPlaceholder}
                            className="h-[48px] w-full rounded-[12px] border border-[#24191B]/15 bg-white px-4 text-[12px] text-[#24191B] outline-none placeholder:text-[#9B928D] focus:border-[#69ACC2] focus:ring-[3px] focus:ring-[#69ACC2]/10"
                        />
                        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
                    </div>

                    <div>
                        <label
                            htmlFor="task-description"
                            className="mb-2 block text-[9px] font-bold uppercase tracking-[1px] text-[#60212E]"
                        >
                            {t.description}
                        </label>
                        <textarea
                            id="task-description"
                            rows={4}
                            value={newTask.description}
                            onChange={(event) =>
                                setNewTask({ ...newTask, description: event.target.value })
                            }
                            placeholder={t.descriptionPlaceholder}
                            className="w-full resize-none rounded-[12px] border border-[#24191B]/15 bg-white p-4 text-[12px] leading-[1.6] text-[#24191B] outline-none placeholder:text-[#9B928D] focus:border-[#69ACC2] focus:ring-[3px] focus:ring-[#69ACC2]/10"
                        />
                        {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
                    </div>

                    <div>
                        <label
                            htmlFor="task-due-date"
                            className="mb-2 block text-[9px] font-bold uppercase tracking-[1px] text-[#60212E]"
                        >
                            {t.dueDate}
                        </label>
                        <div className="relative">
                            <CalendarDays
                                size={16}
                                strokeWidth={1.6}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#766D69]"
                            />
                            <input
                                id="task-due-date"
                                type="date"
                                min={
                                    editingTaskId !== null && newTask.dueDate && newTask.dueDate < today
                                        ? newTask.dueDate
                                        : today
                                }
                                value={newTask.dueDate}
                                onChange={(event) =>
                                    setNewTask({ ...newTask, dueDate: event.target.value })
                                }
                                className="h-[48px] w-full rounded-[12px] border border-[#24191B]/15 bg-white pl-11 pr-4 text-[11px] text-[#24191B] outline-none focus:border-[#69ACC2] focus:ring-[3px] focus:ring-[#69ACC2]/10"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="task-status"
                                className="mb-2 block text-[9px] font-bold uppercase tracking-[1px] text-[#60212E]"
                            >
                                {t.status}
                            </label>
                            <select
                                id="task-status"
                                value={newTask.status}
                                onChange={(event) =>
                                    setNewTask({ ...newTask, status: event.target.value })
                                }
                                className="h-[48px] w-full rounded-[12px] border border-[#24191B]/15 bg-white px-4 text-[11px] text-[#24191B] outline-none focus:border-[#69ACC2]"
                            >
                                <option value="IN_PROGRESS">{t.inProgress}</option>
                                <option value="COMPLETED">{t.completed}</option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="task-priority"
                                className="mb-2 block text-[9px] font-bold uppercase tracking-[1px] text-[#60212E]"
                            >
                                {t.priority}
                            </label>
                            <select
                                id="task-priority"
                                value={newTask.priority}
                                onChange={(event) =>
                                    setNewTask({ ...newTask, priority: event.target.value })
                                }
                                className="h-[48px] w-full rounded-[12px] border border-[#24191B]/15 bg-white px-4 text-[11px] text-[#24191B] outline-none focus:border-[#69ACC2]"
                            >
                                <option value="LOW">{t.low}</option>
                                <option value="MEDIUM">{t.medium}</option>
                                <option value="HIGH">{t.high}</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-[#24191B]/15 pt-5 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-[45px] rounded-[12px] border border-[#24191B]/15 bg-white px-5 text-[10px] font-semibold text-[#766D69] transition hover:bg-[#F4F0E5]"
                        >
                            {t.cancel}
                        </button>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex h-[45px] items-center justify-center gap-2 rounded-[12px] bg-[#60212E] px-6 text-[10px] font-semibold text-white transition hover:bg-[#481722] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {editingTaskId !== null ? <Pencil size={15} /> : <Plus size={15} />}
                            {isSaving
                                ? editingTaskId !== null
                                    ? t.saving
                                    : t.creating
                                : editingTaskId !== null
                                    ? t.saveChanges
                                    : t.createTask}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}