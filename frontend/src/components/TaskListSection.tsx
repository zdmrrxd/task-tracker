import {
    ArrowUpDown,
    ChevronRight,
    ListTodo,
    Plus,
    SlidersHorizontal,
} from 'lucide-react'

import type {
    PriorityFilter,
    TabFilter,
    Task,
} from '../types/task'

import { TaskItem } from './TaskItem'
import { useTranslation } from 'react-i18next'

interface TaskListSectionProps {
    isAdmin?: boolean
    tasks: Task[]
    displayedTasks: Task[]
    paginatedTasks: Task[]
    totalTasks: number
    inProgressTasks: number
    completedTasks: number
    upcomingTasks: number
    activeTab: TabFilter
    setActiveTab: (
        tab: TabFilter
    ) => void
    priorityFilter: PriorityFilter
    setPriorityFilter: (
        p: PriorityFilter
    ) => void
    filterOpen: boolean
    setFilterOpen: (
        fn: (prev: boolean) => boolean
    ) => void
    sortLabel: string
    cycleSortMode: () => void
    currentPage: number
    setCurrentPage: (
        fn: (p: number) => number
    ) => void
    totalPages: number
    safeCurrentPage: number
    tasksPerPage: number
    deletingTaskId: number | null
    onOpenTaskModal: () => void
    onEditTask: (task: Task) => void
    onDeleteTask: (task: Task) => void
    onViewTask: (task: Task) => void
}

