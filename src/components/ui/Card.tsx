'use client';

import { PropsWithChildren } from 'react';

export function Card({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`bg-(--card-bg) rounded-lg border border-(--card-border) p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return (
    <h3 className={`text-lg font-semibold text-(--foreground) mb-2 ${className}`}>{children}</h3>
  );
}

export function CardDescription({ children }: PropsWithChildren) {
  return <p className="text-sm text-(--secondary)">{children}</p>;
}
