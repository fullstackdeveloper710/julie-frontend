import { User } from '@/types';
import { buildBackendApiUrl, getForwardedAuthHeaders } from './backend';

export async function getCurrentUserServer(request: Request): Promise<User | null> {
  try {
    const response = await fetch(buildBackendApiUrl('/auth/me'), {
      method: 'GET',
      headers: {
        ...getForwardedAuthHeaders(request),
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    return payload?.data ?? null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function getCurrentSessionServer(request: Request) {
  try {
    const user = await getCurrentUserServer(request);
    return user ? { user } : null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}
