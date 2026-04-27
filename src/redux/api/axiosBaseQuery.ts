import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { axiosInstance } from './axiosInstance';

const resolveRequestUrl = (baseUrl: string, url: string): string => {
    const combinedUrl = `${baseUrl}${url}`;
    const instanceBaseUrl = String(axiosInstance.defaults.baseURL || '');
    const normalizedInstanceBaseUrl = instanceBaseUrl.replace(/\/+$/, '');

    if (normalizedInstanceBaseUrl.endsWith('/api') && combinedUrl.startsWith('/api/')) {
        return combinedUrl.slice(4);
    }

    if (normalizedInstanceBaseUrl.endsWith('/api') && combinedUrl === '/api') {
        return '/';
    }

    return combinedUrl;
};

export const axiosBaseQuery =
    ({ baseUrl }: { baseUrl: string }): BaseQueryFn<
        {
            url: string;
            method?: AxiosRequestConfig['method'];
            data?: AxiosRequestConfig['data'];
            params?: AxiosRequestConfig['params'];
            headers?: AxiosRequestConfig['headers'];
            body?: AxiosRequestConfig['data'];

        },
        unknown,
        unknown
    > =>
        async ({ url, method = 'GET', data, body, params, headers }) => {
            try {
                const requestUrl = resolveRequestUrl(baseUrl, url);

                const result = await axiosInstance({
                    url: requestUrl,
                    method,
                    data: body ?? data,
                    params,
                    headers,
                });

                return { data: result.data };
            } catch (axiosError) {
                const err = axiosError as AxiosError;
                return {
                    error: {
                        status: err.response?.status,
                        data: err.response?.data,
                    },
                };
            }
        };
