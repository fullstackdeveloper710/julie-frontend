import axios, { AxiosInstance, AxiosError } from 'axios';
import { store } from '../store';
import { logout } from '../slices/userSlice';
import { getBackendApiBaseUrl } from '@/services/backend';

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
    const accessToken = store.getState().user.accessToken;

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Clear stale credentials so the next render does not immediately
            // re-fire authenticated requests with the dead token (which would
            // 401 again and trigger another redirect → infinite loop).
            store.dispatch(logout());

            // Only redirect if the user is on a protected route. If they are
            // already on an auth page (signin, signup, verify, etc.), the
            // 401 is informational — redirecting again would create a loop.
            if (typeof window !== 'undefined' && !isOnAuthPage()) {
                window.location.href =
                    '/auth/signin?error=Your session has expired. Please sign in again.';
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
