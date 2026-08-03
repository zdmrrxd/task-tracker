import type { Task } from '../types/task'

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
    if (!task) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                <h2 className="mb-4 text-2xl font-bold">{task.title}</h2>

                <div className="space-y-3">
                    <p>
                        <strong>Description:</strong>{' '}
                        {task.description || 'No description'}
                    </p>

                    <p>
                        <strong>Status:</strong> {task.status}
                    </p>

                    <p>
                        <strong>Priority:</strong> {task.priority}
                    </p>

                    <p>
                        <strong>Due Date:</strong>{' '}
                        {task.dueDate || 'No due date'}
                    </p>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={() => onEdit(task)}
                        className="rounded bg-blue-600 px-4 py-2 text-white"
                    >
                        Edit
                    </button>

                    <button
                        onClick={onClose}
                        className="rounded bg-gray-300 px-4 py-2"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}