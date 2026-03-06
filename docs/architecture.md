# Badante24h — Application Architecture

> **Version:** 1.0  
> **Date:** 2026-03-02

---

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   Next.js App (React 19)                   │ │
│  │  ┌─────────────┐ ┌────────────┐ ┌───────────────────────┐ │ │
│  │  │   Server     │ │  Client    │ │   Service Worker      │ │ │
│  │  │ Components   │ │ Components │ │   (PWA + Push)        │ │ │
│  │  │ (SSR/RSC)    │ │ ('use      │ │                       │ │ │
│  │  │              │ │  client')  │ │                       │ │ │
│  │  └──────┬───────┘ └─────┬──────┘ └───────────────────────┘ │ │
│  │         │               │                                   │ │
│  │  ┌──────▼───────────────▼──────────────────────────────┐   │ │
│  │  │            Supabase Client (per-context)            │   │ │
│  │  │   Server: createServerClient(@supabase/ssr)         │   │ │
│  │  │   Browser: createBrowserClient(@supabase/ssr)       │   │ │
│  │  └─────────────────────┬───────────────────────────────┘   │ │
│  └────────────────────────┼────────────────────────────────────┘ │
└───────────────────────────┼─────────────────────────────────────┘
                            │ HTTPS + WSS
┌───────────────────────────▼─────────────────────────────────────┐
│                     SUPABASE PLATFORM                           │
│                                                                 │
│  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌─────────────────┐   │
│  │   Auth   │ │ PostgREST │ │ Realtime │ │    Storage       │   │
│  │ (GoTrue) │ │  (REST)   │ │  (WS)    │ │   (S3-compat)   │   │
│  └────┬─────┘ └─────┬─────┘ └────┬─────┘ └────────┬────────┘   │
│       │              │            │                │            │
│  ┌────▼──────────────▼────────────▼────────────────▼────────┐   │
│  │              PostgreSQL 15 + PostGIS 3.x                 │   │
│  │                  Row Level Security                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │             Edge Functions (Deno Runtime)                │   │
│  │   send-push-notification  •  geocode-address             │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Data Flow Diagrams

### 2.1 Authentication Flow

```
User → Landing Page → Click "Sign Up"
  │
  ├─ Email/Password ──► Server Action: signUp()
  │                         │
  │                         ├─ Supabase Auth creates auth.users row
  │                         ├─ DB Trigger: creates profiles row (role from metadata)
  │                         └─ Redirect → /onboarding
  │
  └─ Google OAuth ────► Supabase Auth → OAuth callback `/auth/callback`
                            │
                            ├─ Exchange code for session
                            ├─ DB Trigger: creates profiles row
                            └─ Redirect → /onboarding

Middleware (every request):
  middleware.ts → createServerClient → supabase.auth.getUser()
    ├─ Session valid → refresh cookies, continue
    ├─ Session expired → refresh token via cookies
    └─ No session + protected route → redirect → /login
```

### 2.2 Geolocation Discovery Flow

```
Family User → Home/Discovery Page
  │
  ├─ Browser Geolocation API → navigator.geolocation.getCurrentPosition()
  │     ├─ Success → (lat, lng) stored in client state
  │     └─ Denied → Show manual address input
  │
  ├─ Client calls: supabase.rpc('search_caregivers_nearby', { lat, lng, radius })
  │     │
  │     └─ PostgreSQL executes PostGIS ST_DWithin query
  │           └─ Returns: profiles + distance_km, ordered by proximity
  │
  └─ Results rendered in:
        ├─ List/Grid View (default) → CaregiverCard components
        └─ Map View (toggle) → Leaflet map with marker pins
```

### 2.3 Real-Time Chat Flow

```
Family → Clicks "Contact" on Caregiver Profile
  │
  ├─ Server Action: getOrCreateConversation(familyId, caregiverId)
  │     └─ RPC: get_or_create_conversation() → returns conversation_id
  │
  └─ Navigate → /chat/[conversationId]
        │
        ├─ Load: fetch existing messages (paginated, DESC)
        │
        ├─ Subscribe: supabase.channel(`conversation:${id}`)
        │     ├─ .on('postgres_changes', { table: 'messages', filter }) → new messages
        │     ├─ .on('presence', { event: 'sync' }) → online/offline
        │     └─ .on('broadcast', { event: 'typing' }) → typing indicator
        │
        └─ Send: INSERT into messages table → triggers:
              ├─ Realtime broadcast to other participant
              ├─ DB trigger: update conversation.last_message_at
              ├─ DB trigger: increment unread_count
              └─ Edge Function: send push notification (if offline)
```

---

## 3. Project Folder Structure

```
badante24h/
├── .env.local                          # Supabase keys (never committed)
├── .env.example                        # Template for env vars
├── next.config.ts                      # Next.js + PWA config
├── tailwind.config.ts                  # Tailwind customizations
├── tsconfig.json
├── middleware.ts                        # Auth session refresh + route protection
├── manifest.json                        # PWA manifest
│
├── public/
│   ├── icons/                          # PWA icons (192x192, 512x512)
│   ├── sw.js                           # Service Worker (generated)
│   └── favicon.ico
│
├── supabase/
│   ├── config.toml                     # Local Supabase config
│   ├── migrations/                     # SQL migration files
│   │   ├── 00001_create_extensions.sql
│   │   ├── 00002_create_enums.sql
│   │   ├── 00003_create_profiles.sql
│   │   ├── 00004_create_caregiver_details.sql
│   │   ├── 00005_create_documents.sql
│   │   ├── 00006_create_conversations.sql
│   │   ├── 00007_create_messages.sql
│   │   ├── 00008_create_push_subscriptions.sql
│   │   ├── 00009_create_rls_policies.sql
│   │   ├── 00010_create_storage_buckets.sql
│   │   └── 00011_create_rpc_functions.sql
│   └── seed.sql                        # Development seed data
│
├── types/
│   ├── supabase.ts                     # Auto-generated DB types
│   └── index.ts                        # App-level type definitions
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   # createBrowserClient (Client Components)
│   │   ├── server.ts                   # createServerClient (Server Components/Actions)
│   │   └── middleware.ts               # createServerClient (Middleware)
│   ├── utils.ts                        # cn() helper, formatDistance(), etc.
│   └── constants.ts                    # App constants, default radius, etc.
│
├── hooks/
│   ├── use-geolocation.ts              # Browser Geolocation API hook
│   ├── use-realtime-messages.ts        # Supabase Realtime subscription
│   ├── use-presence.ts                 # Online/offline presence
│   └── use-user.ts                     # Current user context
│
├── stores/
│   └── filters-store.ts               # Zustand store for discovery filters
│
├── components/
│   ├── ui/                             # Reusable primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── skeleton.tsx
│   │   └── spinner.tsx
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── bottom-nav.tsx              # Mobile bottom navigation
│   │   └── sidebar.tsx                 # Desktop sidebar (admin)
│   ├── auth/
│   │   ├── login-form.tsx
│   │   ├── signup-form.tsx
│   │   └── social-login-button.tsx
│   ├── profile/
│   │   ├── caregiver-card.tsx          # Discovery result card
│   │   ├── profile-header.tsx
│   │   ├── skills-badge-list.tsx
│   │   ├── availability-grid.tsx
│   │   └── photo-uploader.tsx
│   ├── discovery/
│   │   ├── search-bar.tsx
│   │   ├── filter-sheet.tsx
│   │   ├── results-grid.tsx
│   │   └── map-view.tsx
│   └── chat/
│       ├── conversation-list.tsx
│       ├── conversation-item.tsx
│       ├── message-bubble.tsx
│       ├── message-input.tsx
│       ├── typing-indicator.tsx
│       └── online-badge.tsx
│
├── app/
│   ├── layout.tsx                      # Root layout (fonts, metadata, providers)
│   ├── page.tsx                        # Landing page
│   ├── globals.css                     # Tailwind imports + custom properties
│   ├── not-found.tsx
│   │
│   ├── (auth)/                         # Auth route group (no layout chrome)
│   │   ├── layout.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts            # OAuth callback handler
│   │
│   ├── (app)/                          # Authenticated route group
│   │   ├── layout.tsx                  # App shell: header + bottom nav
│   │   ├── onboarding/
│   │   │   └── page.tsx                # Multi-step onboarding wizard
│   │   ├── discover/
│   │   │   ├── page.tsx                # Discovery / search results
│   │   │   └── loading.tsx
│   │   ├── profile/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx            # View caregiver profile
│   │   │   └── edit/
│   │   │       └── page.tsx            # Edit own profile
│   │   ├── chat/
│   │   │   ├── page.tsx                # Conversation list (inbox)
│   │   │   ├── [conversationId]/
│   │   │   │   └── page.tsx            # Chat thread
│   │   │   └── loading.tsx
│   │   └── settings/
│   │       └── page.tsx
│   │
│   ├── (admin)/                        # Admin route group
│   │   ├── layout.tsx                  # Admin sidebar layout
│   │   └── dashboard/
│   │       ├── page.tsx                # Overview/analytics
│   │       ├── users/
│   │       │   └── page.tsx            # User management table
│   │       └── verification/
│   │           └── page.tsx            # KYC verification queue
│   │
│   └── api/                            # API route handlers
│       └── push/
│           └── subscribe/
│               └── route.ts            # Register push subscription
│
└── messages/                           # i18n translations
    ├── it.json
    └── en.json
```

---

## 4. Row Level Security (RLS) Policies

### 4.1 `profiles`

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read caregiver profiles (public discovery)
CREATE POLICY "Caregiver profiles are publicly readable"
ON public.profiles FOR SELECT
USING (role = 'caregiver' AND onboarding_completed = TRUE);

-- Users can read their own profile regardless of role
CREATE POLICY "Users can read own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update only their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles"
ON public.profiles FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Admins can update any profile (e.g., suspend)
CREATE POLICY "Admins can update any profile"
ON public.profiles FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);
```

### 4.2 `caregiver_details`

```sql
ALTER TABLE public.caregiver_details ENABLE ROW LEVEL SECURITY;

