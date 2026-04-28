'use client';

import { PropsWithChildren } from 'react';

export function Alert({
  children,
  type = 'info',
  className = '',
}: PropsWithChildren<{ type?: 'info' | 'success' | 'warning' | 'error'; className?: string }>) {
  const types = {
    info: 'bg-(--alert-info-bg) border-(--alert-info-border) text-(--alert-info-text)',
    success: 'bg-(--alert-success-bg) border-(--alert-success-border) text-(--alert-success-text)',
    warning: 'bg-(--alert-warning-bg) border-(--alert-warning-border) text-(--alert-warning-text)',
    error: 'bg-(--alert-error-bg) border-(--alert-error-border) text-(--alert-error-text)',
  };

  return <div className={`border rounded-md p-4 ${types[type]} ${className}`}>{children}</div>;
}
