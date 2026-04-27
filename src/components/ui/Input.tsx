'use client';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function Input({
  className = '',
  label,
  error,
  helpText,
  containerClassName = '',
  labelClassName = '',
  inputClassName = '',
  errorClassName = '',
  helpTextClassName = '',
  type = 'text',
  min,
  max,
  ...props
}: {
  className?: string;
  label?: string;
  error?: string;
  helpText?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  helpTextClassName?: string;
  type?: string;
  min?: string | number;
  max?: string | number;
  [key: string]: any;
}) {
  const [showPassword, setShowPassword] = useState(false);
  // Support both 'className' (for backward compatibility) and 'inputClassName'
  const finalInputClassName = inputClassName || className;

  // Apply error styling if error exists and no custom inputClassName includes error styling
  const computedInputClassName = error && !inputClassName?.includes('border-red')
    ? `${finalInputClassName} border-red-500 focus:border-red-500`
    : finalInputClassName;

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className={containerClassName}>
      {label && (
        <label className={labelClassName || 'block text-sm font-medium text-(--foreground) mb-2'}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <input
          type={inputType}
          className={`w-full px-4 py-2 border border-(--input-border) bg-transparent text-(--foreground) rounded-md! focus:ring-2 focus:ring-(--input-focus) focus:border-transparent transition-colors ${error && !inputClassName ? 'border-(--input-error)' : ''
            } ${computedInputClassName}`}
          {...(min !== undefined && { min })}
          {...(max !== undefined && { max })}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((v) => !v)}
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              color: 'var(--foreground, #888)',
              fontSize: 18,
              lineHeight: 1,
            }}
            tabIndex={0}
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        )}
      </div>
      {error && <p className={errorClassName || 'text-(--input-error) text-sm mt-1'}>{error}</p>}
      {helpText && <p className={helpTextClassName || 'text-xs text-slate-500 mt-1'}>{helpText}</p>}
    </div>
  );
}
