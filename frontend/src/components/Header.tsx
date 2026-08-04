import { Plus, Search } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'

interface HeaderProps {
    greeting: string
    searchTerm: string
    setSearchTerm: (value: string) => void
    onOpenTaskModal: () => void
}

export function Header({ greeting, searchTerm, setSearchTerm, onOpenTaskModal }: HeaderProps) {
    const { t } = useLanguage()

    return (
        <header className="flex min-h-0 w-full flex-col items-start justify-between gap-10 border-b border-[#24191B]/15 pb-[34px] xl:min-h-[215px] xl:flex-row xl:items-end">
            <div className="min-w-0">
                <p className="mb-[14px] text-[9px] font-bold uppercase tracking-[1.9px] text-[#60212E]">
                    {t.myWorkspace || 'MY WORKSPACE'} / {t.tasks?.toUpperCase() || 'TASKS'}
                </p>
                <h1 className="font-serif text-[44px] font-normal leading-[0.98] tracking-[-1.5px] text-[#24191B] sm:text-[54px] xl:text-[64px] xl:tracking-[-2.2px]">
                    {greeting}
                    <span className="text-[#69ACC2]">.</span>
                </h1>
                <p className="mt-[18px] max-w-[470px] text-[11px] leading-[1.65] text-[#766D69] sm:text-xs">
                    {t.headerSubtitle || 'Everything you need to manage your tasks, all in one place.'}
                </p>
            </div>

            <div className="flex w-full flex-col items-stretch gap-[11px] sm:flex-row sm:items-center xl:w-auto xl:shrink-0">
                <div className="flex h-[50px] w-full items-center gap-[11px] rounded-[14px] border border-[#24191B]/15 bg-white px-[17px] transition-all duration-200 focus-within:border-[#69ACC2] focus-within:ring-[3px] focus-within:ring-[#69ACC2]/10 sm:flex-1 xl:w-[340px] xl:flex-none">
                    <Search size={17} strokeWidth={1.6} className="shrink-0 text-[#766D69]" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder={t.searchTasks || 'Search your tasks'}
                        aria-label={t.searchTasks || 'Search your tasks'}
                        className="w-full min-w-0 border-0 bg-transparent text-[11px] text-[#24191B] outline-none placeholder:text-[#9B928D]"
                    />
                </div>

                <button
                    type="button"
                    onClick={onOpenTaskModal}
                    className="flex h-[50px] items-center justify-center gap-[9px] whitespace-nowrap rounded-[14px] bg-[#60212E] px-[21px] text-[11px] font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-[#481722] hover:shadow-[0_8px_18px_rgba(96,33,46,0.12)]"
                >
                    <Plus size={17} strokeWidth={2} />
                    <span>{t.newTask}</span>
                </button>
            </div>
        </header>
    )
}