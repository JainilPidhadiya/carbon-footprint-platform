import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const hasError = !!error;
    const hasHelper = !!helperText;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={
            clsx({
              [errorId]: hasError,
              [helperId]: hasHelper && !hasError,
            }) || undefined
          }
          className={twMerge(
            clsx(
              'w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 transition-all duration-200 focus:outline-none focus:ring-2',
              {
                'border-slate-300 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20': !hasError,
                'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20': hasError,
              }
            ),
            className
          )}
          {...props}
        />
        {hasError && (
          <span
            id={errorId}
            role="alert"
            className="text-xs font-medium text-red-600 dark:text-red-400"
          >
            {error}
          </span>
        )}
        {!hasError && hasHelper && (
          <span
            id={helperId}
            className="text-xs text-slate-500 dark:text-slate-400"
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
