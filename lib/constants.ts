/** Default search radius in meters for proximity queries */
export const DEFAULT_SEARCH_RADIUS_M = 25_000 // 25 km

/** Maximum search radius in meters */
export const MAX_SEARCH_RADIUS_M = 50_000 // 50 km

/** Default page size for paginated queries */
export const DEFAULT_PAGE_SIZE = 20

/** Supported user roles */
export const ROLES = ['family', 'caregiver', 'admin'] as const
export type UserRole = (typeof ROLES)[number]

/** Supported caregiver categories */
export const CAREGIVER_CATEGORIES = ['badante', 'colf', 'babysitter', 'oss'] as const
export type CaregiverCategory = (typeof CAREGIVER_CATEGORIES)[number]

/** App routes */
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    DISCOVER: '/discover',
    CHAT: '/chat',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    ONBOARDING: '/onboarding',
    ADMIN_DASHBOARD: '/dashboard',
} as const
