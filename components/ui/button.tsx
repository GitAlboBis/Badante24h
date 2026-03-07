'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/* ── Variant × Size maps ── */

const variantStyles = {
    primary:
        'bg-primary text-white hover:bg-primary-hover shadow-md shadow-primary/20 active:shadow-sm',
    outline:
        'border-2 border-primary text-primary hover:bg-primary/5 active:bg-primary/10',
    ghost:
        'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
    danger:
        'bg-error text-white hover:bg-red-600 shadow-md shadow-error/20',
} as const

const sizeStyles = {
    sm: 'h-9 px-3.5 text-sm rounded-lg gap-1.5',
    md: 'h-11 px-5 text-sm rounded-xl gap-2',
    lg: 'h-13 px-6 text-base rounded-xl gap-2.5',
} as const

/* ── Props ── */

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof variantStyles
    size?: keyof typeof sizeStyles
    loading?: boolean
    fullWidth?: boolean
}

/* ── Component ── */

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            loading = false,
            fullWidth = false,
            disabled,
            className,
            children,
            ...rest
        },
        ref,
    ) => {
        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={twMerge(
                    clsx(
                        'inline-flex items-center justify-center font-semibold transition-all duration-150 cursor-pointer select-none',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                        'disabled:opacity-50 disabled:pointer-events-none',
                        variantStyles[variant],
                        sizeStyles[size],
                        fullWidth && 'w-full',
                        className,
                    ),
                )}
                {...rest}
            >
                {loading && (
                    <svg
                        className="animate-spin size-4 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="opacity-25"
                        />
                        <path
                            d="M4 12a8 8 0 018-8"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            className="opacity-75"
                        />
                    </svg>
                )}
                {children}
            </button>
        )
    },
)

Button.displayName = 'Button'
