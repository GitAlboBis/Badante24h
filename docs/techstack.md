# Badante24h — Technology Stack

> **Version:** 1.0  
> **Date:** 2026-03-02

---

## 1. Stack Overview

```
┌─────────────────────────────────────────────────────────┐
│                    VERCEL (Hosting)                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │             Next.js 15 (App Router)               │  │
│  │  ┌──────────────┐  ┌──────────────────────────┐   │  │
│  │  │   React 19   │  │    Server Components     │   │  │
│  │  │  (Client UI) │  │  (SSR + Server Actions)  │   │  │
│  │  └──────────────┘  └──────────────────────────┘   │  │
│  │  ┌──────────────┐  ┌──────────────────────────┐   │  │
│  │  │ Tailwind CSS │  │   @supabase/ssr (Auth)   │   │  │
│  │  │    v4.x      │  │  Cookie-based sessions   │   │  │
│  │  └──────────────┘  └──────────────────────────┘   │  │
│  └───────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS / WebSocket
┌────────────────────────▼────────────────────────────────┐
│                 SUPABASE (Backend)                       │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐  │
│  │  Auth   │ │ Realtime │ │ Storage  │ │   Edge     │  │
│  │(GoTrue) │ │(WebSocket)│ │ (S3)    │ │ Functions  │  │
│  └─────────┘ └──────────┘ └──────────┘ └────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │        PostgreSQL 15 + PostGIS 3.x                │  │
│  │   geography(Point,4326) • ST_DWithin • GiST idx  │  │
│  │              Row Level Security (RLS)             │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Core Dependencies

### 2.1 Framework & Runtime

| Package | Version | Purpose |
|---|---|---|
| `next` | `^15.x` | React meta-framework — App Router, SSR, Server Actions |
| `react` / `react-dom` | `^19.x` | UI library |
| `typescript` | `^5.x` | Type safety |
| `node` | `>=20.x` | Runtime (Vercel) |

### 2.2 Supabase Integration

| Package | Version | Purpose |
|---|---|---|
| `@supabase/supabase-js` | `^2.x` | Core Supabase client (PostgREST, Realtime, Storage) |
| `@supabase/ssr` | `^0.5.x` | Server-side auth with cookie-based sessions (App Router compatible) |

### 2.3 Styling & UI

| Package | Version | Purpose |
|---|---|---|
| `tailwindcss` | `^4.x` | Utility-first CSS framework |
| `@tailwindcss/postcss` | `^4.x` | PostCSS integration for Tailwind |
| `clsx` | `^2.x` | Conditional class composition |
| `tailwind-merge` | `^2.x` | Smart Tailwind class deduplication |
| `lucide-react` | `^0.4x` | Icon library (clean, consistent SVG icons) |
| `framer-motion` | `^11.x` | Micro-animations, transitions, gesture handling |

### 2.4 Geolocation & Maps

| Package | Version | Purpose |
|---|---|---|
| `leaflet` | `^1.9.x` | Interactive map rendering |
| `react-leaflet` | `^4.x` | React bindings for Leaflet |
| `@types/leaflet` | `^1.9.x` | TypeScript types |

> **Note:** Geocoding is handled server-side via Nominatim (OpenStreetMap) or Google Geocoding API. PostGIS performs all spatial calculations in the database layer.

### 2.5 Forms & Validation

| Package | Version | Purpose |
|---|---|---|
| `react-hook-form` | `^7.x` | Performant form state management |
| `@hookform/resolvers` | `^3.x` | Schema-based resolver bridge |
| `zod` | `^3.x` | TypeScript-first schema validation |

### 2.6 State Management

| Package | Version | Purpose |
|---|---|---|
| `zustand` | `^5.x` | Lightweight global state (UI state, filters, user session cache) |

### 2.7 PWA

| Package | Version | Purpose |
|---|---|---|
| `next-pwa` / `@serwist/next` | Latest | Service Worker generation + caching strategies |
| `web-push` | `^3.x` | Server-side push notification delivery |

### 2.8 Internationalization

| Package | Version | Purpose |
|---|---|---|
| `next-intl` | `^3.x` | i18n for Next.js App Router (server + client) |

### 2.9 Utilities

| Package | Version | Purpose |
|---|---|---|
| `date-fns` | `^3.x` | Date formatting & manipulation |
| `sharp` | `^0.33.x` | Image optimization (Next.js image pipeline) |
| `nanoid` | `^5.x` | Compact unique ID generation |

---

## 3. Development Dependencies

| Package | Version | Purpose |
|---|---|---|
| `eslint` | `^9.x` | Code linting |
| `eslint-config-next` | Latest | Next.js ESLint rules |
| `prettier` | `^3.x` | Code formatting |
| `prettier-plugin-tailwindcss` | Latest | Tailwind class sorting |
| `supabase` | Latest (CLI) | Local development, migrations, type generation |
| `@types/react` / `@types/node` | Latest | TypeScript definitions |

---

## 4. Supabase Services Architecture

### 4.1 Authentication (GoTrue)

| Feature | Implementation |
|---|---|
| Email/Password | Supabase Auth with email confirmation |
| Google OAuth | Supabase Auth providers |
| Session Management | `@supabase/ssr` — cookie-based, HttpOnly, SameSite=Lax |
| Middleware Protection | `middleware.ts` refreshes session, redirects unauthenticated users |
| Role Assignment | Custom `role` field in `profiles` table, synced post-registration |

**Client Architecture:**

```
┌─────────────────────────┐
│    Server Component      │ → createServerClient(@supabase/ssr) → reads cookies
├─────────────────────────┤
│    Client Component      │ → createBrowserClient(@supabase/ssr) → reads cookies
├─────────────────────────┤
│    Server Action         │ → createServerClient(@supabase/ssr) → reads cookies
├─────────────────────────┤
│    Middleware             │ → createServerClient(@supabase/ssr) → refresh + redirect
├─────────────────────────┤
│    API Route Handler     │ → createServerClient(@supabase/ssr) → reads cookies
└─────────────────────────┘
```

### 4.2 Database (PostgreSQL + PostGIS)

| Feature | Detail |
|---|---|
| Engine | PostgreSQL 15 (Supabase managed) |
| Spatial Extension | PostGIS 3.x — `geography(Point, 4326)` columns |
| Spatial Index | GiST index on location columns for O(log n) proximity queries |
| Key Function | `ST_DWithin(geography, geography, distance_meters)` |
| RLS | Row Level Security policies on every public table |
| Migrations | Managed via `supabase migration` CLI |
| Type Generation | `supabase gen types typescript` → `types/supabase.ts` |

### 4.3 Realtime

| Feature | Detail |
|---|---|
| Protocol | WebSocket (Phoenix channels) |
| Messages | Supabase Realtime Broadcast + Postgres Changes |
| Presence | Supabase Realtime Presence API (online/offline, typing indicators) |
| Channels | Per-conversation channel: `conversation:{id}` |

### 4.4 Storage

| Bucket | Access | Content |
|---|---|---|
| `avatars` | Public (read), Authenticated (write, own files) | Profile photos |
| `documents` | Private (owner + admin only) | ID scans, certifications |

### 4.5 Edge Functions (Deno)

| Function | Purpose |
|---|---|
| `send-push-notification` | Deliver Web Push notifications via `web-push` library |
| `geocode-address` | Server-side geocoding via Nominatim API (rate-limited) |

---

## 5. Vercel Configuration

| Setting | Value |
|---|---|
| Framework | Next.js (auto-detected) |
| Build Command | `next build` |
| Output Directory | `.next` |
| Node.js Version | 20.x |
| Environment Variables | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_VAPID_KEY` |
| Edge Middleware | `middleware.ts` (auth session refresh) |
| Regions | `cdg1` (Paris) — closest to Italy |

---

## 6. Development Workflow

```
1. Clone repo
2. cp .env.example .env.local        # Configure Supabase keys
3. npx supabase start                 # Local Supabase (Docker)
4. npx supabase db push               # Apply migrations
5. npx supabase gen types typescript   # Generate DB types
6. npm run dev                         # Next.js dev server (localhost:3000)
```

### Key Scripts

| Command | Action |
|---|---|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| `npm run type-check` | `tsc --noEmit` |
| `npx supabase gen types typescript --project-id <ref> > types/supabase.ts` | Regenerate DB types |
| `npx supabase migration new <name>` | Create new migration |
| `npx supabase db push` | Apply pending migrations |
