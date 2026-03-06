# Badante24h — Product Requirements Document (PRD)

> **Version:** 1.0  
> **Date:** 2026-03-02  
> **Owner:** ALS MCL  
> **Status:** Draft

---

## 1. Executive Summary

**Badante24h** is a Progressive Web App (PWA) that connects families and elderly individuals with personal care assistants — including caregivers (*badanti*), live-in 24h caregivers (*badanti 24h*), and babysitters. The platform replicates the immediate, frictionless user experience of modern matching apps (Badoo, Tinder), placing **geolocation** at the center of the discovery flow. Users find nearby, verified professionals in seconds, communicate via real-time chat, and manage the entire relationship within a single installable web application.

---

## 2. Problem Statement

### 2.1 Current Landscape
- Families searching for care assistants rely on word-of-mouth, classified ads, or fragmented agency websites.
- There is no dominant mobile-first platform in Italy for this vertical.
- Existing solutions lack real-time features (chat, presence), modern UX, and geolocation-based matching.

### 2.2 Target Pain Points

| Pain Point | Affected User | Impact |
|---|---|---|
| Slow discovery process | Families | Weeks to find a suitable caregiver |
| No geographic proximity filter | Both | Mismatched locations, wasted travel |
| No trust/verification system | Families | Safety and reliability concerns |
| Fragmented communication | Both | Phone calls, WhatsApp, email — no single channel |
| Lack of mobile-first tools | Caregivers | Cannot manage their visibility or availability on-the-go |

---

## 3. Target Users & Personas

### 3.1 Caregivers (Supply Side)

| Persona | Description | Goals |
|---|---|---|
| **Badante** | Part-time caregiver, typically assisting with daily activities (meals, hygiene, companionship) | Find nearby families, build a reputation, get verified |
| **Badante 24h** | Live-in caregiver providing round-the-clock assistance | Secure long-term placements, showcase experience |
| **Babysitter** | Child-care provider, varying schedules | Find families quickly, manage availability |

### 3.2 Families / Seekers (Demand Side)

| Persona | Description | Goals |
|---|---|---|
| **Family Member** | Adult child or spouse seeking care for an elderly parent/relative | Find a trusted, nearby caregiver fast |
| **Parent** | Mother/father looking for a babysitter | Secure a reliable babysitter with flexible scheduling |

### 3.3 Administrators

| Persona | Description | Goals |
|---|---|---|
| **ALS MCL Admin** | Organization staff member | Moderate users, verify identities, manage platform content |

---

## 4. User Roles & Permissions

| Role | Registration | Profile | Browse | Chat | Admin Panel |
|---|---|---|---|---|---|
| `caregiver` | ✅ Full profile (photos, skills, experience, documents) | ✅ Public, searchable | ❌ Cannot browse other caregivers | ✅ Reply to family messages | ❌ |
| `family` | ✅ Simplified profile | ✅ Private (only shared with contacted caregivers) | ✅ Full search + map + filters | ✅ Initiate conversations | ❌ |
| `admin` | ✅ Internal only (invitation-based) | N/A | ✅ View all profiles | ✅ Monitor flagged conversations | ✅ Full access |

---

## 5. Core Features

### 5.1 Authentication & Onboarding

| # | Feature | Description | Priority |
|---|---|---|---|
| F-AUTH-01 | Email/Password Sign-Up | Standard registration with email verification | P0 |
| F-AUTH-02 | Social Login (Google) | One-tap Google OAuth login | P1 |
| F-AUTH-03 | Role Selection | User selects `caregiver` or `family` during sign-up | P0 |
| F-AUTH-04 | Caregiver Sub-Type | Caregiver selects: Badante, Badante 24h, or Babysitter | P0 |
| F-AUTH-05 | Onboarding Wizard | Step-by-step profile completion after registration | P0 |
| F-AUTH-06 | Password Recovery | Forgot password flow via email magic link | P0 |

### 5.2 User Profiles

| # | Feature | Description | Priority |
|---|---|---|---|
| F-PROF-01 | Caregiver Profile | Name, photos (up to 5), bio, experience (years), skills, availability, hourly rate, languages spoken | P0 |
| F-PROF-02 | Verified Badge | Visual indicator after admin identity check (KYC) | P0 |
| F-PROF-03 | Family Profile | Name, care need description, preferred schedule, location | P0 |
| F-PROF-04 | Profile Photo Upload | Cropping + upload to Supabase Storage | P0 |
| F-PROF-05 | Document Upload | Caregivers upload ID / certifications for verification | P1 |
| F-PROF-06 | Availability Calendar | Weekly availability grid (morning/afternoon/evening/night) | P1 |

### 5.3 Geolocation & Discovery

