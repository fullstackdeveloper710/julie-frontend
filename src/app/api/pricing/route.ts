const NODE_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NODE_API_URL;

const buildNodeApiUrl = (path: string): string => {
  if (!NODE_API_BASE_URL) {
    throw new Error('Node API base URL is not configured. Set NEXT_PUBLIC_API_URL or NODE_API_URL.');
  }

  const normalizedBaseUrl = NODE_API_BASE_URL.replace(/\/+$/, '');
  const apiBaseUrl = normalizedBaseUrl.endsWith('/api/v1')
    ? normalizedBaseUrl
    : `${normalizedBaseUrl}/api/v1`;

  return `${apiBaseUrl}${path}`;
};

export async function GET(): Promise<Response> {
  try {
    const upstreamResponse = await fetch(buildNodeApiUrl('/pricing'), {
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
  } catch (error: unknown) {
    console.error('Pricing proxy error:', error);
    const message = error instanceof Error ? error.message : 'Failed to proxy pricing request';

    return new Response(
      JSON.stringify({
        error: message,
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