'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Inserisci la tua email')
        .email('Inserisci un indirizzo email valido'),
    password: z
        .string()
        .min(6, 'La password deve avere almeno 6 caratteri'),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginForm() {
    const [serverError, setServerError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
    })

    async function onSubmit(values: LoginValues) {
        setServerError(null)
        const supabase = createClient()

        const { error } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
        })

        if (error) {
            if (error.message.includes('Invalid login credentials')) {
                setServerError('Email o password non corretti.')
            } else {
                setServerError(error.message)
            }
            return
        }

        // Middleware handles redirect — force a full navigation so cookies are picked up
        const params = new URLSearchParams(window.location.search)
        const redirect = params.get('redirect') ?? '/discover'
        window.location.assign(redirect)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Server error */}
            {serverError && (
                <div className="flex items-start gap-2 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-3 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="size-4 mt-0.5 shrink-0" />
                    <span>{serverError}</span>
                </div>
            )}

            <Input
                label="Email"
                type="email"
                placeholder="mario@email.com"
                icon={<Mail className="size-4" />}
                error={errors.email?.message}
                autoComplete="email"
                {...register('email')}
            />

            <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={<Lock className="size-4" />}
                error={errors.password?.message}
                autoComplete="current-password"
                {...register('password')}
            />

            {/* Forgot password link */}
            <div className="flex justify-end">
                <button
                    type="button"
                    className="text-xs text-primary hover:underline font-medium"
                    onClick={() => {
                        // TODO: implement password reset flow
                    }}
                >
                    Password dimenticata?
                </button>
            </div>

            <Button type="submit" fullWidth loading={isSubmitting}>
                Accedi
            </Button>
        </form>
    )
}
