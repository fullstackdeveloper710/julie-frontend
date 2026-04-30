import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { axiosInstance } from './axiosInstance';

const resolveRequestUrl = (baseUrl: string, url: string): string => {
  const combinedUrl = `${baseUrl}${url}`;

  if (combinedUrl === '/api') {
    return '/';
  }

  if (combinedUrl.startsWith('/api/')) {
    return combinedUrl.slice(4);
  }

  return combinedUrl;
};

export const axiosBaseQuery =
  ({
    baseUrl,
  }: {
    baseUrl: string;
  }): BaseQueryFn<
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
  async ({ url, method = 'GET', data, body, params, headers }, { getState }) => {
    try {
      const requestUrl = resolveRequestUrl(baseUrl, url);

      // Inject the currently selected agency so the backend can scope data correctly.
      // The backend ignores this for managers/dept_users (uses their assigned agency).
      const state = getState() as { agency?: { selectedAgencyId?: string | null } };
      const selectedAgencyId = state.agency?.selectedAgencyId ?? null;

      const mergedParams = selectedAgencyId
        ? { agencyId: selectedAgencyId, ...params }
        : params;

      const result = await axiosInstance({
        url: requestUrl,
        method,
        data: body ?? data,
        params: mergedParams,
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