| # | Feature | Description | Priority |
|---|---|---|---|
| F-GEO-01 | Auto Location Detection | Browser Geolocation API with user consent | P0 |
| F-GEO-02 | Manual Address Input | Fallback — user types address, geocoded via Nominatim or Google Geocoding API | P0 |
| F-GEO-03 | Radius Search | PostGIS `ST_DWithin` query: find caregivers within X km | P0 |
| F-GEO-04 | Distance Display | Show real distance (e.g., "2.3 km away") on each result card | P0 |
| F-GEO-05 | Map View | Interactive map (Leaflet/Mapbox) showing caregiver pins | P1 |
| F-GEO-06 | List/Grid View | Card-based results sorted by distance, with filter toggles | P0 |
| F-GEO-07 | Category Filter | Filter by care type: Badante / Badante 24h / Babysitter | P0 |
| F-GEO-08 | Availability Filter | Filter by available days/times | P1 |
| F-GEO-09 | Verified Only Filter | Toggle to show only verified profiles | P1 |

### 5.4 Real-Time Chat & Communication

| # | Feature | Description | Priority |
|---|---|---|---|
| F-CHAT-01 | Initiate Conversation | Family taps "Contact" on caregiver profile | P0 |
| F-CHAT-02 | Real-Time Messaging | Instant delivery via Supabase Realtime subscriptions | P0 |
| F-CHAT-03 | Chat List | Inbox view showing all conversations, ordered by last message | P0 |
| F-CHAT-04 | Unread Indicators | Badge count for unread messages | P0 |
| F-CHAT-05 | Online / Last Seen | Green dot for online; "Last seen 10 min ago" for offline | P1 |
| F-CHAT-06 | Typing Indicator | "User is typing..." in real-time | P2 |
| F-CHAT-07 | Push Notifications | Notify user of new messages when app is in background | P1 |

### 5.5 PWA Capabilities

| # | Feature | Description | Priority |
|---|---|---|---|
| F-PWA-01 | Installable | Add-to-Home-Screen prompt on mobile browsers | P0 |
| F-PWA-02 | Offline Shell | Service Worker caches app shell for instant load | P1 |
| F-PWA-03 | Web Manifest | Custom icon, splash screen, theme colors | P0 |
| F-PWA-04 | Push Notifications | Web Push API integration (Firebase Cloud Messaging or Supabase Edge Functions) | P1 |

### 5.6 Admin Dashboard

| # | Feature | Description | Priority |
|---|---|---|---|
| F-ADMIN-01 | User Management | List, search, view, suspend, delete users | P0 |
| F-ADMIN-02 | Identity Verification | Review uploaded documents, approve/reject, grant "Verified" badge | P0 |
| F-ADMIN-03 | Content Moderation | Flag/review profiles with inappropriate content | P1 |
| F-ADMIN-04 | Analytics Overview | Active users, sign-ups per day, conversations initiated | P2 |
| F-ADMIN-05 | Role Management | Promote users to admin, manage Supabase roles | P1 |

---

## 6. Non-Functional Requirements

### 6.1 Performance

| Metric | Target |
|---|---|
| First Contentful Paint (FCP) | < 1.5s |
| Largest Contentful Paint (LCP) | < 2.5s |
| Cumulative Layout Shift (CLS) | < 0.1 |
| Time to Interactive (TTI) | < 3s on 3G |
| Lighthouse Performance Score | ≥ 90 |

### 6.2 Accessibility (WCAG 2.1 AA)

- Minimum contrast ratio: **4.5:1** for body text, **3:1** for large text.
- All interactive elements must have a **minimum tap target of 44×44px**.
- Font sizes: minimum **16px** body, **14px** labels.
- Screen-reader compatible (semantic HTML, ARIA labels).
- Keyboard-navigable.

### 6.3 Security & Compliance

| Requirement | Details |
|---|---|
| GDPR Compliance | User data consent, right to erasure, data portability |
| Data Encryption | TLS 1.3 in transit; AES-256 at rest (Supabase default) |
| Row Level Security | Supabase RLS policies per user role |
| Session Management | Secure, HttpOnly, SameSite cookies via `@supabase/ssr` |
| Input Validation | Client-side (Zod) + server-side (Server Actions) |
| Rate Limiting | API route protection against brute-force |
| KYC / Identity | Admin-verified document upload workflow |

### 6.4 Scalability

- Designed for **10,000+ concurrent users** from Day 1.
- PostGIS spatial indexing for sub-second geo-queries at scale.
- Supabase Realtime capable of **10,000+ concurrent WebSocket connections**.
- Vercel Edge Runtime for global low-latency serving.

### 6.5 Internationalization (i18n)

- **Primary language:** Italian (it-IT).
- **Secondary language:** English (en-US) — future phase.
- All user-facing strings externalized via `next-intl` or equivalent.

---

## 7. UI/UX Guidelines

### 7.1 Design Principles

| Principle | Implementation |
|---|---|
| **Mobile-First** | All layouts designed for 360px+ screens first, then scaled up |
| **Frictionless** | Maximum 3 taps to reach any core action |
| **Trustworthy** | Verified badges, professional photography guidelines, clean UI |
| **Accessible** | High contrast, large fonts, clear iconography |
| **Premium** | Smooth animations, glassmorphism touches, modern typography |

