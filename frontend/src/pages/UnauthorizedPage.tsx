import { ShieldAlert } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function UnauthorizedPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#FAF8F1] px-4 text-center text-[#24191B]">
            <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full border border-[#60212E]/40 bg-white text-[#60212E] shadow-[0_10px_30px_rgba(96,33,46,0.08)]">
                <ShieldAlert size={32} strokeWidth={1.5} />
            </div>

            <h1 className="mt-7 font-serif text-[32px] font-normal leading-tight sm:text-[38px]">
                {t('unauthorizedTitle') || 'Yetkisiz Erişim'}
            </h1>

            <p className="mt-3 max-w-[420px] text-[12px] leading-[1.7] text-[#766D69]">
                {t('unauthorizedMessage') ||
                    'Bu sayfayı görüntülemek için gerekli yetkiye sahip değilsiniz. Bu işlem için yönetici (ADMIN) rolü gereklidir.'}
            </p>

            <button
                type="button"
                onClick={() => navigate('/')}
                className="mt-8 flex h-[48px] items-center justify-center rounded-[14px] bg-[#60212E] px-7 text-[12px] font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-[#481722] hover:shadow-[0_8px_18px_rgba(96,33,46,0.12)]"
            >
                {t('backToHome') || 'Ana Sayfaya Dön'}
            </button>
        </div>
    )
}