export function extractRtkErrorMessage(error: any): string {
  if (!error) return '';

  if (error?.error?.data?.message) return error.error.data.message;
  if (error?.error?.data?.error) return error.error.data.error;
  if (error?.error?.data?.msg) return error.error.data.msg;
  if (error?.data?.message) return error.data.message;
  if (error?.data?.error) return error.data.error;
  if (error?.data?.msg) return error.data.msg;
  if (typeof error?.data === 'string') return error.data;
  if (typeof error?.error?.data === 'string') return error.error.data;

  if (error?.message) return error.message;

  return 'Something went wrong';
}
export function logRtkError(context: string, error: any): void {
  const message = extractRtkErrorMessage(error);
  const status =
    typeof error?.status === 'number'
      ? error.status
      : typeof error?.originalStatus === 'number'
        ? error.originalStatus
        : undefined;

  if (typeof status === 'number' && status >= 400 && status < 500) {
    console.warn(`${context}:`, message || error);
    return;
  }

  console.error(`${context}:`, message || error);
}
