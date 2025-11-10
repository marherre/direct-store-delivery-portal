import React, { useId, forwardRef } from 'react';
import { cn } from '@/shared/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-gray-700 mb-2.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'flex h-12 w-full rounded-xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-100 focus-visible:shadow-md focus-visible:shadow-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-400 focus-visible:border-red-500 focus-visible:ring-red-100 focus-visible:shadow-red-500/20',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-600 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

