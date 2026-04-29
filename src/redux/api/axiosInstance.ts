import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { logout, setAccessToken } from '../slices/userSlice';
import { clearSelectedAgency } from '../slices/agencySlice';
import { getBackendApiBaseUrl } from '@/services/backend';

type ReduxLikeStore = {
  getState: () => { user?: { accessToken?: string | null; refreshToken?: string | null } };
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
  return AUTH_PAGES.some((page) => pathname === page || pathname.startsWith(`${page}/`));
};

// --- Silent refresh state ---
// Only one refresh request should be in flight at a time. Concurrent 401s queue
// up here and are resolved/rejected together once the refresh completes.
let isRefreshing = false;
type QueueEntry = { resolve: (token: string) => void; reject: (err: unknown) => void };
let refreshQueue: QueueEntry[] = [];

const drainQueue = (err: unknown, token: string | null) => {
  refreshQueue.forEach((entry) => (err ? entry.reject(err) : entry.resolve(token!)));
  refreshQueue = [];
};

const performLogout = (wasAuthenticated: boolean) => {
  storeRef?.dispatch(logout());
  storeRef?.dispatch(clearSelectedAgency());
  if (typeof window !== 'undefined' && !isOnAuthPage()) {
    window.location.href = wasAuthenticated
      ? '/auth/signin?error=Your session has expired. Please sign in again.'
      : '/auth/signin';
  }
};

// ---

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
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = storeRef?.getState().user?.refreshToken ?? null;

    // No refresh token stored — log out immediately.
    if (!refreshToken) {
      const wasAuthenticated = !!storeRef?.getState().user?.accessToken;
      performLogout(wasAuthenticated);
      return Promise.reject(error);
    }

    // A refresh is already in flight — queue this request to retry once done.
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      });
    }

    // This is the first 401 — kick off a token refresh.
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const baseUrl = getBackendApiBaseUrl();
      const resp = await axios.post(`${baseUrl}/auth/refresh`, { refresh_token: refreshToken });
      const newAccessToken: string = resp.data?.data?.access_token?.token;

      if (!newAccessToken) throw new Error('No access token in refresh response');

      storeRef?.dispatch(setAccessToken(newAccessToken));
      drainQueue(null, newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      drainQueue(refreshError, null);
      const wasAuthenticated = !!storeRef?.getState().user?.refreshToken;
      performLogout(wasAuthenticated);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
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
