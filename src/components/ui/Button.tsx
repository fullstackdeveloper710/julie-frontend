'use client';

import { PropsWithChildren } from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  buttonClassName = '',
  ...props
}: PropsWithChildren<{
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  buttonClassName?: string;
  [key: string]: any;
}>) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary:
      'bg-(--button-primary-bg) text-(--button-primary-text) hover:bg-(--button-primary-hover) focus:ring-(--accent)',
    secondary:
      'bg-(--button-secondary-bg) text-(--button-secondary-text) hover:bg-(--button-secondary-hover) focus:ring-(--color-cool-gray)',
    outline:
      'border-2 border-(--button-outline-border) text-(--button-outline-text) hover:bg-(--button-outline-hover-bg) focus:ring-(--button-outline-border)',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const finalClassName = buttonClassName || className;

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${finalClassName} cursor-pointer`}
      {...props}
    >
      {children}
    </button>
  );
}
