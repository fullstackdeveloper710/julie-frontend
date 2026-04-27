const NODE_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NODE_API_URL;

const buildNodeApiUrl = (path: string): string => {
  if (!NODE_API_BASE_URL) {
    throw new Error('Node API base URL is not configured. Set NEXT_PUBLIC_API_URL or NODE_API_URL.');
  }

  return `${NODE_API_BASE_URL.replace(/\/+$/, '')}${path}`;
};

const proxyPostRequest = async (request: Request, path: string): Promise<Response> => {
  const authorization = request.headers.get('authorization') || request.headers.get('Authorization');
  const body = await request.json();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (authorization) {
    headers.Authorization = authorization;
  }

  const upstreamResponse = await fetch(buildNodeApiUrl(path), {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const responseText = await upstreamResponse.text();
  const contentType = upstreamResponse.headers.get('content-type') || 'application/json';

  return new Response(responseText, {
    status: upstreamResponse.status,
    headers: {
      'Content-Type': contentType,
    },
  });
};

export async function POST(request: Request): Promise<Response> {
  try {
    return await proxyPostRequest(request, '/analytics/annual-baseline');
  } catch (error: any) {
    console.error('Annual baseline proxy error:', error);
    return new Response(
      JSON.stringify({
        error: error?.message || 'Failed to proxy annual baseline request',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
