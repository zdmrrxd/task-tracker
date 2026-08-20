import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { MousePointer2, Eye, EyeOff, UserPlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import { tokenStorage } from '../services/apiClient'
import { LanguageFlagSwitcher } from '../components/LanguageFlagSwitcher'

export function RegisterPage() {
    const { t } = useTranslation()
    const { isAuthenticated, isLoading, setSession } = useAuth()
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    if (!isLoading && isAuthenticated) {
        return <Navigate to="/" replace />
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')

        if (!username.trim() || !email.trim() || !password) {
            setError(t('registerFieldsRequired') || 'Tüm alanların doldurulması zorunludur.')
            return
        }

        if (username.trim().length < 3) {
            setError(t('usernameTooShort') || 'Kullanıcı adı en az 3 karakter olmalıdır.')
            return
        }

        if (password.length < 6) {
            setError(t('passwordTooShort') || 'Şifre en az 6 karakter olmalıdır.')
            return
        }

        if (password !== confirmPassword) {
            setError(t('passwordsDoNotMatch') || 'Şifreler eşleşmiyor.')
            return
        }

        try {
            setIsSubmitting(true)
            const { token, user } = await authService.register({
                username: username.trim(),
                email: email.trim(),
                password,
            })
            tokenStorage.set(token)
            setSession(user)
            navigate('/', { replace: true })
        } catch (err: any) {
            const data = err.response?.data
            const message =
                data?.error ||
                (data && typeof data === 'object' ? Object.values(data).join('\n') : null) ||
                t('registerFailed') ||
                'Kayıt oluşturulamadı. Lütfen tekrar deneyin.'
            setError(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center bg-[#FAF8F1] px-4 py-10 text-[#24191B]">
            <LanguageFlagSwitcher />
            <div className="w-full max-w-[420px]">
                <div className="mb-9 flex flex-col items-center text-center">
                    <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full border border-[#60212E] bg-white text-[#60212E] shadow-[0_10px_30px_rgba(96,33,46,0.08)]">
                        <MousePointer2 size={26} strokeWidth={1.5} />
                    </div>
                    <div className="mt-5 flex items-baseline justify-center font-serif text-[38px] font-normal leading-none tracking-[-1.5px]">
                        <span>CLIQ</span>
                        <span className="text-[#69ACC2]">.</span>
                    </div>
                    <p className="mt-3 text-[9px] font-semibold uppercase leading-[1.5] tracking-[2px] text-[#766D69]">
                        {t('logoSubtitle') || 'PLAN. CLICK. DONE.'}
                    </p>
                </div>

                <div className="rounded-[20px] border border-[#24191B]/10 bg-white p-7 shadow-[0_20px_50px_rgba(36,25,27,0.06)] sm:p-9">
                    <h1 className="font-serif text-[26px] font-normal leading-tight text-[#24191B]">
                        {t('createAccount') || 'Hesap Oluştur'}
                    </h1>
                    <p className="mt-2 text-[11px] leading-[1.6] text-[#766D69]">
                        {t('registerSubtitle') || 'Görevlerinizi yönetmeye başlamak için birkaç saniyede kaydolun.'}
                    </p>

                    <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
                        <div>
                            <label
                                htmlFor="username"
                                className="mb-[7px] block text-[10px] font-semibold uppercase tracking-[1px] text-[#766D69]"
                            >
                                {t('username') || 'Kullanıcı Adı'}
                            </label>
                            <input
                                id="username"
                                type="text"
                                autoComplete="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder={t('usernamePlaceholder') || 'kullanici_adi'}
                                className="h-[48px] w-full rounded-[12px] border border-[#24191B]/15 bg-[#FAF8F1] px-4 text-[12px] text-[#24191B] outline-none transition-all duration-200 placeholder:text-[#9B928D] focus:border-[#69ACC2] focus:ring-[3px] focus:ring-[#69ACC2]/10"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="mb-[7px] block text-[10px] font-semibold uppercase tracking-[1px] text-[#766D69]"
                            >
                                {t('email') || 'E-posta'}
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ornek@eposta.com"
                                className="h-[48px] w-full rounded-[12px] border border-[#24191B]/15 bg-[#FAF8F1] px-4 text-[12px] text-[#24191B] outline-none transition-all duration-200 placeholder:text-[#9B928D] focus:border-[#69ACC2] focus:ring-[3px] focus:ring-[#69ACC2]/10"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-[7px] block text-[10px] font-semibold uppercase tracking-[1px] text-[#766D69]"
                            >
                                {t('password') || 'Şifre'}
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="h-[48px] w-full rounded-[12px] border border-[#24191B]/15 bg-[#FAF8F1] px-4 pr-11 text-[12px] text-[#24191B] outline-none transition-all duration-200 placeholder:text-[#9B928D] focus:border-[#69ACC2] focus:ring-[3px] focus:ring-[#69ACC2]/10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? (t('hidePassword') || 'Şifreyi gizle') : (t('showPassword') || 'Şifreyi göster')}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#766D69] hover:text-[#24191B]"
                                >
                                    {showPassword ? <EyeOff size={16} strokeWidth={1.6} /> : <Eye size={16} strokeWidth={1.6} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="mb-[7px] block text-[10px] font-semibold uppercase tracking-[1px] text-[#766D69]"
                            >
                                {t('confirmPassword') || 'Şifre (Tekrar)'}
                            </label>
                            <input
                                id="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="h-[48px] w-full rounded-[12px] border border-[#24191B]/15 bg-[#FAF8F1] px-4 text-[12px] text-[#24191B] outline-none transition-all duration-200 placeholder:text-[#9B928D] focus:border-[#69ACC2] focus:ring-[3px] focus:ring-[#69ACC2]/10"
                            />
                        </div>

                        {error && (
                            <p className="whitespace-pre-line rounded-[10px] border border-[#B3261E]/25 bg-[#B3261E]/5 px-3.5 py-2.5 text-[11px] leading-[1.5] text-[#B3261E]">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-2 flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#60212E] text-[12px] font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-[#481722] hover:shadow-[0_8px_18px_rgba(96,33,46,0.12)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <UserPlus size={16} strokeWidth={2} />
                            <span>{isSubmitting ? (t('creatingAccount') || 'Hesap oluşturuluyor…') : (t('register') || 'Kayıt Ol')}</span>
                        </button>
                    </form>

                    <p className="mt-6 text-center text-[11px] text-[#766D69]">
                        {t('alreadyHaveAccount') || 'Zaten hesabın var mı?'}{' '}
                        <Link to="/login" className="font-semibold text-[#60212E] hover:underline">
                            {t('login') || 'Giriş Yap'}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}