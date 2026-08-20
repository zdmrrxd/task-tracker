import {
    LayoutDashboard,
    ListTodo,
    MousePointer2,
    Globe,
    ShieldCheck,
    LogOut,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { ViewMode } from '../types/task'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

interface SidebarProps {
    activeView: ViewMode
    setActiveView: (view: ViewMode) => void
    totalTasks: number
    isAdmin?: boolean
}

export function Sidebar({
                            activeView,
                            setActiveView,
                            totalTasks,
                            isAdmin,
                        }: SidebarProps) {
    const { t, i18n } = useTranslation()
    const language = i18n.language

    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const adminUser =
        isAdmin ??
        (String(user?.role ?? '').trim().toUpperCase() === 'ADMIN')

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <aside className="relative z-10 flex w-full flex-col border-b border-[#24191B]/15 bg-[#F4F0E5] px-4 py-[22px] lg:sticky lg:top-0 lg:h-screen lg:w-[225px] lg:border-r lg:border-b-0 lg:px-[18px] lg:py-8 xl:w-[255px] xl:px-6 xl:pb-6">

            <div className="flex w-full flex-col items-center justify-center text-center">

                <div className="flex items-baseline justify-center font-serif text-[34px] font-normal leading-none tracking-[-1.5px] text-[#24191B] sm:text-[38px]">
                    <span>CLIQ</span>
                    <span className="text-[#69ACC2]">.</span>
                </div>

                <p className="mt-[14px] text-[9px] font-semibold uppercase leading-[1.5] tracking-[2px] text-[#766D69]">
                    {t('logoSubtitle') || 'PLAN. CLICK. DONE.'}
                </p>

                <div className="mt-4 flex items-center gap-1 rounded-lg border border-[#24191B]/15 bg-white/50 p-1">

                    <Globe
                        size={14}
                        className="ml-1.5 mr-0.5 text-[#766D69]"
                    />

                    <button
                        type="button"
                        onClick={() =>
                            i18n.changeLanguage('en')
                        }
                        className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition ${
                            language === 'en'
                                ? 'bg-[#60212E] text-white shadow-sm'
                                : 'text-[#766D69] hover:text-[#24191B]'
                        }`}
                    >
                        English
                    </button>

                    <span className="text-[10px] text-[#24191B]/20">
                        |
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            i18n.changeLanguage('tr')
                        }
                        className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition ${
                            language === 'tr'
                                ? 'bg-[#60212E] text-white shadow-sm'
                                : 'text-[#766D69] hover:text-[#24191B]'
                        }`}
                    >
                        Türkçe
                    </button>
                </div>
            </div>

            <div className="mt-7 hidden h-[170px] w-full items-center justify-center overflow-hidden rounded-[18px] border border-[#60212E] bg-[repeating-linear-gradient(90deg,rgba(105,172,194,0.24)_0px,rgba(105,172,194,0.24)_19px,#FAF8F1_19px,#FAF8F1_38px)] p-5 lg:flex xl:mt-[38px] xl:h-[205px]">

                <div className="flex h-[105px] w-[105px] flex-col items-center justify-center gap-[9px] rounded-full border border-[#60212E] bg-[#FAF8F1]/95 text-[#60212E] shadow-[0_10px_30px_rgba(96,33,46,0.07)] xl:h-[116px] xl:w-[116px]">

                    <MousePointer2
                        size={34}
                        strokeWidth={1.35}
                    />

                    <span className="font-serif text-[15px] tracking-[2px]">
                        CLIQ
                    </span>
                </div>
            </div>

            <div className="mt-7 w-full lg:mt-[42px]">

                <p className="mb-[13px] pl-3 text-[9px] font-bold uppercase tracking-[1.8px] text-[#9B928D]">
                    {t('workspace')}
                </p>

                <nav className="flex w-full flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:justify-center lg:flex-col lg:justify-start">

                    <button
                        type="button"
                        onClick={() => {
                            setActiveView('dashboard')
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth',
                            })
                        }}
                        className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-3.5 transition-all duration-200 sm:w-auto sm:min-w-[145px] lg:w-full lg:min-w-0 ${
                            activeView === 'dashboard'
                                ? 'bg-[#60212E] text-white'
                                : 'bg-transparent text-[#766D69] hover:bg-white/65 hover:text-[#24191B]'
                        }`}
                    >
                        <LayoutDashboard
                            size={18}
                            strokeWidth={1.6}
                        />

                        <span className="text-xs font-medium">
                            {t('dashboard')}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setActiveView('tasks')

                            document
                                .getElementById(
                                    'tasks-section'
                                )
                                ?.scrollIntoView({
                                    behavior: 'smooth',
                                })
                        }}
                        className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-3.5 transition-colors duration-200 sm:w-auto sm:min-w-[145px] lg:w-full lg:min-w-0 ${
                            activeView === 'tasks'
                                ? 'bg-[#60212E] text-white hover:bg-[#481722]'
                                : 'bg-transparent text-[#766D69] hover:bg-white/65 hover:text-[#24191B]'
                        }`}
                    >
                        <ListTodo
                            size={18}
                            strokeWidth={1.6}
                        />

                        <span className="text-xs font-semibold">
                            {adminUser
                                ? t('allTasks')
                                : t('myTasks')}
                        </span>

                        <span className="ml-auto flex h-[22px] min-w-[25px] items-center justify-center rounded-full bg-white/15 px-[7px] text-[9px] font-semibold text-white">
                            {totalTasks}
                        </span>
                    </button>

                    {adminUser && (
                        <button
                            type="button"
                            onClick={() =>
                                navigate('/admin')
                            }
                            className="flex min-h-12 w-full items-center gap-3 rounded-xl bg-transparent px-3.5 text-[#766D69] transition-colors duration-200 hover:bg-white/65 hover:text-[#24191B] sm:w-auto sm:min-w-[145px] lg:w-full lg:min-w-0"
                        >
                            <ShieldCheck
                                size={18}
                                strokeWidth={1.6}
                            />

                            <span className="text-xs font-medium">
                                {t('adminPanel') ||
                                    'Admin Paneli'}
                            </span>
                        </button>
                    )}
                </nav>
            </div>

            <div className="mt-7 w-full lg:mt-auto">

                {user && (
                    <div className="mb-3 flex items-center justify-between gap-2 rounded-xl border border-[#24191B]/15 bg-white/60 px-3.5 py-3">

                        <div className="min-w-0">

                            <p className="truncate text-[11px] font-semibold text-[#24191B]">
                                {user.username}
                            </p>

                            <p className="text-[9px] uppercase tracking-[1.2px] text-[#766D69]">
                                {adminUser
                                    ? t('admin') ||
                                    'Yönetici'
                                    : t('user') ||
                                    'Kullanıcı'}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            aria-label={
                                t('logout') ||
                                'Çıkış Yap'
                            }
                            title={
                                t('logout') ||
                                'Çıkış Yap'
                            }
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#24191B]/15 text-[#60212E] transition-colors hover:bg-[#60212E] hover:text-white"
                        >
                            <LogOut
                                size={15}
                                strokeWidth={1.8}
                            />
                        </button>
                    </div>
                )}

                <div className="hidden w-full lg:block">

                    <div className="flex items-start gap-[11px] border-t border-[#24191B]/15 pt-[18px]">

                        <span className="mt-[5px] h-2 w-2 shrink-0 rounded-full bg-[#69ACC2]" />

                        <div>

                            <strong className="mb-[5px] block font-serif text-sm font-normal leading-[1.2] text-[#24191B]">
                                {t(
                                    'everythingInOnePlace'
                                )}
                            </strong>

                            <p className="text-[9px] leading-[1.55] text-[#766D69]">
                                {t('organizedWork')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}