-- Public read for discovery (joined with profiles)
CREATE POLICY "Caregiver details are publicly readable"
ON public.caregiver_details FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = caregiver_details.profile_id
          AND role = 'caregiver'
          AND onboarding_completed = TRUE
    )
);

-- Caregiver can manage their own details
CREATE POLICY "Caregivers can insert own details"
ON public.caregiver_details FOR INSERT
WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Caregivers can update own details"
ON public.caregiver_details FOR UPDATE
USING (auth.uid() = profile_id)
WITH CHECK (auth.uid() = profile_id);

-- Admins can update (e.g., set verified status)
CREATE POLICY "Admins can update caregiver details"
ON public.caregiver_details FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);
```

### 4.3 `documents`

```sql
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Owner can view and upload their own documents
CREATE POLICY "Users can view own documents"
ON public.documents FOR SELECT
USING (auth.uid() = profile_id);

CREATE POLICY "Users can upload documents"
ON public.documents FOR INSERT
WITH CHECK (auth.uid() = profile_id);

-- Admins can view all documents (for verification)
CREATE POLICY "Admins can view all documents"
ON public.documents FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Admins can update document status
CREATE POLICY "Admins can update document status"
ON public.documents FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);
```

### 4.4 `conversations` & `conversation_participants`

```sql
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;

