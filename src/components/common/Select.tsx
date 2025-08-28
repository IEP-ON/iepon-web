'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    className,
    label,
    error,
    helperText,
    options,
    placeholder,
    required,
    ...props 
  }, ref) => {
    const hasError = !!error;

    return (
      <div className="form-field">
        {label && (
          <label className="form-label">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          <select
            className={cn(
              'form-select appearance-none',
              {
                'border-red-300 focus:ring-red-300 focus:border-red-300': hasError,
              },
              className
            )}
            ref={ref}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={
              hasError ? `${props.id || 'select'}-error` : 
              helperText ? `${props.id || 'select'}-helper` : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
        
        {(hasError || helperText) && (
          <div className="mt-1">
            {hasError && (
              <p 
                className="form-error" 
                id={`${props.id || 'select'}-error`}
                role="alert"
              >
                {error}
              </p>
            )}
            {!hasError && helperText && (
              <p 
                className="text-sm text-gray-500"
                id={`${props.id || 'select'}-helper`}
              >
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
