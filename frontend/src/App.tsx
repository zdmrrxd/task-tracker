import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import axios from 'axios'

import {
  ArrowUpDown,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Layers3,
  LayoutDashboard,
  ListTodo,
  MousePointer2,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react'

interface Task {
  id: number
  baslik: string
  aciklama: string
  durum: string
  oncelik: string
  sonTarih: string | null
}

interface NewTask {
  baslik: string
  aciklama: string
  durum: string
  oncelik: string
  sonTarih: string
}

function normalizeStatus(status?: string) {
  const value = (status || '').trim().toUpperCase()

  if (['COMPLETED', 'DONE', 'TAMAMLANDI', 'TAMAMLANMIS', 'TAMAMLANMIŞ'].includes(value)) {
    return 'COMPLETED'
  }

  if (['IN_PROGRESS', 'IN PROGRESS', 'DEVAM_EDIYOR', 'DEVAM EDİYOR', 'DEVAM ETMEKTE'].includes(value)) {
    return 'IN_PROGRESS'
  }

  return value
}

function getGreeting() {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 12) {
    return 'Good morning'
  }

  if (hour >= 12 && hour < 18) {
    return 'Good afternoon'
  }

  return 'Good evening'
}

function App() {
  const greeting = getGreeting()

  const [tasks, setTasks] = useState<Task[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null)
  const [activeView, setActiveView] = useState<'dashboard' | 'tasks'>('tasks')
  const [activeTab, setActiveTab] = useState<'ALL' | 'IN_PROGRESS' | 'COMPLETED' | 'UPCOMING'>('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'LOW' | 'MEDIUM' | 'HIGH'>('ALL')
  const [sortMode, setSortMode] = useState<'DEFAULT' | 'PRIORITY_HIGH' | 'PRIORITY_LOW' | 'TITLE' | 'DATE'>('DEFAULT')
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
      const response = await axios.get<Task[]>(
          'http://localhost:8080/api/tasks'
      )

      setTasks(response.data)
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

  const handleSaveTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!newTask.baslik.trim()) {
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
        const response = await axios.put<Task>(
            `http://localhost:8080/api/tasks/${editingTaskId}`,
            taskData
        )

        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task.id === editingTaskId ? response.data : task
            )
        )
      } else {
        const response = await axios.post<Task>(
            'http://localhost:8080/api/tasks',
            taskData
        )

        setTasks((currentTasks) => [...currentTasks, response.data])
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
    } catch (error) {
      console.error('Görev kaydedilemedi:', error)
      alert(
          editingTaskId !== null
              ? 'Görev güncellenemedi. Backend bağlantısını kontrol et.'
              : 'Görev oluşturulamadı. Backend bağlantısını kontrol et.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteTask = async (task: Task) => {
    const shouldDelete = window.confirm(
        `"${task.baslik}" görevini silmek istediğine emin misin?`
    )

    if (!shouldDelete) {
      return
    }

    try {
      setDeletingTaskId(task.id)
      await axios.delete(`http://localhost:8080/api/tasks/${task.id}`)
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

  const totalTasks = tasks.length

  const inProgressTasks = tasks.filter(
      (task) => normalizeStatus(task.durum) === 'IN_PROGRESS'
  ).length

  const completedTasks = tasks.filter(
      (task) => normalizeStatus(task.durum) === 'COMPLETED'
  ).length

  const today = new Date().toISOString().slice(0, 10)

  const dueTodayTasks = tasks.filter(
      (task) =>
          task.sonTarih === today &&
          normalizeStatus(task.durum) !== 'COMPLETED'
  ).length

  const upcomingTasks = tasks.filter(
      (task) =>
          Boolean(task.sonTarih) &&
          task.sonTarih! > today &&
          normalizeStatus(task.durum) !== 'COMPLETED'
  ).length

  const formatDueDate = (date: string | null) => {
    if (!date) return 'No due date'

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(`${date}T00:00:00`))
  }

  const priorityWeight: Record<string, number> = {
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  }

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
            priorityFilter === 'ALL' ||
            task.oncelik?.toUpperCase() === priorityFilter

        return matchesSearch && matchesTab && matchesPriority
      })
      .sort((a, b) => {
        if (sortMode === 'PRIORITY_HIGH') {
          return (priorityWeight[b.oncelik?.toUpperCase()] ?? 0) -
              (priorityWeight[a.oncelik?.toUpperCase()] ?? 0)
        }

        if (sortMode === 'PRIORITY_LOW') {
          return (priorityWeight[a.oncelik?.toUpperCase()] ?? 0) -
              (priorityWeight[b.oncelik?.toUpperCase()] ?? 0)
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

  const statBase = `
    min-h-[210px]
    min-w-0
    rounded-[18px]
    border
    p-[19px]
    flex
    flex-col
    transition-all
    duration-200
    hover:-translate-y-[3px]
    hover:shadow-[0_14px_30px_rgba(57,42,38,0.07)]
  `

  return (
      <>
        <div
            className="
          min-h-screen
          w-full
          bg-[#FAF8F1]
          text-[#24191B]

          lg:grid
          lg:grid-cols-[225px_minmax(0,1fr)]

          xl:grid-cols-[255px_minmax(0,1fr)]
        "
        >
          {/* SIDEBAR */}

          <aside
              className="
            relative z-10 flex w-full flex-col
            border-b border-[#24191B]/15
            bg-[#F4F0E5]
            px-4 py-[22px]

            lg:sticky lg:top-0 lg:h-screen lg:w-[225px]
            lg:border-r lg:border-b-0 lg:px-[18px] lg:py-8

            xl:w-[255px] xl:px-6 xl:pb-6
          "
          >
            {/* CLIQ BRAND */}

            <div className="flex w-full flex-col items-center justify-center text-center">
              <div
                  className="
                flex items-baseline justify-center
                font-serif text-[34px] font-normal
                leading-none tracking-[-1.5px]
                text-[#24191B]
                sm:text-[38px]
              "
              >
                <span>CLIQ</span>

                <span className="text-[#69ACC2]">.</span>
              </div>

              <p
                  className="
                mt-[14px]
                text-[9px] font-semibold uppercase
                leading-[1.5] tracking-[2px]
                text-[#766D69]
              "
              >
                PLAN. CLICK. DONE.
              </p>
            </div>

            {/* LOGO */}

            <div
                className="
              mt-7 hidden h-[170px] w-full
              items-center justify-center overflow-hidden
              rounded-[18px] border border-[#60212E]
              p-5 lg:flex
              xl:mt-[38px] xl:h-[205px]

              bg-[repeating-linear-gradient(90deg,rgba(105,172,194,0.24)_0px,rgba(105,172,194,0.24)_19px,#FAF8F1_19px,#FAF8F1_38px)]
            "
            >
              <div
                  className="
                flex h-[105px] w-[105px]
                flex-col items-center justify-center gap-[9px]
                rounded-full border border-[#60212E]
                bg-[#FAF8F1]/95 text-[#60212E]
                shadow-[0_10px_30px_rgba(96,33,46,0.07)]
                xl:h-[116px] xl:w-[116px]
              "
              >
                <MousePointer2 size={34} strokeWidth={1.35} />

                <span className="font-serif text-[15px] tracking-[2px]">
                CLIQ
              </span>
              </div>
            </div>

            {/* NAVIGATION */}

            <div className="mt-7 w-full lg:mt-[42px]">
              <p
                  className="
                mb-[13px] pl-3
                text-[9px] font-bold uppercase
                tracking-[1.8px] text-[#9B928D]
              "
              >
                WORKSPACE
              </p>

              <nav
                  className="
                flex w-full flex-col gap-1.5
                sm:flex-row sm:justify-center
                lg:flex-col lg:justify-start
              "
              >
                <button
                    type="button"
                    onClick={() => {
                      setActiveView('dashboard')
                      setActiveTab('ALL')
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className={`
                  flex min-h-12 w-full items-center gap-3
                  rounded-xl px-3.5 transition-all duration-200
                  sm:w-auto sm:min-w-[145px] lg:w-full lg:min-w-0
                  ${activeView === 'dashboard'
                        ? 'bg-[#60212E] text-white'
                        : 'bg-transparent text-[#766D69] hover:bg-white/65 hover:text-[#24191B]'}
                `}
                >
                  <LayoutDashboard size={18} strokeWidth={1.6} />

                  <span className="text-xs font-medium">
                  Dashboard
                </span>
                </button>

                <button
                    type="button"
                    onClick={() => {
                      setActiveView('tasks')
                      setActiveTab('ALL')
                      document.getElementById('tasks-section')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className={`
                  flex min-h-12 w-full items-center gap-3
                  rounded-xl px-3.5 transition-colors duration-200
                  sm:w-auto sm:min-w-[145px] lg:w-full lg:min-w-0
                  ${activeView === 'tasks'
                        ? 'bg-[#60212E] text-white hover:bg-[#481722]'
                        : 'bg-transparent text-[#766D69] hover:bg-white/65 hover:text-[#24191B]'}
                `}
                >
                  <ListTodo size={18} strokeWidth={1.6} />

                  <span className="text-xs font-semibold">
                  My Tasks
                </span>

                  <span
                      className="
                    ml-auto flex h-[22px] min-w-[25px]
                    items-center justify-center rounded-full
                    bg-white/15 px-[7px]
                    text-[9px] font-semibold text-white
                  "
                  >
                  {totalTasks}
                </span>
                </button>
              </nav>
            </div>

            {/* SIDEBAR FOOTER */}

            <div className="mt-7 hidden w-full lg:mt-auto lg:block">
              <div
                  className="
                flex items-start gap-[11px]
                border-t border-[#24191B]/15
                pt-[18px]
              "
              >
              <span
                  className="
                  mt-[5px] h-2 w-2 shrink-0
                  rounded-full bg-[#69ACC2]
                "
              />

                <div>
                  <strong
                      className="
                    mb-[5px] block
                    font-serif text-sm font-normal
                    leading-[1.2] text-[#24191B]
                  "
                  >
                    Everything in one place.
                  </strong>

                  <p className="text-[9px] leading-[1.55] text-[#766D69]">
                    Your work, clearly organized.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN */}

          <main
              className="
            min-w-0 px-4 pb-10 pt-7
            sm:px-8 sm:pt-8
            xl:px-12 xl:pb-[55px] xl:pt-[42px]
          "
          >
            {/* HEADER */}

            <header
                className="
              flex min-h-0 w-full
              flex-col items-start justify-between
              gap-10 border-b border-[#24191B]/15
              pb-[34px]
              xl:min-h-[215px] xl:flex-row xl:items-end
            "
            >
              <div className="min-w-0">
                <p
                    className="
                  mb-[14px]
                  text-[9px] font-bold uppercase
                  tracking-[1.9px] text-[#60212E]
                "
                >
                  MY WORKSPACE / TASKS
                </p>

                <h1
                    className="
                  font-serif text-[44px] font-normal
                  leading-[0.98] tracking-[-1.5px]
                  text-[#24191B]
                  sm:text-[54px]
                  xl:text-[64px] xl:tracking-[-2.2px]
                "
                >
                  {greeting}

                  <span className="text-[#69ACC2]">.</span>
                </h1>

                <p
                    className="
                  mt-[18px] max-w-[470px]
                  text-[11px] leading-[1.65]
                  text-[#766D69] sm:text-xs
                "
                >
                  Everything you need to manage your tasks,
                  all in one place.
                </p>
              </div>

              {/* SEARCH + NEW TASK */}

              <div
                  className="
                flex w-full flex-col items-stretch gap-[11px]
                sm:flex-row sm:items-center
                xl:w-auto xl:shrink-0
              "
              >
                <div
                    className="
                  flex h-[50px] w-full items-center gap-[11px]
                  rounded-[14px]
                  border border-[#24191B]/15
                  bg-white px-[17px]
                  transition-all duration-200
                  focus-within:border-[#69ACC2]
                  focus-within:ring-[3px]
                  focus-within:ring-[#69ACC2]/10
                  sm:flex-1
                  xl:w-[340px] xl:flex-none
                "
                >
                  <Search
                      size={17}
                      strokeWidth={1.6}
                      className="shrink-0 text-[#766D69]"
                  />

                  <input
                      type="text"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search your tasks"
                      aria-label="Search your tasks"
                      className="
                    w-full min-w-0 border-0 bg-transparent
                    text-[11px] text-[#24191B]
                    outline-none placeholder:text-[#9B928D]
                  "
                  />
                </div>

                <button
                    type="button"
                    onClick={openTaskModal}
                    className="
                  flex h-[50px] items-center justify-center gap-[9px]
                  whitespace-nowrap rounded-[14px]
                  bg-[#60212E] px-[21px]
                  text-[11px] font-semibold text-white
                  transition-all duration-200
                  hover:-translate-y-px hover:bg-[#481722]
                  hover:shadow-[0_8px_18px_rgba(96,33,46,0.12)]
                "
                >
                  <Plus size={17} strokeWidth={2} />
                  <span>New task</span>
                </button>
              </div>
            </header>

            {/* OVERVIEW */}

            <section
                className="
              grid w-full grid-cols-1 gap-[30px]
              border-b border-[#24191B]/15
              py-[38px] sm:py-12
              xl:grid-cols-[245px_minmax(0,1fr)]
              xl:gap-[50px]
            "
            >
              <div className="max-w-[470px] pt-[5px]">
                <p
                    className="
                  mb-[14px]
                  text-[9px] font-bold uppercase
                  tracking-[1.9px] text-[#60212E]
                "
                >
                  01 / OVERVIEW
                </p>

                <h2
                    className="
                  font-serif text-[34px] font-normal
                  leading-[1.03] tracking-[-1.3px]
                  text-[#24191B] sm:text-[38px]
                "
                >
                  Your work,
                  <br />
                  at a glance.
                </h2>

                <p
                    className="
                  mt-[19px] max-w-[350px]
                  text-[11px] leading-[1.7]
                  text-[#766D69]
                  xl:max-w-[215px]
                "
                >
                  Track your tasks and see your progress
                  in one clear overview.
                </p>
              </div>

              {/* STATS */}

              <div
                  className="
                grid w-full grid-cols-1 gap-3
                min-[421px]:grid-cols-2
                2xl:grid-cols-4
              "
              >
                <article
                    className={`
                  ${statBase}
                  border-[#24191B]/15
                  bg-white
                  text-[#24191B]
                `}
                >
                  <div className="flex items-center justify-between">
                  <span
                      className="
                      flex h-[38px] w-[38px]
                      items-center justify-center
                      rounded-full border border-current
                      opacity-80
                    "
                  >
                    <Layers3 size={18} strokeWidth={1.5} />
                  </span>

                    <span className="text-[8px] font-semibold opacity-55">
                    01
                  </span>
                  </div>

                  <div
                      className="
                    mt-auto font-serif text-[43px]
                    leading-none tracking-[-1px]
                    sm:text-[52px]
                  "
                  >
                    {totalTasks}
                  </div>

                  <div
                      className="
                    mt-[17px] flex flex-col gap-[5px]
                    border-t border-current pt-[13px]
                  "
                  >
                    <strong className="text-[11px] font-semibold">
                      Total tasks
                    </strong>

                    <span className="text-[9px] opacity-60">
                    All your tasks
                  </span>
                  </div>
                </article>

                <article
                    className={`
                  ${statBase}
                  border-[#69ACC2]
                  bg-[#69ACC2]
                  text-white
                `}
                >
                  <div className="flex items-center justify-between">
                  <span
                      className="
                      flex h-[38px] w-[38px]
                      items-center justify-center
                      rounded-full border border-white/50
                    "
                  >
                    <Clock3 size={18} strokeWidth={1.5} />
                  </span>

                    <span className="text-[8px] font-semibold text-white/75">
                    02
                  </span>
                  </div>

                  <div
                      className="
                    mt-auto font-serif text-[43px]
                    leading-none sm:text-[52px]
                  "
                  >
                    {inProgressTasks}
                  </div>

                  <div
                      className="
                    mt-[17px] flex flex-col gap-[5px]
                    border-t border-white/65 pt-[13px]
                  "
                  >
                    <strong className="text-[11px] font-semibold">
                      In progress
                    </strong>

                    <span className="text-[9px] text-white/75">
                    Currently active
                  </span>
                  </div>
                </article>

                <article
                    className={`
                  ${statBase}
                  border-[#60212E]
                  bg-[#60212E]
                  text-white
                `}
                >
                  <div className="flex items-center justify-between">
                  <span
                      className="
                      flex h-[38px] w-[38px]
                      items-center justify-center
                      rounded-full border border-white/40
                    "
                  >
                    <Check size={18} strokeWidth={1.7} />
                  </span>

                    <span className="text-[8px] font-semibold text-white/70">
                    03
                  </span>
                  </div>

                  <div
                      className="
                    mt-auto font-serif text-[43px]
                    leading-none sm:text-[52px]
                  "
                  >
                    {completedTasks}
                  </div>

                  <div
                      className="
                    mt-[17px] flex flex-col gap-[5px]
                    border-t border-white/65 pt-[13px]
                  "
                  >
                    <strong className="text-[11px] font-semibold">
                      Completed
                    </strong>

                    <span className="text-[9px] text-white/70">
                    Finished tasks
                  </span>
                  </div>
                </article>

                <article
                    className={`
                  ${statBase}
                  border-[#453D38]/20
                  bg-[#D8D1BD]
                  text-[#453D38]
                `}
                >
                  <div className="flex items-center justify-between">
                  <span
                      className="
                      flex h-[38px] w-[38px]
                      items-center justify-center
                      rounded-full border border-current
                      opacity-80
                    "
                  >
                    <CalendarDays size={18} strokeWidth={1.5} />
                  </span>

                    <span className="text-[8px] font-semibold opacity-55">
                    04
                  </span>
                  </div>

                  <div
                      className="
                    mt-auto font-serif text-[43px]
                    leading-none sm:text-[52px]
                  "
                  >
                    {dueTodayTasks}
                  </div>

                  <div
                      className="
                    mt-[17px] flex flex-col gap-[5px]
                    border-t border-current pt-[13px]
                  "
                  >
                    <strong className="text-[11px] font-semibold">
                      Due today
                    </strong>

                    <span className="text-[9px] opacity-60">
                    Tasks due today
                  </span>
                  </div>
                </article>
              </div>
            </section>

            {/* TASKS */}

            <section id="tasks-section" className="w-full pt-12">
              <div
                  className="
                mb-[30px]
                flex flex-col items-start justify-between gap-6
                sm:flex-row sm:items-end
              "
              >
                <div>
                  <p
                      className="
                    mb-[14px]
                    text-[9px] font-bold uppercase
                    tracking-[1.9px] text-[#60212E]
                  "
                  >
                    02 / YOUR TASKS
                  </p>

                  <h2
                      className="
                    font-serif text-[37px] font-normal
                    leading-none tracking-[-1.3px]
                    text-[#24191B] sm:text-[42px]
                  "
                  >
                    Your tasks.
                  </h2>
                </div>

                <div className="flex w-full items-center gap-2 sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <button
                        type="button"
                        onClick={() => setFilterOpen((open) => !open)}
                        className="
                      flex h-10 w-full items-center justify-center gap-[7px]
                      rounded-[11px] border border-[#24191B]/15
                      bg-white px-3.5 text-[10px] font-medium text-[#766D69]
                    "
                    >
                      <SlidersHorizontal size={15} />
                      {priorityFilter === 'ALL' ? 'Filter' : priorityFilter}
                    </button>

                    {filterOpen && (
                        <div className="
                      absolute right-0 top-12 z-30 min-w-[150px]
                      overflow-hidden rounded-[11px] border border-[#24191B]/15
                      bg-white p-1.5 shadow-[0_12px_30px_rgba(36,25,27,0.12)]
                    ">
                          {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((priority) => (
                              <button
                                  key={priority}
                                  type="button"
                                  onClick={() => {
                                    setPriorityFilter(priority)
                                    setFilterOpen(false)
                                  }}
                                  className="
                                block w-full rounded-[8px] px-3 py-2 text-left
                                text-[10px] text-[#766D69] hover:bg-[#F4F0E5]
                              "
                              >
                                {priority === 'ALL' ? 'All priorities' : priority}
                              </button>
                          ))}
                        </div>
                    )}
                  </div>

                  <button
                      type="button"
                      onClick={cycleSortMode}
                      className="
                    flex h-10 flex-1 items-center justify-center gap-[7px]
                    rounded-[11px] border border-[#24191B]/15
                    bg-white px-3.5 text-[10px] font-medium text-[#766D69]
                    sm:flex-none
                  "
                  >
                    <ArrowUpDown size={15} />
                    {sortLabel}
                  </button>
                </div>
              </div>

              {/* TABS */}

              <div
                  className="
                flex min-h-[60px] w-full items-stretch
                gap-[23px] overflow-x-auto
                rounded-t-[16px]
                bg-[#60212E] px-4
                sm:gap-[31px] sm:px-[19px]
              "
              >
                <button
                    type="button"
                    onClick={() => setActiveTab('ALL')}
                    className={`
                  relative flex min-w-max items-center gap-[7px]
                  text-[10px] font-semibold text-white
                  ${activeTab === 'ALL'
                        ? "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-[#69ACC2] after:content-['']"
                        : 'text-white/60'}
                `}
                >
                  All tasks
                  <span className="rounded-full bg-white/15 px-2 py-1 text-[8px]">
                  {totalTasks}
                </span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('IN_PROGRESS')}
                    className={`relative min-w-max text-[10px] ${activeTab === 'IN_PROGRESS'
                        ? "font-semibold text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-[#69ACC2] after:content-['']"
                        : 'text-white/60'}`}
                >
                  In progress ({inProgressTasks})
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('COMPLETED')}
                    className={`relative min-w-max text-[10px] ${activeTab === 'COMPLETED'
                        ? "font-semibold text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-[#69ACC2] after:content-['']"
                        : 'text-white/60'}`}
                >
                  Completed ({completedTasks})
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('UPCOMING')}
                    className={`relative min-w-max text-[10px] ${activeTab === 'UPCOMING'
                        ? "font-semibold text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-[#69ACC2] after:content-['']"
                        : 'text-white/60'}`}
                >
                  Upcoming ({upcomingTasks})
                </button>
              </div>

              {/* EMPTY OR TASK LIST */}

              {displayedTasks.length === 0 ? (
                  <div
                      className="
                  flex min-h-[300px] w-full
                  flex-col items-center justify-center
                  border-x border-[#24191B]/15
                  bg-white px-5 py-[50px]
                  text-center
                "
                  >
                    <div
                        className="
                    mb-5 flex h-[60px] w-[60px]
                    items-center justify-center rounded-full
                    border border-[#69ACC2]/45
                    bg-[#69ACC2]/10 text-[#69ACC2]
                  "
                    >
                      <ListTodo size={27} strokeWidth={1.35} />
                    </div>

                    <p
                        className="
                    mb-2.5 text-[8px] font-bold
                    uppercase tracking-[1.9px]
                    text-[#60212E]
                  "
                    >
                      YOUR TASKS
                    </p>

                    <h3 className="font-serif text-[28px] text-[#24191B]">
                      {tasks.length === 0 ? 'Nothing here yet.' : 'No matching tasks.'}
                    </h3>

                    <p className="mt-[9px] text-[10px] text-[#766D69]">
                      {tasks.length === 0
                          ? 'Create your first task to get started.'
                          : 'Try changing your search or filters.'}
                    </p>

                    <button
                        type="button"
                        onClick={openTaskModal}
                        className="
                    mt-[22px] flex h-[41px]
                    items-center justify-center gap-2
                    rounded-[11px]
                    bg-[#60212E] px-[17px]
                    text-[10px] font-semibold text-white
                    hover:bg-[#481722]
                  "
                    >
                      <Plus size={15} />
                      Create a task
                    </button>
                  </div>
              ) : (
                  <div
                      className="
                  grid w-full gap-3
                  border-x border-[#24191B]/15
                  bg-white p-4
                  sm:p-5
                "
                  >
                    {paginatedTasks.map((task) => (
                        <article
                            key={task.id}
                            className="
                      flex flex-col gap-4
                      rounded-[14px]
                      border border-[#24191B]/15
                      bg-[#FAF8F1]
                      p-5
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                        >
                          <div className="min-w-0">
                            <h3
                                className="
                          font-serif text-[20px]
                          text-[#24191B]
                        "
                            >
                              {task.baslik}
                            </h3>

                            <p
                                className="
                          mt-1.5 max-w-[650px]
                          text-[10px] leading-[1.6]
                          text-[#766D69]
                        "
                            >
                              {task.aciklama || 'No description'}
                            </p>

                            <div className="mt-3 flex items-center gap-1.5 text-[9px] text-[#766D69]">
                              <CalendarDays size={13} strokeWidth={1.6} />
                              <span>
                                {task.sonTarih ? `Due ${formatDueDate(task.sonTarih)}` : 'No due date'}
                              </span>
                            </div>
                          </div>

                          <div
                              className="
                        flex shrink-0 flex-wrap
                        items-center gap-2
                      "
                          >
                      <span
                          className="
                          rounded-full
                          border border-[#69ACC2]/40
                          bg-[#69ACC2]/10
                          px-3 py-1.5
                          text-[8px] font-bold
                          uppercase tracking-[0.8px]
                          text-[#477F92]
                        "
                      >
                        {task.durum}
                      </span>

                            <span
                                className="
                          rounded-full
                          border border-[#60212E]/20
                          bg-[#60212E]/5
                          px-3 py-1.5
                          text-[8px] font-bold
                          uppercase tracking-[0.8px]
                          text-[#60212E]
                        "
                            >
                        {task.oncelik}
                      </span>

                            <button
                                type="button"
                                onClick={() => openEditModal(task)}
                                className="
                          flex h-8 items-center justify-center gap-1.5
                          rounded-[9px]
                          border border-[#24191B]/15
                          bg-white px-3
                          text-[9px] font-semibold
                          text-[#5C5350]
                          transition
                          hover:border-[#69ACC2]/50
                          hover:text-[#477F92]
                        "
                            >
                              <Pencil size={13} strokeWidth={1.7} />
                              Edit
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDeleteTask(task)}
                                disabled={deletingTaskId === task.id}
                                className="
                          flex h-8 items-center justify-center gap-1.5
                          rounded-[9px]
                          border border-[#60212E]/20
                          bg-[#60212E]/5 px-3
                          text-[9px] font-semibold
                          text-[#60212E]
                          transition
                          hover:bg-[#60212E]
                          hover:text-white
                          disabled:cursor-not-allowed
                          disabled:opacity-40
                        "
                            >
                              <Trash2 size={13} strokeWidth={1.7} />
                              {deletingTaskId === task.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </article>
                    ))}
                  </div>
              )}

              {/* ADD NEW TASK */}

              <button
                  type="button"
                  onClick={openTaskModal}
                  className="
                flex min-h-[60px] w-full
                items-center gap-[11px]
                rounded-b-[16px]
                border border-t-0 border-[#24191B]/15
                bg-[#F4F0E5] px-5
                text-[#60212E]
                transition-colors
                hover:bg-[#EDE8DA]
              "
              >
              <span
                  className="
                  flex h-[30px] w-[30px]
                  items-center justify-center
                  rounded-full bg-[#60212E]
                  text-white
                "
              >
                <Plus size={17} />
              </span>

                <span className="text-[10px] font-semibold">
                Add a new task
              </span>

                <ChevronRight size={17} className="ml-auto" />
              </button>

              {displayedTasks.length > tasksPerPage && (
                  <div className="mt-5 flex w-full items-center justify-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                        disabled={safeCurrentPage === 1}
                        className="
                      flex h-8 min-w-8 items-center justify-center rounded-[9px]
                      border border-[#24191B]/15 bg-white px-2
                      text-[10px] text-[#766D69] transition
                      hover:border-[#69ACC2]/50 hover:text-[#477F92]
                      disabled:cursor-not-allowed disabled:opacity-35
                    "
                    >
                      ‹
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                        <button
                            key={page}
                            type="button"
                            onClick={() => setCurrentPage(page)}
                            className={`
                          flex h-8 min-w-8 items-center justify-center rounded-[9px]
                          border px-2 text-[10px] font-semibold transition
                          ${safeCurrentPage === page
                                ? 'border-[#60212E] bg-[#60212E] text-white'
                                : 'border-[#24191B]/15 bg-white text-[#766D69] hover:border-[#69ACC2]/50 hover:text-[#477F92]'}
                        `}
                        >
                          {page}
                        </button>
                    ))}

                    <button
                        type="button"
                        onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                        disabled={safeCurrentPage === totalPages}
                        className="
                      flex h-8 min-w-8 items-center justify-center rounded-[9px]
                      border border-[#24191B]/15 bg-white px-2
                      text-[10px] text-[#766D69] transition
                      hover:border-[#69ACC2]/50 hover:text-[#477F92]
                      disabled:cursor-not-allowed disabled:opacity-35
                    "
                    >
                      ›
                    </button>
                  </div>
              )}

              <div
                  className="
                mt-5 flex w-full
                items-center justify-between
              "
              >
              <span className="text-[9px] text-[#9B928D]">
                {displayedTasks.length === 0
                    ? 'No tasks to display'
                    : `Showing ${(safeCurrentPage - 1) * tasksPerPage + 1}-${Math.min(safeCurrentPage * tasksPerPage, displayedTasks.length)} of ${displayedTasks.length} task${displayedTasks.length === 1 ? '' : 's'}`}
              </span>
              </div>
            </section>
          </main>
        </div>

        {/* CREATE TASK MODAL */}

        {isModalOpen && (
            <div
                className="
            fixed inset-0 z-[100]
            flex items-center justify-center
            bg-[#24191B]/45
            p-4
            backdrop-blur-[3px]
          "
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) {
                    closeTaskModal()
                  }
                }}
            >
              <div
                  className="
              w-full max-w-[560px]
              overflow-hidden
              rounded-[22px]
              border border-[#24191B]/15
              bg-[#FAF8F1]
              shadow-[0_30px_80px_rgba(36,25,27,0.25)]
            "
              >
                <div
                    className="
                flex items-start justify-between
                border-b border-[#24191B]/15
                px-6 py-5
              "
                >
                  <div>
                    <p
                        className="
                    mb-2 text-[8px] font-bold
                    uppercase tracking-[1.8px]
                    text-[#60212E]
                  "
                    >
                      {editingTaskId !== null ? 'EDIT TASK' : 'NEW TASK'}
                    </p>

                    <h2
                        className="
                    font-serif text-[30px]
                    font-normal tracking-[-0.8px]
                    text-[#24191B]
                  "
                    >
                      {editingTaskId !== null ? 'Edit your task' : 'Create a task'}
                      <span className="text-[#69ACC2]">.</span>
                    </h2>
                  </div>

                  <button
                      type="button"
                      onClick={closeTaskModal}
                      className="
                  flex h-9 w-9 items-center justify-center
                  rounded-full
                  border border-[#24191B]/15
                  bg-white
                  text-[#766D69]
                  transition
                  hover:text-[#60212E]
                "
                  >
                    <X size={17} />
                  </button>
                </div>

                <form
                    onSubmit={handleSaveTask}
                    className="space-y-5 p-6"
                >
                  <div>
                    <label
                        htmlFor="task-title"
                        className="
                    mb-2 block
                    text-[9px] font-bold
                    uppercase tracking-[1px]
                    text-[#60212E]
                  "
                    >
                      Task title *
                    </label>

                    <input
                        id="task-title"
                        type="text"
                        required
                        value={newTask.baslik}
                        onChange={(event) =>
                            setNewTask({
                              ...newTask,
                              baslik: event.target.value,
                            })
                        }
                        placeholder="What needs to be done?"
                        className="
                    h-[48px] w-full
                    rounded-[12px]
                    border border-[#24191B]/15
                    bg-white px-4
                    text-[12px] text-[#24191B]
                    outline-none
                    placeholder:text-[#9B928D]
                    focus:border-[#69ACC2]
                    focus:ring-[3px]
                    focus:ring-[#69ACC2]/10
                  "
                    />
                  </div>

                  <div>
                    <label
                        htmlFor="task-description"
                        className="
                    mb-2 block
                    text-[9px] font-bold
                    uppercase tracking-[1px]
                    text-[#60212E]
                  "
                    >
                      Description
                    </label>

                    <textarea
                        id="task-description"
                        rows={4}
                        value={newTask.aciklama}
                        onChange={(event) =>
                            setNewTask({
                              ...newTask,
                              aciklama: event.target.value,
                            })
                        }
                        placeholder="Add some details..."
                        className="
                    w-full resize-none
                    rounded-[12px]
                    border border-[#24191B]/15
                    bg-white p-4
                    text-[12px] leading-[1.6]
                    text-[#24191B]
                    outline-none
                    placeholder:text-[#9B928D]
                    focus:border-[#69ACC2]
                    focus:ring-[3px]
                    focus:ring-[#69ACC2]/10
                  "
                    />
                  </div>

                  <div>
                    <label
                        htmlFor="task-due-date"
                        className="
                    mb-2 block
                    text-[9px] font-bold
                    uppercase tracking-[1px]
                    text-[#60212E]
                  "
                    >
                      Due date
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
                          min={editingTaskId !== null && newTask.sonTarih && newTask.sonTarih < today ? newTask.sonTarih : today}
                          value={newTask.sonTarih}
                          onChange={(event) =>
                              setNewTask({
                                ...newTask,
                                sonTarih: event.target.value,
                              })
                          }
                          className="
                      h-[48px] w-full
                      rounded-[12px]
                      border border-[#24191B]/15
                      bg-white pl-11 pr-4
                      text-[11px] text-[#24191B]
                      outline-none
                      focus:border-[#69ACC2]
                      focus:ring-[3px]
                      focus:ring-[#69ACC2]/10
                    "
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                          htmlFor="task-status"
                          className="
                      mb-2 block
                      text-[9px] font-bold
                      uppercase tracking-[1px]
                      text-[#60212E]
                    "
                      >
                        Status
                      </label>

                      <select
                          id="task-status"
                          value={newTask.durum}
                          onChange={(event) =>
                              setNewTask({
                                ...newTask,
                                durum: event.target.value,
                              })
                          }
                          className="
                      h-[48px] w-full
                      rounded-[12px]
                      border border-[#24191B]/15
                      bg-white px-4
                      text-[11px] text-[#24191B]
                      outline-none
                      focus:border-[#69ACC2]
                    "
                      >
                        <option value="IN_PROGRESS">
                          In progress
                        </option>

                        <option value="COMPLETED">
                          Completed
                        </option>
                      </select>
                    </div>

                    <div>
                      <label
                          htmlFor="task-priority"
                          className="
                      mb-2 block
                      text-[9px] font-bold
                      uppercase tracking-[1px]
                      text-[#60212E]
                    "
                      >
                        Priority
                      </label>

                      <select
                          id="task-priority"
                          value={newTask.oncelik}
                          onChange={(event) =>
                              setNewTask({
                                ...newTask,
                                oncelik: event.target.value,
                              })
                          }
                          className="
                      h-[48px] w-full
                      rounded-[12px]
                      border border-[#24191B]/15
                      bg-white px-4
                      text-[11px] text-[#24191B]
                      outline-none
                      focus:border-[#69ACC2]
                    "
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                      </select>
                    </div>
                  </div>

                  <div
                      className="
                  flex flex-col-reverse gap-3
                  border-t border-[#24191B]/15
                  pt-5
                  sm:flex-row
                  sm:justify-end
                "
                  >
                    <button
                        type="button"
                        onClick={closeTaskModal}
                        className="
                    h-[45px]
                    rounded-[12px]
                    border border-[#24191B]/15
                    bg-white px-5
                    text-[10px] font-semibold
                    text-[#766D69]
                    transition
                    hover:bg-[#F4F0E5]
                  "
                    >
                      Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isSaving || !newTask.baslik.trim()}
                        className="
                    flex h-[45px]
                    items-center justify-center gap-2
                    rounded-[12px]
                    bg-[#60212E] px-6
                    text-[10px] font-semibold
                    text-white
                    transition
                    hover:bg-[#481722]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                    >
                      {editingTaskId !== null ? (
                          <Pencil size={15} />
                      ) : (
                          <Plus size={15} />
                      )}

                      {isSaving
                          ? editingTaskId !== null
                              ? 'Saving...'
                              : 'Creating...'
                          : editingTaskId !== null
                              ? 'Save changes'
                              : 'Create task'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </>
  )
}

export default App