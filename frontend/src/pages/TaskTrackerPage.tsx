import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'

import { Header } from '../components/Header'
import { OverviewSection } from '../components/OverviewSection'
import { Sidebar } from '../components/Sidebar'
import { TaskListSection } from '../components/TaskListSection'
import { TaskModal } from '../components/TaskModal'
import { TaskDetailModal } from '../components/TaskDetailModal'

import { taskService } from '../services/taskService'
import { useAuth } from '../context/AuthContext'

import type {
    NewTask,
    PriorityFilter,
    SortMode,
    TabFilter,
    Task,
    ViewMode,
} from '../types/task'

import {
    getGreeting,
    normalizeStatus,
    priorityWeight,
} from '../utils/taskHelpers'

import { useTranslation } from 'react-i18next'

export function TaskTrackerPage() {
    const { t } = useTranslation()
    const { user } = useAuth()

    const isAdmin =
        String(user?.role ?? '')
            .trim()
            .toUpperCase() === 'ADMIN'

    const greeting = getGreeting(t)

    const today =
        new Date()
            .toISOString()
            .slice(0, 10)

    const [tasks, setTasks] =
        useState<Task[]>([])

    const [errors, setErrors] = useState({
        title: '',
        description: '',
    })

    const [isModalOpen, setIsModalOpen] =
        useState(false)

    const [isSaving, setIsSaving] =
        useState(false)

    const [editingTaskId, setEditingTaskId] =
        useState<number | null>(null)

    const [deletingTaskId, setDeletingTaskId] =
        useState<number | null>(null)

    const [selectedTask, setSelectedTask] =
        useState<Task | null>(null)

    const [activeView, setActiveView] =
        useState<ViewMode>('tasks')

    const [activeTab, setActiveTab] =
        useState<TabFilter>('ALL')

    const [searchTerm, setSearchTerm] =
        useState('')

    const [filterOpen, setFilterOpen] =
        useState(false)

    const [priorityFilter, setPriorityFilter] =
        useState<PriorityFilter>('ALL')

    const [sortMode, setSortMode] =
        useState<SortMode>('DEFAULT')

    const [currentPage, setCurrentPage] =
        useState(1)

    const tasksPerPage = 5

    const [newTask, setNewTask] =
        useState<NewTask>({
            title: '',
            description: '',
            status: 'IN_PROGRESS',
            priority: 'MEDIUM',
            dueDate: '',
        })

    const fetchTasks = async () => {
        try {
            const data =
                await taskService.getAll()

            setTasks(data)
        } catch (error) {
            console.error(
                'Failed to fetch tasks:',
                error
            )
        }
    }

    useEffect(() => {
        fetchTasks()
    }, [])

    const openTaskModal = () => {
        setEditingTaskId(null)

        setNewTask({
            title: '',
            description: '',
            status: 'IN_PROGRESS',
            priority: 'MEDIUM',
            dueDate: '',
        })

        setErrors({
            title: '',
            description: '',
        })

        setIsModalOpen(true)
    }

    const openEditModal = (
        task: Task
    ) => {
        setEditingTaskId(task.id)

        setNewTask({
            title: task.title,
            description:
                task.description || '',
            status: task.status,
            priority: task.priority,
            dueDate:
                task.dueDate || '',
        })

        setErrors({
            title: '',
            description: '',
        })

        setIsModalOpen(true)
    }

    const closeTaskModal = () => {
        if (!isSaving) {
            setIsModalOpen(false)
        }
    }

    const openTaskDetails = (
        task: Task
    ) => {
        setSelectedTask(task)
    }

    const closeTaskDetails = () => {
        setSelectedTask(null)
    }

    const handleSaveTask = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault()

        const validationErrors = {
            title: '',
            description: '',
        }

        if (!newTask.title.trim()) {
            validationErrors.title =
                t('titleRequired') ||
                'Task title is required.'
        } else if (
            newTask.title.trim().length > 100
        ) {
            validationErrors.title =
                t('titleTooLong') ||
                'Task title cannot exceed 100 characters.'
        }

        if (
            newTask.description.trim().length >
            500
        ) {
            validationErrors.description =
                t('descriptionTooLong') ||
                'Description cannot exceed 500 characters.'
        }

        setErrors(validationErrors)

        if (
            validationErrors.title ||
            validationErrors.description
        ) {
            return
        }

        if (
            newTask.dueDate &&
            newTask.dueDate < today
        ) {
            const originalTask =
                editingTaskId !== null
                    ? tasks.find(
                        (task) =>
                            task.id ===
                            editingTaskId
                    )
                    : undefined

            if (
                !originalTask ||
                originalTask.dueDate !==
                newTask.dueDate
            ) {
                alert(
                    t('pastDueDate') ||
                    'Due date cannot be in the past.'
                )

                return
            }
        }

        try {
            setIsSaving(true)

            const savedTask =
                await taskService.save(
                    newTask,
                    editingTaskId
                )

            setTasks(
                (currentTasks) =>
                    editingTaskId !== null
                        ? currentTasks.map(
                            (task) =>
                                task.id ===
                                editingTaskId
                                    ? savedTask
                                    : task
                        )
                        : [
                            ...currentTasks,
                            savedTask,
                        ]
            )

            setIsModalOpen(false)
            setEditingTaskId(null)

            setNewTask({
                title: '',
                description: '',
                status: 'IN_PROGRESS',
                priority: 'MEDIUM',
                dueDate: '',
            })

            setErrors({
                title: '',
                description: '',
            })
        } catch (error: any) {
            console.error(
                'Failed to save task:',
                error
            )

            if (error.response?.data) {
                const message =
                    Object.values(
                        error.response.data
                    ).join('\n')

                alert(message)
            } else {
                alert(
                    editingTaskId !== null
                        ? t('failedUpdate') ||
                        'Failed to update task.'
                        : t('failedCreate') ||
                        'Failed to create task.'
                )
            }
        } finally {
            setIsSaving(false)
        }
    }

    const handleDeleteTask = async (
        task: Task
    ) => {
        const confirmMsg =
            t('confirmDelete')
                ? `${t(
                    'confirmDelete'
                )} "${task.title}"?`
                : `Are you sure you want to delete the task "${task.title}"?`

        const shouldDelete =
            window.confirm(confirmMsg)

        if (!shouldDelete) {
            return
        }

        try {
            setDeletingTaskId(task.id)

            await taskService.delete(
                task.id
            )

            setTasks(
                (currentTasks) =>
                    currentTasks.filter(
                        (currentTask) =>
                            currentTask.id !==
                            task.id
                    )
            )
        } catch (error) {
            console.error(
                'Failed to delete task:',
                error
            )

            alert(
                t('failedDelete') ||
                'Failed to delete task. Please check your backend connection.'
            )
        } finally {
            setDeletingTaskId(null)
        }
    }

    /*
     * Performance optimization:
     *
     * These statistics used to run several separate
     * Array.filter() operations on every render.
     *
     * Now the entire task list is traversed once
     * and the result is memoized.
     */
    const taskStats = useMemo(() => {
        let inProgress = 0
        let completed = 0
        let dueToday = 0
        let upcoming = 0

        for (const task of tasks) {
            const status =
                normalizeStatus(
                    task.status
                )

            if (
                status === 'IN_PROGRESS'
            ) {
                inProgress += 1
            }

            if (
                status === 'COMPLETED'
            ) {
                completed += 1
            }

            if (
                task.dueDate === today &&
                status !== 'COMPLETED'
            ) {
                dueToday += 1
            }

            if (
                task.dueDate &&
                task.dueDate > today &&
                status !== 'COMPLETED'
            ) {
                upcoming += 1
            }
        }

        return {
            total: tasks.length,
            inProgress,
            completed,
            dueToday,
            upcoming,
        }
    }, [tasks, today])

    /*
     * Performance optimization:
     *
     * Filtering and sorting are memoized.
     * They only run again when one of their
     * actual dependencies changes.
     */
    const displayedTasks =
        useMemo(() => {
            const query =
                searchTerm
                    .trim()
                    .toLowerCase()

            return tasks
                .filter((task) => {
                    const status =
                        normalizeStatus(
                            task.status
                        )

                    const matchesSearch =
                        !query ||
                        task.title
                            ?.toLowerCase()
                            .includes(
                                query
                            ) ||
                        task.description
                            ?.toLowerCase()
                            .includes(
                                query
                            )

                    const matchesTab =
                        activeTab === 'ALL' ||
                        (activeTab === 'UPCOMING'
                            ? task.dueDate != null &&
                            task.dueDate > today &&
                            status !== 'COMPLETED'
                            : status === activeTab)

                    const matchesPriority =
                        priorityFilter ===
                        'ALL' ||
                        task.priority
                            ?.toUpperCase() ===
                        priorityFilter

                    return (
                        matchesSearch &&
                        matchesTab &&
                        matchesPriority
                    )
                })
                .sort((a, b) => {
                    if (
                        sortMode ===
                        'PRIORITY_HIGH'
                    ) {
                        return (
                            (priorityWeight[
                                b.priority?.toUpperCase()
                                ] ?? 0) -
                            (priorityWeight[
                                a.priority?.toUpperCase()
                                ] ?? 0)
                        )
                    }

                    if (
                        sortMode ===
                        'PRIORITY_LOW'
                    ) {
                        return (
                            (priorityWeight[
                                a.priority?.toUpperCase()
                                ] ?? 0) -
                            (priorityWeight[
                                b.priority?.toUpperCase()
                                ] ?? 0)
                        )
                    }

                    if (
                        sortMode ===
                        'TITLE'
                    ) {
                        return a.title.localeCompare(
                            b.title
                        )
                    }

                    if (
                        sortMode ===
                        'DATE'
                    ) {
                        if (
                            !a.dueDate &&
                            !b.dueDate
                        ) {
                            return 0
                        }

                        if (
                            !a.dueDate
                        ) {
                            return 1
                        }

                        if (
                            !b.dueDate
                        ) {
                            return -1
                        }

                        return a.dueDate.localeCompare(
                            b.dueDate
                        )
                    }

                    return 0
                })
        }, [
            tasks,
            searchTerm,
            activeTab,
            priorityFilter,
            sortMode,
            today,
        ])

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                displayedTasks.length /
                tasksPerPage
            )
        )

    const safeCurrentPage =
        Math.min(
            currentPage,
            totalPages
        )

    /*
     * Pagination is also memoized.
     */
    const paginatedTasks =
        useMemo(
            () =>
                displayedTasks.slice(
                    (safeCurrentPage -
                        1) *
                    tasksPerPage,
                    safeCurrentPage *
                    tasksPerPage
                ),
            [
                displayedTasks,
                safeCurrentPage,
                tasksPerPage,
            ]
        )

    useEffect(() => {
        setCurrentPage(1)
    }, [
        searchTerm,
        priorityFilter,
        activeTab,
        sortMode,
    ])

    useEffect(() => {
        if (
            currentPage >
            totalPages
        ) {
            setCurrentPage(
                totalPages
            )
        }
    }, [
        currentPage,
        totalPages,
    ])

    const cycleSortMode = () => {
        setSortMode(
            (current) => {
                if (
                    current ===
                    'DEFAULT'
                ) {
                    return 'PRIORITY_HIGH'
                }

                if (
                    current ===
                    'PRIORITY_HIGH'
                ) {
                    return 'PRIORITY_LOW'
                }

                if (
                    current ===
                    'PRIORITY_LOW'
                ) {
                    return 'TITLE'
                }

                if (
                    current ===
                    'TITLE'
                ) {
                    return 'DATE'
                }

                return 'DEFAULT'
            }
        )
    }

    const sortLabel =
        sortMode ===
        'PRIORITY_HIGH'
            ? t('highToLow') ||
            'High → Low'
            : sortMode ===
            'PRIORITY_LOW'
                ? t('lowToHigh') ||
                'Low → High'
                : sortMode ===
                'TITLE'
                    ? t('aToZ') ||
                    'A → Z'
                    : sortMode ===
                    'DATE'
                        ? t(
                            'dueDate'
                        ) ||
                        'Due date'
                        : t('sort') ||
                        'Sort'

    return (
        <>
            <div className="min-h-screen w-full bg-[#FAF8F1] text-[#24191B] lg:grid lg:grid-cols-[225px_minmax(0,1fr)] xl:grid-cols-[255px_minmax(0,1fr)]">
                <Sidebar
                    activeView={
                        activeView
                    }
                    setActiveView={
                        setActiveView
                    }
                    totalTasks={
                        taskStats.total
                    }
                    isAdmin={
                        isAdmin
                    }
                />

                <main className="min-w-0 px-4 pb-10 pt-7 sm:px-8 sm:pt-8 xl:px-12 xl:pb-[55px] xl:pt-[42px]">
                    <Header
                        greeting={
                            greeting
                        }
                        searchTerm={
                            searchTerm
                        }
                        setSearchTerm={
                            setSearchTerm
                        }
                        onOpenTaskModal={
                            openTaskModal
                        }
                    />

                    <OverviewSection
                        totalTasks={
                            taskStats.total
                        }
                        inProgressTasks={
                            taskStats.inProgress
                        }
                        completedTasks={
                            taskStats.completed
                        }
                        dueTodayTasks={
                            taskStats.dueToday
                        }
                    />

                    <TaskListSection
                        isAdmin={
                            isAdmin
                        }
                        tasks={
                            tasks
                        }
                        displayedTasks={
                            displayedTasks
                        }
                        paginatedTasks={
                            paginatedTasks
                        }
                        totalTasks={
                            taskStats.total
                        }
                        inProgressTasks={
                            taskStats.inProgress
                        }
                        completedTasks={
                            taskStats.completed
                        }
                        upcomingTasks={
                            taskStats.upcoming
                        }
                        activeTab={
                            activeTab
                        }
                        setActiveTab={
                            setActiveTab
                        }
                        priorityFilter={
                            priorityFilter
                        }
                        setPriorityFilter={
                            setPriorityFilter
                        }
                        filterOpen={
                            filterOpen
                        }
                        setFilterOpen={
                            setFilterOpen
                        }
                        sortLabel={
                            sortLabel
                        }
                        cycleSortMode={
                            cycleSortMode
                        }
                        currentPage={
                            currentPage
                        }
                        setCurrentPage={
                            setCurrentPage
                        }
                        totalPages={
                            totalPages
                        }
                        safeCurrentPage={
                            safeCurrentPage
                        }
                        tasksPerPage={
                            tasksPerPage
                        }
                        deletingTaskId={
                            deletingTaskId
                        }
                        onOpenTaskModal={
                            openTaskModal
                        }
                        onEditTask={
                            openEditModal
                        }
                        onDeleteTask={
                            handleDeleteTask
                        }
                        onViewTask={
                            openTaskDetails
                        }
                    />
                </main>
            </div>

            <TaskModal
                isModalOpen={
                    isModalOpen
                }
                editingTaskId={
                    editingTaskId
                }
                newTask={
                    newTask
                }
                setNewTask={
                    setNewTask
                }
                errors={
                    errors
                }
                isSaving={
                    isSaving
                }
                today={
                    today
                }
                onClose={
                    closeTaskModal
                }
                onSave={
                    handleSaveTask
                }
            />

            <TaskDetailModal
                task={
                    selectedTask
                }
                onClose={
                    closeTaskDetails
                }
                onEdit={(
                    task
                ) => {
                    closeTaskDetails()
                    openEditModal(
                        task
                    )
                }}
            />
        </>
    )
}

export default TaskTrackerPage