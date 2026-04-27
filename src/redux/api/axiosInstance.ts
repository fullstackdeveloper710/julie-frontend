import axios, { AxiosInstance, AxiosError } from 'axios';
import { store } from '../store';

export const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor (use your backend token)
axiosInstance.interceptors.request.use((config) => {
    const accessToken = store.getState().user.accessToken;

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Temporary auth bypass: do not force logout + sign-in redirect on 401.
            // store.dispatch(logout());
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/signin';
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;