export function TaskListSection({
                                    isAdmin = false,
                                    tasks,
                                    displayedTasks,
                                    paginatedTasks,
                                    totalTasks,
                                    inProgressTasks,
                                    completedTasks,
                                    upcomingTasks,
                                    activeTab,
                                    setActiveTab,
                                    priorityFilter,
                                    setPriorityFilter,
                                    filterOpen,
                                    setFilterOpen,
                                    sortLabel,
                                    cycleSortMode,
                                    setCurrentPage,
                                    totalPages,
                                    safeCurrentPage,
                                    tasksPerPage,
                                    deletingTaskId,
                                    onOpenTaskModal,
                                    onEditTask,
                                    onDeleteTask,
                                    onViewTask,
                                }: TaskListSectionProps) {
    const { t } = useTranslation()

    const sectionTitle = isAdmin
        ? t('allTasks')
        : t('myTasks')

    const getFilterLabel = (
        filter: PriorityFilter
    ) => {
        switch (filter) {
            case 'HIGH':
                return t('high')

            case 'MEDIUM':
                return t('medium')

            case 'LOW':
                return t('low')

            case 'ALL':
            default:
                return (
                    t('filter') ||
                    'Filter'
                )
        }
    }

    const getOptionLabel = (
        priority:
            | 'ALL'
            | 'HIGH'
            | 'MEDIUM'
            | 'LOW'
    ) => {
        switch (priority) {
            case 'ALL':
                return (
                    t('allPriorities') ||
                    'All Priorities'
                )

            case 'HIGH':
                return (
                    t('high') || 'High'
                )

            case 'MEDIUM':
                return (
                    t('medium') ||
                    'Medium'
                )

            case 'LOW':
                return (
                    t('low') || 'Low'
                )
        }
    }

    return (
        <section
            id="tasks-section"
            className="w-full pt-12"
        >
            <div className="mb-[30px] flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
                <div>
                    <p className="mb-[14px] text-[9px] font-bold uppercase tracking-[1.9px] text-[#60212E]">
                        02 /{' '}
                        {sectionTitle?.toUpperCase()}
                    </p>

                    <h2 className="font-serif text-[37px] font-normal leading-none tracking-[-1.3px] text-[#24191B] sm:text-[42px]">
                        {sectionTitle}
                    </h2>
                </div>

                <div className="flex w-full items-center gap-2 sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <button
                            type="button"
                            onClick={() =>
                                setFilterOpen(
                                    (open) =>
                                        !open
                                )
                            }
                            className="flex h-10 w-full items-center justify-center gap-[7px] rounded-[11px] border border-[#24191B]/15 bg-white px-3.5 text-[10px] font-medium text-[#766D69]"
                        >
                            <SlidersHorizontal
                                size={15}
                            />

                            {getFilterLabel(
                                priorityFilter
                            )}
                        </button>

                        {filterOpen && (
                            <div className="absolute right-0 top-12 z-30 min-w-[150px] overflow-hidden rounded-[11px] border border-[#24191B]/15 bg-white p-1.5 shadow-[0_12px_30px_rgba(36,25,27,0.12)]">
                                {(
                                    [
                                        'ALL',
                                        'HIGH',
                                        'MEDIUM',
                                        'LOW',
                                    ] as const
                                ).map(
                                    (
                                        priority
                                    ) => (
                                        <button
                                            key={
                                                priority
                                            }
                                            type="button"
                                            onClick={() => {
                                                setPriorityFilter(
                                                    priority
                                                )

                                                setFilterOpen(
                                                    () =>
                                                        false
                                                )
                                            }}
                                            className="block w-full rounded-[8px] px-3 py-2 text-left text-[10px] text-[#766D69] hover:bg-[#F4F0E5]"
                                        >
                                            {getOptionLabel(
                                                priority
                                            )}
                                        </button>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={
                            cycleSortMode
                        }
                        className="flex h-10 flex-1 items-center justify-center gap-[7px] rounded-[11px] border border-[#24191B]/15 bg-white px-3.5 text-[10px] font-medium text-[#766D69] sm:flex-none"
                    >
                        <ArrowUpDown
                            size={15}
                        />

                        {sortLabel}
                    </button>
                </div>
            </div>

            <div className="flex min-h-[60px] w-full items-stretch gap-[23px] overflow-x-auto rounded-t-[16px] bg-[#60212E] px-4 sm:gap-[31px] sm:px-[19px]">
                <button
                    type="button"
                    onClick={() =>
                        setActiveTab('ALL')
                    }
                    className={`relative flex min-w-max items-center gap-[7px] text-[10px] font-semibold text-white ${
                        activeTab === 'ALL'
                            ? "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-[#69ACC2] after:content-['']"
                            : 'text-white/60'
                    }`}
                >
                    {t('allTasks')}

                    <span className="rounded-full bg-white/15 px-2 py-1 text-[8px]">
                        {totalTasks}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() =>
                        setActiveTab(
                            'IN_PROGRESS'
                        )
                    }
                    className={`relative min-w-max text-[10px] ${
                        activeTab ===
                        'IN_PROGRESS'
                            ? "font-semibold text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-[#69ACC2] after:content-['']"
                            : 'text-white/60'
                    }`}
                >
                    {t('inProgress')} (
                    {inProgressTasks})
                </button>

                <button
                    type="button"
                    onClick={() =>
                        setActiveTab(
                            'COMPLETED'
                        )
                    }
                    className={`relative min-w-max text-[10px] ${
                        activeTab ===
                        'COMPLETED'
                            ? "font-semibold text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-[#69ACC2] after:content-['']"
                            : 'text-white/60'
                    }`}
                >
                    {t('completed')} (
                    {completedTasks})
                </button>

                <button
                    type="button"
                    onClick={() =>
                        setActiveTab(
                            'UPCOMING'
                        )
                    }
                    className={`relative min-w-max text-[10px] ${
                        activeTab ===
                        'UPCOMING'
                            ? "font-semibold text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-[#69ACC2] after:content-['']"
                            : 'text-white/60'
                    }`}
                >
                    {t('upcoming')} (
                    {upcomingTasks})
                </button>
            </div>

            {displayedTasks.length === 0 ? (
                <div className="flex min-h-[300px] w-full flex-col items-center justify-center border-x border-[#24191B]/15 bg-white px-5 py-[50px] text-center">
                    <div className="mb-5 flex h-[60px] w-[60px] items-center justify-center rounded-full border border-[#69ACC2]/45 bg-[#69ACC2]/10 text-[#69ACC2]">
                        <ListTodo
                            size={27}
                            strokeWidth={
                                1.35
                            }
                        />
                    </div>

                    <p className="mb-2.5 text-[8px] font-bold uppercase tracking-[1.9px] text-[#60212E]">
                        {sectionTitle?.toUpperCase()}
                    </p>

                    <h3 className="font-serif text-[28px] text-[#24191B]">
                        {tasks.length === 0
                            ? t(
                                'nothingHereYet'
                            )
                            : t(
                                'noMatchingTasks'
                            )}
                    </h3>

                    <p className="mt-[9px] text-[10px] text-[#766D69]">
                        {tasks.length === 0
                            ? t(
                                'createFirstTask'
                            )
                            : t(
                                'tryChangingFilters'
                            )}
                    </p>

                    <button
                        type="button"
                        onClick={
                            onOpenTaskModal
                        }
                        className="mt-[22px] flex h-[41px] items-center justify-center gap-2 rounded-[11px] bg-[#60212E] px-[17px] text-[10px] font-semibold text-white hover:bg-[#481722]"
                    >
                        <Plus size={15} />

                        {t('createTask')}
                    </button>
                </div>
            ) : (
                <div className="grid w-full gap-3 border-x border-[#24191B]/15 bg-white p-4 sm:p-5">
                    {paginatedTasks.map(
                        (task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                deletingTaskId={
                                    deletingTaskId
                                }
                                onEdit={
                                    onEditTask
                                }
                                onDelete={
                                    onDeleteTask
                                }
                                onView={
                                    onViewTask
                                }
                            />
                        )
                    )}
                </div>
            )}

            <button
                type="button"
                onClick={
                    onOpenTaskModal
                }
                className="flex min-h-[60px] w-full items-center gap-[11px] rounded-b-[16px] border border-t-0 border-[#24191B]/15 bg-[#F4F0E5] px-5 text-[#60212E] transition-colors hover:bg-[#EDE8DA]"
            >
                <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#60212E] text-white">
                    <Plus size={17} />
                </span>

                <span className="text-[10px] font-semibold">
                    {t('addTask')}
                </span>

                <ChevronRight
                    size={17}
                    className="ml-auto"
                />
            </button>

            {displayedTasks.length >
                tasksPerPage && (
                    <div className="mt-5 flex w-full items-center justify-center gap-1.5">
                        <button
                            type="button"
                            onClick={() =>
                                setCurrentPage(
                                    (page) =>
                                        Math.max(
                                            1,
                                            page - 1
                                        )
                                )
                            }
                            disabled={
                                safeCurrentPage ===
                                1
                            }
                            className="flex h-8 min-w-8 items-center justify-center rounded-[9px] border border-[#24191B]/15 bg-white px-2 text-[10px] text-[#766D69] transition hover:border-[#69ACC2]/50 hover:text-[#477F92] disabled:cursor-not-allowed disabled:opacity-35"
                        >
                            ‹
                        </button>

                        {Array.from(
                            {
                                length: totalPages,
                            },
                            (_, index) =>
                                index + 1
                        ).map((page) => (
                            <button
                                key={page}
                                type="button"
                                onClick={() =>
                                    setCurrentPage(
                                        () => page
                                    )
                                }
                                className={`flex h-8 min-w-8 items-center justify-center rounded-[9px] border px-2 text-[10px] font-semibold transition ${
                                    safeCurrentPage ===
                                    page
                                        ? 'border-[#60212E] bg-[#60212E] text-white'
                                        : 'border-[#24191B]/15 bg-white text-[#766D69] hover:border-[#69ACC2]/50 hover:text-[#477F92]'
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            type="button"
                            onClick={() =>
                                setCurrentPage(
                                    (page) =>
                                        Math.min(
                                            totalPages,
                                            page + 1
                                        )
                                )
                            }
                            disabled={
                                safeCurrentPage ===
                                totalPages
                            }
                            className="flex h-8 min-w-8 items-center justify-center rounded-[9px] border border-[#24191B]/15 bg-white px-2 text-[10px] text-[#766D69] transition hover:border-[#69ACC2]/50 hover:text-[#477F92] disabled:cursor-not-allowed disabled:opacity-35"
                        >
                            ›
                        </button>
                    </div>
                )}

            <div className="mt-5 flex w-full items-center justify-between">
                <span className="text-[9px] text-[#9B928D]">
                    {displayedTasks.length ===
                    0
                        ? t(
                            'noTasksToDisplay'
                        )
                        : `${t('showing') || 'Showing'} ${
                            (safeCurrentPage -
                                1) *
                            tasksPerPage +
                            1
                        }-${Math.min(
                            safeCurrentPage *
                            tasksPerPage,
                            displayedTasks.length
                        )} ${
                            t('of') || 'of'
                        } ${
                            displayedTasks.length
                        } ${
                            displayedTasks.length ===
                            1
                                ? t(
                                    'task'
                                ) ||
                                'task'
                                : t(
                                    'tasks'
                                ) ||
                                'tasks'
                        }`}
                </span>
            </div>
        </section>
    )
}