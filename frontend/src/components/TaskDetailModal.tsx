import type { Task } from '../types/task'
import { useTranslation } from 'react-i18next'

interface TaskDetailModalProps {
    task: Task | null
    onClose: () => void
    onEdit: (task: Task) => void
}

export function TaskDetailModal({
                                    task,
                                    onClose,
                                    onEdit,
                                }: TaskDetailModalProps) {
    const { t } = useTranslation()

    if (!task) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                <h2 className="mb-4 text-2xl font-bold">{task.title}</h2>

                <div className="space-y-3">
                    <p>
                        <strong>{t('description')}:</strong>{' '}
                        {task.description || t('noDescription')}
                    </p>

                    <p>
                        <strong>{t('status')}:</strong> {task.status}
                    </p>

                    <p>
                        <strong>{t('priority')}:</strong> {task.priority}
                    </p>

                    <p>
                        <strong>{t('dueDate')}:</strong>{' '}
                        {task.dueDate || t('noDueDate')}
                    </p>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={() => onEdit(task)}
                        className="rounded bg-blue-600 px-4 py-2 text-white"
                    >
                        {t('edit')}
                    </button>

                    <button
                        onClick={onClose}
                        className="rounded bg-gray-300 px-4 py-2"
                    >
                        {t('cancel')}
                    </button>
                </div>
            </div>
        </div>
    )
}