import { clsx } from 'clsx'

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

const sizeMap = {
    sm: 'size-4',
    md: 'size-6',
    lg: 'size-8',
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
    return (
        <svg
            className={clsx('animate-spin text-current', sizeMap[size], className)}
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
    )
}
