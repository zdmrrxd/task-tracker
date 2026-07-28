import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Header } from './components/Header'
import { OverviewSection } from './components/OverviewSection'
import { Sidebar } from './components/Sidebar'
import { TaskListSection } from './components/TaskListSection'
import { TaskModal } from './components/TaskModal'
import { TaskDetailModal } from './components/TaskDetailModal'
import { taskService } from './services/taskService'

import type { NewTask, PriorityFilter, SortMode, TabFilter, Task, ViewMode } from './types/task'
import { getGreeting, normalizeStatus, priorityWeight } from './utils/taskHelpers'

export function App() {
  const greeting = getGreeting()
  const today = new Date().toISOString().slice(0, 10)

  const [tasks, setTasks] = useState<Task[]>([])
  const [errors, setErrors] = useState({ baslik: '', aciklama: '' })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [activeView, setActiveView] = useState<ViewMode>('tasks')
  const [activeTab, setActiveTab] = useState<TabFilter>('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('ALL')
  const [sortMode, setSortMode] = useState<SortMode>('DEFAULT')
  const [currentPage, setCurrentPage] = useState(1)
  const tasksPerPage = 5

  const [newTask, setNewTask] = useState<NewTask>({
    baslik: '',
    aciklama: '',
    durum: 'IN_PROGRESS',
    oncelik: 'MEDIUM',
    sonTarih: '',
  })

  const fetchTasks = async () => {
    try {
      const data = await taskService.getAll()
      setTasks(data)
    } catch (error) {
      console.error('Görevler alınamadı:', error)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const openTaskModal = () => {
    setEditingTaskId(null)
    setNewTask({
      baslik: '',
      aciklama: '',
      durum: 'IN_PROGRESS',
      oncelik: 'MEDIUM',
      sonTarih: '',
    })
    setIsModalOpen(true)
  }

  const openEditModal = (task: Task) => {
    setEditingTaskId(task.id)
    setNewTask({
      baslik: task.baslik,
      aciklama: task.aciklama || '',
      durum: task.durum,
      oncelik: task.oncelik,
      sonTarih: task.sonTarih || '',
    })
    setIsModalOpen(true)
  }

  const closeTaskModal = () => {
    if (!isSaving) {
      setIsModalOpen(false)
    }
  }

  const openTaskDetails = (task: Task) => {
    setSelectedTask(task)
  }

  const closeTaskDetails = () => {
    setSelectedTask(null)
  }


  const handleSaveTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationErrors = { baslik: '', aciklama: '' }

    if (!newTask.baslik.trim()) {
      validationErrors.baslik = 'Task title is required.'
    } else if (newTask.baslik.trim().length > 100) {
      validationErrors.baslik = 'Task title cannot exceed 100 characters.'
    }

    if (newTask.aciklama.trim().length > 500) {
      validationErrors.aciklama = 'Description cannot exceed 500 characters.'
    }

    setErrors(validationErrors)

    if (validationErrors.baslik || validationErrors.aciklama) {
      return
    }

    if (newTask.sonTarih && newTask.sonTarih < today) {
      const originalTask = editingTaskId !== null
          ? tasks.find((task) => task.id === editingTaskId)
          : undefined

      if (!originalTask || originalTask.sonTarih !== newTask.sonTarih) {
        alert('Due date cannot be in the past.')
        return
      }
    }

    const taskData = {
      baslik: newTask.baslik.trim(),
      aciklama: newTask.aciklama.trim(),
      durum: newTask.durum,
      oncelik: newTask.oncelik,
      sonTarih: newTask.sonTarih || null,
    }

    try {
      setIsSaving(true)

      if (editingTaskId !== null) {
        const updatedTask = await taskService.update(editingTaskId, taskData)
        setTasks((currentTasks) =>
            currentTasks.map((task) => (task.id === editingTaskId ? updatedTask : task))
        )
      } else {
        const createdTask = await taskService.create(taskData)
        setTasks((currentTasks) => [...currentTasks, createdTask])
      }

      setIsModalOpen(false)
      setEditingTaskId(null)
      setNewTask({
        baslik: '',
        aciklama: '',
        durum: 'IN_PROGRESS',
        oncelik: 'MEDIUM',
        sonTarih: '',
      })
      setErrors({ baslik: '', aciklama: '' })
    } catch (error: any) {
      console.error('Görev kaydedilemedi:', error)

      if (error.response?.data) {
        const message = Object.values(error.response.data).join('\n')
        alert(message)
      } else {
        alert(
            editingTaskId !== null
                ? 'Görev güncellenemedi.'
                : 'Görev oluşturulamadı.'
        )
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteTask = async (task: Task) => {
    const shouldDelete = window.confirm(
        `"${task.baslik}" görevini silmek istediğine emin misin?`
    )

    if (!shouldDelete) return

    try {
      setDeletingTaskId(task.id)
      await taskService.delete(task.id)
      setTasks((currentTasks) =>
          currentTasks.filter((currentTask) => currentTask.id !== task.id)
      )
    } catch (error) {
      console.error('Görev silinemedi:', error)
      alert('Görev silinemedi. Backend bağlantısını kontrol et.')
    } finally {
      setDeletingTaskId(null)
    }
  }

  // Hesaplamalar
  const totalTasks = tasks.length
  const inProgressTasks = tasks.filter(
      (task) => normalizeStatus(task.durum) === 'IN_PROGRESS'
  ).length
  const completedTasks = tasks.filter(
      (task) => normalizeStatus(task.durum) === 'COMPLETED'
  ).length
  const dueTodayTasks = tasks.filter(
      (task) =>
          task.sonTarih === today && normalizeStatus(task.durum) !== 'COMPLETED'
  ).length
  const upcomingTasks = tasks.filter(
      (task) =>
          Boolean(task.sonTarih) &&
          task.sonTarih! > today &&
          normalizeStatus(task.durum) !== 'COMPLETED'
  ).length

  const displayedTasks = tasks
      .filter((task) => {
        const query = searchTerm.trim().toLocaleLowerCase('tr-TR')
        const matchesSearch =
            !query ||
            task.baslik?.toLocaleLowerCase('tr-TR').includes(query) ||
            task.aciklama?.toLocaleLowerCase('tr-TR').includes(query)

        const matchesTab =
            activeTab === 'ALL' ||
            (activeTab === 'UPCOMING'
                ? Boolean(task.sonTarih) &&
                task.sonTarih! > today &&
                normalizeStatus(task.durum) !== 'COMPLETED'
                : normalizeStatus(task.durum) === activeTab)

        const matchesPriority =
            priorityFilter === 'ALL' || task.oncelik?.toUpperCase() === priorityFilter

        return matchesSearch && matchesTab && matchesPriority
      })
      .sort((a, b) => {
        if (sortMode === 'PRIORITY_HIGH') {
          return (priorityWeight[b.oncelik?.toUpperCase()] ?? 0) - (priorityWeight[a.oncelik?.toUpperCase()] ?? 0)
        }
        if (sortMode === 'PRIORITY_LOW') {
          return (priorityWeight[a.oncelik?.toUpperCase()] ?? 0) - (priorityWeight[b.oncelik?.toUpperCase()] ?? 0)
        }
        if (sortMode === 'TITLE') {
          return a.baslik.localeCompare(b.baslik, 'tr')
        }
        if (sortMode === 'DATE') {
          if (!a.sonTarih && !b.sonTarih) return 0
          if (!a.sonTarih) return 1
          if (!b.sonTarih) return -1
          return a.sonTarih.localeCompare(b.sonTarih)
        }
        return 0
      })

  const totalPages = Math.max(1, Math.ceil(displayedTasks.length / tasksPerPage))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedTasks = displayedTasks.slice(
      (safeCurrentPage - 1) * tasksPerPage,
      safeCurrentPage * tasksPerPage
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, priorityFilter, activeTab, sortMode])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const cycleSortMode = () => {
    setSortMode((current) => {
      if (current === 'DEFAULT') return 'PRIORITY_HIGH'
      if (current === 'PRIORITY_HIGH') return 'PRIORITY_LOW'
      if (current === 'PRIORITY_LOW') return 'TITLE'
      if (current === 'TITLE') return 'DATE'
      return 'DEFAULT'
    })
  }

  const sortLabel =
      sortMode === 'PRIORITY_HIGH'
          ? 'High → Low'
          : sortMode === 'PRIORITY_LOW'
              ? 'Low → High'
              : sortMode === 'TITLE'
                  ? 'A → Z'
                  : sortMode === 'DATE'
                      ? 'Due date'
                      : 'Sort'

  return (
      <>
        <div className="min-h-screen w-full bg-[#FAF8F1] text-[#24191B] lg:grid lg:grid-cols-[225px_minmax(0,1fr)] xl:grid-cols-[255px_minmax(0,1fr)]">
          <Sidebar
              activeView={activeView}
              setActiveView={setActiveView}
              totalTasks={totalTasks}
          />

          <main className="min-w-0 px-4 pb-10 pt-7 sm:px-8 sm:pt-8 xl:px-12 xl:pb-[55px] xl:pt-[42px]">
            <Header
                greeting={greeting}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onOpenTaskModal={openTaskModal}
            />

            <OverviewSection
                totalTasks={totalTasks}
                inProgressTasks={inProgressTasks}
                completedTasks={completedTasks}
                dueTodayTasks={dueTodayTasks}
            />

            <TaskListSection
                tasks={tasks}
                displayedTasks={displayedTasks}
                paginatedTasks={paginatedTasks}
                totalTasks={totalTasks}
                inProgressTasks={inProgressTasks}
                completedTasks={completedTasks}
                upcomingTasks={upcomingTasks}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                priorityFilter={priorityFilter}
                setPriorityFilter={setPriorityFilter}
                filterOpen={filterOpen}
                setFilterOpen={setFilterOpen}
                sortLabel={sortLabel}
                cycleSortMode={cycleSortMode}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                safeCurrentPage={safeCurrentPage}
                tasksPerPage={tasksPerPage}
                deletingTaskId={deletingTaskId}
                onOpenTaskModal={openTaskModal}
                onEditTask={openEditModal}
                onDeleteTask={handleDeleteTask}
                onViewTask={openTaskDetails}
            />
          </main>
        </div>

        <TaskModal
            isModalOpen={isModalOpen}
            editingTaskId={editingTaskId}
            newTask={newTask}
            setNewTask={setNewTask}
            errors={errors}
            isSaving={isSaving}
            today={today}
            onClose={closeTaskModal}
            onSave={handleSaveTask}
        />

        <TaskDetailModal
            task={selectedTask}
            onClose={closeTaskDetails}
            onEdit={(task) => {
              closeTaskDetails()
              openEditModal(task)
            }}
        />
      </>
  )
}

export default App