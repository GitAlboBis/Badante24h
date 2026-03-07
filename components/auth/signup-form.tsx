'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const signupSchema = z
    .object({
        nome: z.string().min(2, 'Il nome deve avere almeno 2 caratteri'),
        email: z
            .string()
            .min(1, 'Inserisci la tua email')
            .email('Inserisci un indirizzo email valido'),
        password: z
            .string()
            .min(6, 'La password deve avere almeno 6 caratteri'),
        confirmPassword: z.string(),
        ruolo: z.enum(['famiglia', 'badante'], {
            message: 'Seleziona il tuo ruolo',
        }),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: 'Le password non corrispondono',
        path: ['confirmPassword'],
    })

type SignupValues = z.infer<typeof signupSchema>

const ruoloOptions = [
    {
        value: 'famiglia' as const,
        label: 'Cerco una badante',
        emoji: '🏠',
        description: 'Sono una famiglia in cerca di assistenza',
    },
    {
        value: 'badante' as const,
        label: 'Sono una badante',
        emoji: '💙',
        description: 'Offro servizi di assistenza domiciliare',
    },
]

export function SignupForm() {
    const [serverError, setServerError] = useState<string | null>(null)
    const [emailSent, setEmailSent] = useState(false)

    const [selectedRuolo, setSelectedRuolo] = useState<'famiglia' | 'badante' | undefined>()

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<SignupValues>({
        resolver: zodResolver(signupSchema),
    })

    async function onSubmit(values: SignupValues) {
        setServerError(null)
        const supabase = createClient()

        const { error } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
            options: {
                data: {
                    nome: values.nome,
                    ruolo: values.ruolo,
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (error) {
            if (error.message.includes('already registered')) {
                setServerError(
                    'Un account con questa email esiste già. Prova ad accedere.',
                )
            } else {
                setServerError(error.message)
            }
            return
        }

        setEmailSent(true)
    }

    /* ── Success state ── */
    if (emailSent) {
        return (
            <div className="flex flex-col items-center text-center py-6 space-y-4">
                <div className="size-16 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="size-8 text-emerald-500" />
                </div>
                <h2 className="text-xl font-bold">Controlla la tua email</h2>
                <p className="text-sm text-slate-500 max-w-xs">
                    Ti abbiamo inviato un link di conferma. Clicca sul link
                    nell&apos;email per attivare il tuo account.
                </p>
            </div>
        )
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

            {/* Role selector */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Come vuoi usare Badante24h?
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {ruoloOptions.map((opt) => {
                        const active = selectedRuolo === opt.value
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                    setSelectedRuolo(opt.value)
                                    setValue('ruolo', opt.value, { shouldValidate: true })
                                }}
                                className={`flex flex-col items-center gap-1 p-4 rounded-xl border-2 transition-all text-center cursor-pointer ${
                                    active
                                        ? 'border-primary bg-primary/5 shadow-sm'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                }`}
                            >
                                <span className="text-2xl">{opt.emoji}</span>
                                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                    {opt.label}
                                </span>
                                <span className="text-[11px] text-slate-400 leading-tight">
                                    {opt.description}
                                </span>
                            </button>
                        )
                    })}
                </div>
                {errors.ruolo && (
                    <p className="text-xs text-error font-medium">
                        {errors.ruolo.message}
                    </p>
                )}
            </div>

            <Input
                label="Nome completo"
                placeholder="Mario Rossi"
                icon={<User className="size-4" />}
                error={errors.nome?.message}
                autoComplete="name"
                {...register('nome')}
            />

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
                placeholder="Almeno 6 caratteri"
                icon={<Lock className="size-4" />}
                error={errors.password?.message}
                autoComplete="new-password"
                {...register('password')}
            />

            <Input
                label="Conferma password"
                type="password"
                placeholder="Ripeti la password"
                icon={<Lock className="size-4" />}
                error={errors.confirmPassword?.message}
                autoComplete="new-password"
                {...register('confirmPassword')}
            />

            <Button type="submit" fullWidth loading={isSubmitting}>
                Crea account
            </Button>
        </form>
    )
}
