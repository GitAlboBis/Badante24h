import { Check } from 'lucide-react'

interface StepIndicatorProps {
    steps: string[]
    currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
    return (
        <div className="flex items-center justify-center gap-0 w-full max-w-md mx-auto">
            {steps.map((label, index) => {
                const stepNum = index + 1
                const isCompleted = stepNum < currentStep
                const isActive = stepNum === currentStep

                return (
                    <div key={label} className="flex items-center flex-1 last:flex-none">
                        {/* Circle + label */}
                        <div className="flex flex-col items-center gap-1.5">
                            <div
                                className={`
                                    flex items-center justify-center w-9 h-9 rounded-full
                                    text-sm font-bold transition-all duration-300
                                    ${isCompleted
                                        ? 'bg-primary text-white shadow-md shadow-primary/30'
                                        : isActive
                                            ? 'bg-primary text-white shadow-lg shadow-primary/40 scale-110'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                    }
                                `}
                            >
                                {isCompleted ? <Check className="size-4 stroke-[3]" /> : stepNum}
                            </div>
                            <span
                                className={`
                                    text-[11px] font-semibold whitespace-nowrap
                                    ${isActive
                                        ? 'text-primary'
                                        : isCompleted
                                            ? 'text-slate-600 dark:text-slate-300'
                                            : 'text-slate-400'
                                    }
                                `}
                            >
                                {label}
                            </span>
                        </div>

                        {/* Connector line (not after last) */}
                        {index < steps.length - 1 && (
                            <div className="flex-1 mx-2 mb-6">
                                <div
                                    className={`
                                        h-0.5 rounded-full transition-colors duration-300
                                        ${stepNum < currentStep
                                            ? 'bg-primary'
                                            : 'bg-slate-200 dark:bg-slate-700'
                                        }
                                    `}
                                />
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
