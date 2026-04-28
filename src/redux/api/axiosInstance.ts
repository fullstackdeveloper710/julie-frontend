import axios, { AxiosInstance, AxiosError } from 'axios';
import { logout } from '../slices/userSlice';
import { clearSelectedAgency } from '../slices/agencySlice';
import { getBackendApiBaseUrl } from '@/services/backend';

// IMPORTANT: this module deliberately does NOT import `../store`. Doing so
// re-creates the cycle `axiosInstance → store → *Api → axiosBaseQuery →
// axiosInstance` and triggers a TDZ error
// ("Cannot access 'axiosBaseQuery' before initialization") when any api module
// happens to be evaluated before `axiosBaseQuery` finishes binding.
// Instead, the store calls `installAxiosInterceptors(store)` after it has been
// built, and we keep the store reference in a local variable.

type ReduxLikeStore = {
    getState: () => { user?: { accessToken?: string | null } };
    dispatch: (action: unknown) => unknown;
};

let storeRef: ReduxLikeStore | null = null;

export const axiosInstance: AxiosInstance = axios.create({
    baseURL: getBackendApiBaseUrl(),
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Pages where a 401 should NOT trigger a redirect (you're already there).
const AUTH_PAGES = [
    '/auth/signin',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/update-password',
    '/auth/callback',
    '/verify',
];

const isOnAuthPage = (): boolean => {
    if (typeof window === 'undefined') return true;
    const pathname = window.location.pathname || '';
    return AUTH_PAGES.some(
        (page) => pathname === page || pathname.startsWith(`${page}/`)
    );
};

axiosInstance.interceptors.request.use((config) => {
    const accessToken = storeRef?.getState().user?.accessToken ?? null;

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Capture pre-logout token state so we can tell a real session
            // expiry apart from a stray 401 fired during/after an intentional
            // logout (where the token is already gone). Only the former should
            // surface the "session expired" message on the signin page.
            const wasAuthenticated = !!storeRef?.getState().user?.accessToken;

            // Clear stale credentials so the next render does not immediately
            // re-fire authenticated requests with the dead token (which would
            // 401 again and trigger another redirect → infinite loop). RTK
            // Query caches are reset on the next successful sign-in via
            // loginSuccess().
            storeRef?.dispatch(logout());
            storeRef?.dispatch(clearSelectedAgency());

            // Only redirect if the user is on a protected route. If they are
            // already on an auth page (signin, signup, verify, etc.), the
            // 401 is informational — redirecting again would create a loop.
            if (typeof window !== 'undefined' && !isOnAuthPage()) {
                window.location.href = wasAuthenticated
                    ? '/auth/signin?error=Your session has expired. Please sign in again.'
                    : '/auth/signin';
            }
        }

        return Promise.reject(error);
    }
);

/**
 * Wires the redux store into the axios interceptors. Call this once, after
 * the store has been constructed, from store.ts. Prior to this call,
 * interceptors run as no-ops for token reading and dispatching.
 */
export const installAxiosInterceptors = (store: ReduxLikeStore) => {
    storeRef = store;
};

export default axiosInstance;
