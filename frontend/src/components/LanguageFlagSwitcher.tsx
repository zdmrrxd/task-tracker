import { useTranslation } from 'react-i18next'

function TurkeyFlag() {
    return (
        <svg
            viewBox="0 0 24 16"
            className="h-[16px] w-[24px] overflow-hidden rounded-[3px]"
            aria-hidden="true"
        >
            <rect width="24" height="16" fill="#E30A17" />

            <circle
                cx="10"
                cy="8"
                r="4.2"
                fill="white"
            />

            <circle
                cx="11.2"
                cy="8"
                r="3.35"
                fill="#E30A17"
            />

            <polygon
                points="15.8,8 18.2,8.8 16.7,6.8 16.7,9.2 18.2,7.2"
                fill="white"
            />
        </svg>
    )
}

function UnitedKingdomFlag() {
    return (
        <svg
            viewBox="0 0 24 16"
            className="h-[16px] w-[24px] overflow-hidden rounded-[3px]"
            aria-hidden="true"
        >
            <rect width="24" height="16" fill="#012169" />

            <path
                d="M0 0L24 16M24 0L0 16"
                stroke="white"
                strokeWidth="3"
            />

            <path
                d="M0 0L24 16M24 0L0 16"
                stroke="#C8102E"
                strokeWidth="1.25"
            />

            <rect
                x="10"
                width="4"
                height="16"
                fill="white"
            />

            <rect
                y="6"
                width="24"
                height="4"
                fill="white"
            />

            <rect
                x="11"
                width="2"
                height="16"
                fill="#C8102E"
            />

            <rect
                y="7"
                width="24"
                height="2"
                fill="#C8102E"
            />
        </svg>
    )
}

export function LanguageFlagSwitcher() {
    const { i18n } = useTranslation()
    const language = i18n.language

    return (
        <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-[#24191B]/15 bg-white/80 p-1 shadow-[0_6px_16px_rgba(36,25,27,0.06)] backdrop-blur-sm sm:right-6 sm:top-6">

            <button
                type="button"
                onClick={() => i18n.changeLanguage('tr')}
                aria-label="Türkçe"
                title="Türkçe"
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
                    language === 'tr'
                        ? 'bg-[#60212E]/10 ring-2 ring-[#60212E]'
                        : 'opacity-50 hover:opacity-100'
                }`}
            >
                <TurkeyFlag />
            </button>

            <button
                type="button"
                onClick={() => i18n.changeLanguage('en')}
                aria-label="English"
                title="English"
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
                    language === 'en'
                        ? 'bg-[#60212E]/10 ring-2 ring-[#60212E]'
                        : 'opacity-50 hover:opacity-100'
                }`}
            >
                <UnitedKingdomFlag />
            </button>

        </div>
    )
}