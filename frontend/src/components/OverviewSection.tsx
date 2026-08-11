import { CalendarDays, Check, Clock3, Layers3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface OverviewSectionProps {
    totalTasks: number
    inProgressTasks: number
    completedTasks: number
    dueTodayTasks: number
}

const statBase = `
  min-h-[210px] min-w-0 rounded-[18px] border p-[19px] flex flex-col
  transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_14px_30px_rgba(57,42,38,0.07)]
`

export function OverviewSection({
                                    totalTasks,
                                    inProgressTasks,
                                    completedTasks,
                                    dueTodayTasks,
                                }: OverviewSectionProps) {
    const { t } = useTranslation()

    return (
        <section className="grid w-full grid-cols-1 gap-[30px] border-b border-[#24191B]/15 py-[38px] sm:py-12 xl:grid-cols-[245px_minmax(0,1fr)] xl:gap-[50px]">
            <div className="max-w-[470px] pt-[5px]">
                <p className="mb-[14px] text-[9px] font-bold uppercase tracking-[1.9px] text-[#60212E]">
                    {t('overview')}
                </p>

                <h2 className="font-serif text-[34px] font-normal leading-[1.03] tracking-[-1.3px] text-[#24191B] sm:text-[38px]">
                    {t('yourWork')}
                    <br />
                    {t('atAGlance')}
                </h2>

                <p className="mt-[19px] max-w-[350px] text-[11px] leading-[1.7] text-[#766D69] xl:max-w-[215px]">
                    {t('trackTasks')}
                </p>
            </div>

            <div className="grid w-full grid-cols-1 gap-3 min-[421px]:grid-cols-2 2xl:grid-cols-4">
                <article className={`${statBase} border-[#24191B]/15 bg-white text-[#24191B]`}>
                    <div className="flex items-center justify-between">
                        <span className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-current opacity-80">
                            <Layers3 size={18} strokeWidth={1.5} />
                        </span>

                        <span className="text-[8px] font-semibold opacity-55">01</span>
                    </div>

                    <div className="mt-auto font-serif text-[43px] leading-none tracking-[-1px] sm:text-[52px]">
                        {totalTasks}
                    </div>

                    <div className="mt-[17px] flex flex-col gap-[5px] border-t border-current pt-[13px]">
                        <strong className="text-[11px] font-semibold">
                            {t('totalTasks')}
                        </strong>

                        <span className="text-[9px] opacity-60">
                            {t('allYourTasks')}
                        </span>
                    </div>
                </article>

                <article className={`${statBase} border-[#69ACC2] bg-[#69ACC2] text-white`}>
                    <div className="flex items-center justify-between">
                        <span className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/50">
                            <Clock3 size={18} strokeWidth={1.5} />
                        </span>

                        <span className="text-[8px] font-semibold text-white/75">
                            02
                        </span>
                    </div>

                    <div className="mt-auto font-serif text-[43px] leading-none sm:text-[52px]">
                        {inProgressTasks}
                    </div>

                    <div className="mt-[17px] flex flex-col gap-[5px] border-t border-white/65 pt-[13px]">
                        <strong className="text-[11px] font-semibold">
                            {t('inProgress')}
                        </strong>

                        <span className="text-[9px] text-white/75">
                            {t('currentlyActive')}
                        </span>
                    </div>
                </article>

                <article className={`${statBase} border-[#60212E] bg-[#60212E] text-white`}>
                    <div className="flex items-center justify-between">
                        <span className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/40">
                            <Check size={18} strokeWidth={1.7} />
                        </span>

                        <span className="text-[8px] font-semibold text-white/70">
                            03
                        </span>
                    </div>

                    <div className="mt-auto font-serif text-[43px] leading-none sm:text-[52px]">
                        {completedTasks}
                    </div>

                    <div className="mt-[17px] flex flex-col gap-[5px] border-t border-white/65 pt-[13px]">
                        <strong className="text-[11px] font-semibold">
                            {t('completed')}
                        </strong>

                        <span className="text-[9px] text-white/70">
                            {t('finishedTasks')}
                        </span>
                    </div>
                </article>

                <article className={`${statBase} border-[#453D38]/20 bg-[#D8D1BD] text-[#453D38]`}>
                    <div className="flex items-center justify-between">
                        <span className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-current opacity-80">
                            <CalendarDays size={18} strokeWidth={1.5} />
                        </span>

                        <span className="text-[8px] font-semibold opacity-55">
                            04
                        </span>
                    </div>

                    <div className="mt-auto font-serif text-[43px] leading-none sm:text-[52px]">
                        {dueTodayTasks}
                    </div>

                    <div className="mt-[17px] flex flex-col gap-[5px] border-t border-current pt-[13px]">
                        <strong className="text-[11px] font-semibold">
                            {t('dueToday')}
                        </strong>

                        <span className="text-[9px] opacity-60">
                            {t('tasksDueToday')}
                        </span>
                    </div>
                </article>
            </div>
        </section>
    )
}