-- Users can view conversations they participate in
CREATE POLICY "Participants can view conversations"
ON public.conversations FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.conversation_participants
        WHERE conversation_id = conversations.id
          AND profile_id = auth.uid()
    )
);

-- Participants can view their own participation records
CREATE POLICY "Users can view own participation"
ON public.conversation_participants FOR SELECT
USING (profile_id = auth.uid());

-- Users can update their own participation (e.g., reset unread_count)
CREATE POLICY "Users can update own participation"
ON public.conversation_participants FOR UPDATE
USING (profile_id = auth.uid())
WITH CHECK (profile_id = auth.uid());
```

### 4.5 `messages`

```sql
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Participants can read messages in their conversations
CREATE POLICY "Participants can read messages"
ON public.messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.conversation_participants
        WHERE conversation_id = messages.conversation_id
          AND profile_id = auth.uid()
    )
);

-- Participants can send messages to their conversations
CREATE POLICY "Participants can send messages"
ON public.messages FOR INSERT
WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
        SELECT 1 FROM public.conversation_participants
        WHERE conversation_id = messages.conversation_id
          AND profile_id = auth.uid()
    )
);
```

### 4.6 `push_subscriptions`

```sql
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can manage their own push subscriptions
CREATE POLICY "Users can view own subscriptions"
ON public.push_subscriptions FOR SELECT
USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own subscriptions"
ON public.push_subscriptions FOR INSERT
WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can delete own subscriptions"
ON public.push_subscriptions FOR DELETE
USING (auth.uid() = profile_id);
```

---

## 5. Middleware — `middleware.ts`

```typescript
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
          cookiesToSet.forEach(({ name, value, options }) =>
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
  const protectedPaths = ['/discover', '/chat', '/profile', '/settings', '/onboarding']
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

  // Admin route protection
  if (user && adminPaths.some(p => pathname.startsWith(p))) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
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
```

---

## 6. Supabase Client Utilities

### 6.1 Browser Client — `lib/supabase/client.ts`

```typescript
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 6.2 Server Client — `lib/supabase/server.ts`

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignored in Server Components (read-only)
          }
        },
      },
    }
  )
}
```

---

## 7. Realtime Architecture

### 7.1 Channel Strategy

| Channel Pattern | Scope | Events |
|---|---|---|
| `conversation:{uuid}` | Per chat thread | `postgres_changes` (INSERT on messages), `broadcast` (typing) |
| `presence:global` | App-wide | `presence` (online/offline tracking) |

### 7.2 Presence Implementation

```typescript
// hooks/use-presence.ts
const channel = supabase.channel('presence:global', {
  config: { presence: { key: userId } }
})

