import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Users, ListChecks, ArrowRight, LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { adminService } from '../services/adminService'
import { useAuth } from '../context/AuthContext'
import type { AdminUser } from '../types/admin'
import type { Task } from '../types/task'

export function AdminPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const [users, setUsers] = useState<AdminUser[]>([])
    const [tasks, setTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let isMounted = true

        Promise.all([adminService.getUsers(), adminService.getAllTasks()])
            .then(([userList, taskList]) => {
                if (!isMounted) return
                setUsers(userList)
                setTasks(taskList)
            })
            .catch(() => {
                if (!isMounted) return
                setError(t('adminLoadFailed') || 'Yönetici verileri yüklenirken bir hata oluştu.')
            })
            .finally(() => {
                if (isMounted) setIsLoading(false)
            })

        return () => {
            isMounted = false
        }
    }, [t])

    const activeUsers = users.filter((u) => u.active).length
    const passiveUsers = users.length - activeUsers
    const adminCount = users.filter((u) => u.role === 'ADMIN').length

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen w-full bg-[#FAF8F1] px-4 py-8 text-[#24191B] sm:px-8 xl:px-12 xl:py-12">
            <header className="flex flex-col items-start justify-between gap-6 border-b border-[#24191B]/15 pb-7 sm:flex-row sm:items-end">
                <div>
                    <p className="mb-[10px] flex items-center gap-2 text-[9px] font-bold uppercase tracking-[1.9px] text-[#60212E]">
                        <ShieldCheck size={13} strokeWidth={2} />
                        {t('adminPanel') || 'Admin Paneli'}
                    </p>
                    <h1 className="font-serif text-[38px] font-normal leading-[0.98] tracking-[-1.5px] text-[#24191B] sm:text-[46px]">
                        {t('adminOverview') || 'Sistem genel bakışı'}
                        <span className="text-[#69ACC2]">.</span>
                    </h1>
                    <p className="mt-3 max-w-[520px] text-[11px] leading-[1.65] text-[#766D69]">
                        {t('adminSubtitle') ||
                            'Kullanıcıları ve sistemdeki tüm görevleri buradan yönetebilirsiniz.'}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="flex h-[44px] items-center justify-center rounded-[12px] border border-[#24191B]/15 bg-white px-4 text-[11px] font-semibold text-[#24191B] transition-colors hover:border-[#60212E] hover:text-[#60212E]"
                    >
                        {t('backToWorkspace') || 'Çalışma Alanına Dön'}
                    </button>
                    <button
                        type="button"
                        onClick={handleLogout}
                        aria-label={t('logout') || 'Çıkış Yap'}
                        className="flex h-[44px] w-[44px] items-center justify-center rounded-[12px] border border-[#24191B]/15 bg-white text-[#60212E] transition-colors hover:bg-[#60212E] hover:text-white"
                    >
                        <LogOut size={16} strokeWidth={1.8} />
                    </button>
                </div>
            </header>

            {error && (
                <p className="mt-6 rounded-[10px] border border-[#B3261E]/25 bg-[#B3261E]/5 px-4 py-3 text-[11px] text-[#B3261E]">
                    {error}
                </p>
            )}

            <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label={t('totalUsers') || 'Toplam Kullanıcı'}
                    value={isLoading ? '—' : users.length}
                    icon={<Users size={18} strokeWidth={1.6} />}
                />
                <StatCard
                    label={t('activeUsers') || 'Aktif Kullanıcı'}
                    value={isLoading ? '—' : activeUsers}
                    icon={<ShieldCheck size={18} strokeWidth={1.6} />}
                />
                <StatCard
                    label={t('passiveUsers') || 'Pasif Kullanıcı'}
                    value={isLoading ? '—' : passiveUsers}
                    icon={<Users size={18} strokeWidth={1.6} />}
                />
                <StatCard
                    label={t('totalTasksSystemWide') || 'Sistemdeki Tüm Görevler'}
                    value={isLoading ? '—' : tasks.length}
                    icon={<ListChecks size={18} strokeWidth={1.6} />}
                />
            </section>

            <section className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <button
                    type="button"
                    onClick={() => navigate('/admin/users')}
                    className="group flex flex-col items-start justify-between rounded-[18px] border border-[#24191B]/12 bg-white p-6 text-left shadow-[0_10px_30px_rgba(36,25,27,0.04)] transition-all hover:-translate-y-0.5 hover:border-[#60212E] hover:shadow-[0_14px_34px_rgba(96,33,46,0.1)]"
                >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#60212E]/25 text-[#60212E]">
                        <Users size={19} strokeWidth={1.6} />
                    </div>
                    <div className="mt-5">
                        <h2 className="font-serif text-[20px] font-normal text-[#24191B]">
                            {t('userList') || 'Kullanıcı Listesi'}
                        </h2>
                        <p className="mt-1.5 text-[11px] leading-[1.6] text-[#766D69]">
                            {t('userListDesc') ||
                                'Kullanıcıları, rollerini görüntüleyin; aktif/pasif hale getirin.'}
                        </p>
                    </div>
                    <span className="mt-5 flex items-center gap-1.5 text-[11px] font-semibold text-[#60212E]">
                        {t('viewList') || 'Listeyi görüntüle'}
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                </button>

                <div className="rounded-[18px] border border-[#24191B]/12 bg-white p-6 shadow-[0_10px_30px_rgba(36,25,27,0.04)]">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#69ACC2]/40 text-[#69ACC2]">
                        <ListChecks size={19} strokeWidth={1.6} />
                    </div>
                    <div className="mt-5">
                        <h2 className="font-serif text-[20px] font-normal text-[#24191B]">
                            {t('roleSummary') || 'Rol Dağılımı'}
                        </h2>
                        <p className="mt-1.5 text-[11px] leading-[1.6] text-[#766D69]">
                            {(t('adminAccountsCount') || 'Yönetici hesap sayısı')}: {isLoading ? '—' : adminCount}
                        </p>
                        <p className="mt-1 text-[11px] leading-[1.6] text-[#766D69]">
                            {t('signedInAs') || 'Giriş yapan'}: {user?.username} ({user?.role})
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}

function StatCard({ label, value, icon }: { label: string; value: number | string; icon: ReactNode }) {
    return (
        <div className="rounded-[16px] border border-[#24191B]/12 bg-white p-5 shadow-[0_8px_22px_rgba(36,25,27,0.03)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FAF8F1] text-[#60212E]">
                {icon}
            </div>
            <p className="mt-4 font-serif text-[28px] font-normal leading-none text-[#24191B]">{value}</p>
            <p className="mt-1.5 text-[10px] uppercase tracking-[1px] text-[#766D69]">{label}</p>
        </div>
    )
}