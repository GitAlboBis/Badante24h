import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => request.cookies.getAll(),
                setAll: (cookiesToSet) => {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Protected routes
    const protectedPaths = ['/discover', '/chat', '/profile', '/settings', '/onboarding', '/dashboard']
    const adminPaths = ['/dashboard']
    const authPaths = ['/login', '/signup']

    const pathname = request.nextUrl.pathname

    // Redirect unauthenticated users away from protected routes
    if (!user && protectedPaths.some(p => pathname.startsWith(p))) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('redirect', pathname)
        return NextResponse.redirect(url)
    }

    // Redirect authenticated users away from auth pages
    if (user && authPaths.some(p => pathname.startsWith(p))) {
        return NextResponse.redirect(new URL('/discover', request.url))
    }

    // ── Onboarding guard ──
    // Routes that are exempt from the "must have profilo" check
    const onboardingExempt = ['/onboarding', '/settings']

    if (
        user &&
        protectedPaths.some(p => pathname.startsWith(p)) &&
        !onboardingExempt.some(p => pathname.startsWith(p))
    ) {
        const { data: profile } = await supabase
            .from('profili')
            .select('id, nome, ruolo')
            .eq('utente_id', user.id)
            .single()

        // No profilo row, or profilo exists but nome is empty → onboarding
        if (!profile || !profile.nome) {
            return NextResponse.redirect(new URL('/onboarding', request.url))
        }
    }

    // Admin check also for users who HAVE profiles but need admin role
    if (user && adminPaths.some(p => pathname.startsWith(p))) {
        const { data: profile } = await supabase
            .from('profili')
            .select('ruolo')
            .eq('utente_id', user.id)
            .single()

        if (profile?.ruolo !== 'admin') {
            return NextResponse.redirect(new URL('/discover', request.url))
        }
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|icons|sw.js|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
