import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ShieldCheck, User as UserIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { adminService } from '../services/adminService'
import { useAuth } from '../context/AuthContext'
import type { AdminUser } from '../types/admin'

export function UserListPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { user: currentUser } = useAuth()

    const [users, setUsers] = useState<AdminUser[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [updatingId, setUpdatingId] = useState<number | null>(null)

    const loadUsers = () => {
        setIsLoading(true)
        adminService
            .getUsers()
            .then(setUsers)
            .catch(() => setError(t('userListLoadFailed') || 'Kullanıcılar yüklenirken bir hata oluştu.'))
            .finally(() => setIsLoading(false))
    }

    useEffect(() => {
        loadUsers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleToggleActive = async (target: AdminUser) => {
        if (target.id === currentUser?.id) {
            return
        }

        try {
            setUpdatingId(target.id)
            const updated = await adminService.setUserActive(target.id, !target.active)
            setUsers((current) => current.map((u) => (u.id === updated.id ? updated : u)))
        } catch (err: any) {
            alert(err.response?.data?.error || t('statusUpdateFailed') || 'Durum güncellenemedi.')
        } finally {
            setUpdatingId(null)
        }
    }

    return (
        <div className="min-h-screen w-full bg-[#FAF8F1] px-4 py-8 text-[#24191B] sm:px-8 xl:px-12 xl:py-12">
            <header className="flex flex-col gap-5 border-b border-[#24191B]/15 pb-7 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <button
                        type="button"
                        onClick={() => navigate('/admin')}
                        className="mb-4 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[1px] text-[#766D69] hover:text-[#60212E]"
                    >
                        <ArrowLeft size={13} strokeWidth={2} />
                        {t('adminPanel') || 'Admin Paneli'}
                    </button>
                    <h1 className="font-serif text-[36px] font-normal leading-[0.98] tracking-[-1.5px] text-[#24191B] sm:text-[44px]">
                        {t('userList') || 'Kullanıcı Listesi'}
                        <span className="text-[#69ACC2]">.</span>
                    </h1>
                    <p className="mt-3 max-w-[520px] text-[11px] leading-[1.65] text-[#766D69]">
                        {t('userListPageSubtitle') ||
                            'Tüm kullanıcıları, rollerini ve durumlarını görüntüleyin; hesapları aktif ya da pasif yapın.'}
                    </p>
                </div>
            </header>

            {error && (
                <p className="mt-6 rounded-[10px] border border-[#B3261E]/25 bg-[#B3261E]/5 px-4 py-3 text-[11px] text-[#B3261E]">
                    {error}
                </p>
            )}

            <section className="mt-8 overflow-hidden rounded-[18px] border border-[#24191B]/12 bg-white shadow-[0_10px_30px_rgba(36,25,27,0.04)]">
                <div className="grid grid-cols-[minmax(0,1fr)_140px_110px_140px] gap-3 border-b border-[#24191B]/10 bg-[#FAF8F1] px-5 py-3.5 text-[9px] font-bold uppercase tracking-[1.3px] text-[#766D69] sm:px-7">
                    <span>{t('user') || 'Kullanıcı'}</span>
                    <span>{t('role') || 'Rol'}</span>
                    <span>{t('status') || 'Durum'}</span>
                    <span className="text-right">{t('actions') || 'İşlem'}</span>
                </div>

                {isLoading && (
                    <p className="px-5 py-8 text-center text-[11px] text-[#766D69] sm:px-7">
                        {t('loading') || 'Yükleniyor…'}
                    </p>
                )}

                {!isLoading && users.length === 0 && !error && (
                    <p className="px-5 py-8 text-center text-[11px] text-[#766D69] sm:px-7">
                        {t('noUsersFound') || 'Kullanıcı bulunamadı.'}
                    </p>
                )}

                {!isLoading &&
                    users.map((u) => (
                        <div
                            key={u.id}
                            className="grid grid-cols-[minmax(0,1fr)_140px_110px_140px] items-center gap-3 border-b border-[#24191B]/8 px-5 py-4 text-[12px] last:border-b-0 sm:px-7"
                        >
                            <div className="min-w-0">
                                <p className="truncate font-medium text-[#24191B]">{u.username}</p>
                                <p className="truncate text-[10px] text-[#766D69]">{u.email}</p>
                            </div>

                            <span className="flex items-center gap-1.5 text-[11px] text-[#766D69]">
                                {u.role === 'ADMIN' ? (
                                    <ShieldCheck size={13} strokeWidth={1.8} className="text-[#60212E]" />
                                ) : (
                                    <UserIcon size={13} strokeWidth={1.8} />
                                )}
                                {u.role === 'ADMIN' ? (t('admin') || 'Yönetici') : (t('user') || 'Kullanıcı')}
                            </span>

                            <span
                                className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.6px] ${
                                    u.active
                                        ? 'bg-[#2E7D32]/10 text-[#2E7D32]'
                                        : 'bg-[#766D69]/10 text-[#766D69]'
                                }`}
                            >
                                {u.active ? (t('active') || 'Aktif') : (t('passive') || 'Pasif')}
                            </span>

                            <div className="text-right">
                                <button
                                    type="button"
                                    disabled={u.id === currentUser?.id || updatingId === u.id}
                                    onClick={() => handleToggleActive(u)}
                                    title={
                                        u.id === currentUser?.id
                                            ? t('cannotDeactivateSelf') || 'Kendi hesabınızı pasif yapamazsınız.'
                                            : undefined
                                    }
                                    className={`rounded-[10px] border px-3.5 py-2 text-[10px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                                        u.active
                                            ? 'border-[#B3261E]/30 text-[#B3261E] hover:bg-[#B3261E]/5'
                                            : 'border-[#2E7D32]/30 text-[#2E7D32] hover:bg-[#2E7D32]/5'
                                    }`}
                                >
                                    {updatingId === u.id
                                        ? (t('updating') || 'Güncelleniyor…')
                                        : u.active
                                            ? (t('deactivate') || 'Pasif Yap')
                                            : (t('activate') || 'Aktif Yap')}
                                </button>
                            </div>
                        </div>
                    ))}
            </section>
        </div>
    )
}