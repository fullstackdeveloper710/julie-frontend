const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NODE_API_URL;

const normalizeBackendBaseUrl = (baseUrl: string): string => {
  const trimmedBaseUrl = baseUrl.replace(/\/+$/, '');

  return trimmedBaseUrl.endsWith('/api/v1') ? trimmedBaseUrl : `${trimmedBaseUrl}/api/v1`;
};

export const getBackendApiBaseUrl = (): string => {
  if (!BACKEND_BASE_URL) {
    throw new Error(
      'Backend API base URL is not configured. Set NEXT_PUBLIC_API_URL or NODE_API_URL.',
    );
  }

  return normalizeBackendBaseUrl(BACKEND_BASE_URL);
};

export const buildBackendApiUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getBackendApiBaseUrl()}${normalizedPath}`;
};

export const getForwardedAuthHeaders = (request: Request): HeadersInit => {
  const authorization =
    request.headers.get('authorization') || request.headers.get('Authorization');

  return authorization ? { Authorization: authorization } : {};
};
