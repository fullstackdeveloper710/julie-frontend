'use client';

import { PropsWithChildren } from 'react';

export function Badge({
  children,
  variant = 'default',
}: PropsWithChildren<{ variant?: 'default' | 'success' | 'warning' | 'danger' }>) {
  const variants = {
    default: 'bg-(--badge-default-bg) text-(--badge-default-text)',
    success: 'bg-(--badge-success-bg) text-(--badge-success-text)',
    warning: 'bg-(--badge-warning-bg) text-(--badge-warning-text)',
    danger: 'bg-(--badge-danger-bg) text-(--badge-danger-text)',
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
