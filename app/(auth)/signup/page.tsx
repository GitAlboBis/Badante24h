import Link from 'next/link'
import { SignupForm } from '@/components/auth/signup-form'
import { SocialLoginButton } from '@/components/auth/social-login-button'

export default function SignupPage() {
    return (
        <>
            {/* Logo + heading */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-primary/10 mb-4">
                    <span className="text-2xl">🤝</span>
                </div>
                <h1 className="text-2xl font-black tracking-tight">
                    Crea il tuo account
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Unisciti a Badante24h — è gratis
                </p>
            </div>

            {/* Social login */}
            <SocialLoginButton provider="google" label="Registrati con Google" />

            {/* Divider */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-medium">
                        oppure con email
                    </span>
                </div>
            </div>

            {/* Signup form */}
            <SignupForm />

            {/* Login link */}
            <p className="text-center text-sm text-slate-500 mt-6">
                Hai già un account?{' '}
                <Link
                    href="/login"
                    className="text-primary font-semibold hover:underline"
                >
                    Accedi
                </Link>
            </p>
        </>
    )
}