channel
  .on('presence', { event: 'sync' }, () => {
    const state = channel.presenceState()
    // Update online users map
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.track({ user_id: userId, online_at: new Date().toISOString() })
    }
  })
```

### 7.3 Message Subscription

```typescript
// hooks/use-realtime-messages.ts
supabase
  .channel(`conversation:${conversationId}`)
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${conversationId}`
    },
    (payload) => {
      // Append new message to local state
    }
  )
  .subscribe()
```

---

## 8. Security Matrix

| Layer | Protection | Implementation |
|---|---|---|
| **Network** | TLS 1.3 | Vercel + Supabase automatic |
| **Authentication** | Cookie-based sessions | `@supabase/ssr`, HttpOnly, SameSite=Lax |
| **Authorization** | Row Level Security | PostgreSQL policies per table (see §4) |
| **Route Protection** | Middleware | `middleware.ts` path checks (see §5) |
| **Input Validation** | Client + Server | Zod schemas in Server Actions |
| **File Upload** | Storage Policies | Bucket-level RLS (owner + admin) |
| **API Keys** | Environment Variables | `SUPABASE_SERVICE_ROLE_KEY` server-only |
| **GDPR** | Data Deletion | User can request account + data deletion |
| **XSS** | React DOM escaping | React default + CSP headers |
| **CSRF** | SameSite cookies | `@supabase/ssr` defaults |