### 7.2 Typography

- **Primary font:** Inter (Google Fonts) — clean, humanist, excellent readability.
- **Headings:** Bold, 24-32px.
- **Body:** Regular, 16-18px.
- **Captions:** Medium, 12-14px.

### 7.3 Color Palette

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#2563EB` (Blue 600) | CTAs, active states, links |
| `--color-primary-dark` | `#1D4ED8` (Blue 700) | Hover states |
| `--color-secondary` | `#10B981` (Emerald 500) | Success, verified badges, online indicators |
| `--color-accent` | `#F59E0B` (Amber 500) | Highlights, featured profiles |
| `--color-danger` | `#EF4444` (Red 500) | Errors, destructive actions |
| `--color-bg` | `#F8FAFC` (Slate 50) | Page backgrounds |
| `--color-surface` | `#FFFFFF` | Cards, modals |
| `--color-text` | `#0F172A` (Slate 900) | Primary text |
| `--color-text-muted` | `#64748B` (Slate 500) | Secondary text |

### 7.4 Key Screens

1. **Landing / Splash** — Value proposition, "Start Searching" CTA.
2. **Sign Up / Login** — Role selector, social login, form inputs.
3. **Onboarding Wizard** — 3-4 step profile builder.
4. **Discovery (Home)** — Search results in list/grid + filter bar + map toggle.
5. **Caregiver Profile** — Full profile view with photos, skills, verified badge, "Contact" CTA.
6. **Chat Inbox** — List of conversations.
7. **Chat Thread** — Real-time messaging UI.
8. **My Profile (Settings)** — Edit profile, manage availability, upload documents.
9. **Admin Dashboard** — Users table, verification queue, analytics.

---

## 8. Success Metrics (KPIs)

| KPI | Target (6 months) |
|---|---|
| Registered Caregivers | 500+ |
| Registered Families | 1,000+ |
| Monthly Active Users (MAU) | 2,000+ |
| Conversations Initiated / Month | 500+ |
| Average Response Time (chat) | < 2 hours |
| Verified Profiles Rate | > 60% of active caregivers |
| PWA Install Rate | > 15% of unique visitors |

---

## 9. Milestones & Roadmap

### Phase 1 — MVP (Weeks 1–6)
- Authentication + Role-based onboarding
- Caregiver & Family profile management
- Geolocation-based discovery (list view, radius search)
- Real-time chat (1-to-1 messaging)
- PWA manifest + installability

### Phase 2 — Trust & Engagement (Weeks 7–10)
- Admin dashboard (user management + KYC verification)
- Verified badge system
- Map view (Leaflet/Mapbox integration)
- Push notifications (Web Push API)
- Online/offline presence indicators

### Phase 3 — Growth & Polish (Weeks 11–14)
- Availability calendar
- Advanced filters (availability, languages, experience)
- Reviews & ratings system
- i18n (English support)
- Analytics dashboard (admin)

### Phase 4 — Future (Post-Launch)
- AI-powered matching recommendations
- Video call integration
- Payment processing (in-app booking)
- Native app wrappers (Capacitor/Expo)

---

## 10. Technical Constraints & Assumptions

| Item | Detail |
|---|---|
| Hosting | Vercel (free/pro tier) |
| Backend | Supabase (free tier for MVP, Pro for production) |
| PostGIS | Enabled via Supabase SQL editor (`CREATE EXTENSION postgis;`) |
| Storage | Supabase Storage — 1 GB free tier |
| Realtime | Supabase Realtime — included in all plans |
| Domain | Custom domain to be configured on Vercel |
| SSL | Automatic via Vercel |
| CI/CD | Vercel auto-deploys from GitHub `main` branch |

---

## 11. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Low initial caregiver adoption | High | High | Seed profiles, partner with local agencies |
| Geolocation permission denied | Medium | Medium | Graceful fallback to manual address input |
| Supabase free tier limits | Medium | Medium | Monitor usage, upgrade to Pro before limit |
| Data privacy complaints (GDPR) | Low | High | Privacy policy, consent banners, data deletion flows |
| Real-time performance under load | Low | Medium | Supabase Realtime auto-scales; monitor WebSocket connections |

---

## 12. Glossary

| Term | Definition |
|---|---|
| **Badante** | Italian term for a personal care assistant / caregiver |
| **Badante 24h** | Live-in caregiver providing round-the-clock assistance |
| **PWA** | Progressive Web App — installable web application |
| **PostGIS** | PostgreSQL extension for geographic/spatial objects |
| **RLS** | Row Level Security — Supabase/PostgreSQL policy-based access control |
| **KYC** | Know Your Customer — identity verification process |
| **SRID 4326** | Spatial Reference Identifier for WGS 84 (GPS coordinates) |
