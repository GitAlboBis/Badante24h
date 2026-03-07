'use client'

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    icon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, className, id, ...rest }, ref) => {
        const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                        {label}
                    </label>
                )}

                <div className="relative">
                    {icon && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            {icon}
                        </span>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        className={twMerge(
                            clsx(
                                'w-full h-11 rounded-xl border bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-slate-100',
                                'placeholder:text-slate-400 dark:placeholder:text-slate-500',
                                'transition-colors duration-150',
                                'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary',
                                error
                                    ? 'border-error focus:ring-error/40 focus:border-error'
                                    : 'border-slate-200 dark:border-slate-700',
                                icon && 'pl-10',
                                className,
                            ),
                        )}
                        {...rest}
                    />
                </div>

                {error && (
                    <p className="text-xs text-error font-medium mt-0.5">
                        {error}
                    </p>
                )}
            </div>
        )
    },
)

Input.displayName = 'Input'
