'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { cn, validateUTF8 } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className,
    type = 'text',
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    showPasswordToggle = false,
    required,
    onChange,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [utf8Error, setUtf8Error] = useState<string>('');

    const inputType = showPasswordToggle && showPassword ? 'text' : type;
    const hasError = error || utf8Error;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      
      // UTF-8 안전성 검증
      if (value && !validateUTF8(value)) {
        setUtf8Error('올바르지 않은 문자가 포함되어 있습니다.');
      } else {
        setUtf8Error('');
      }

      onChange?.(e);
    };

    return (
      <div className="form-field">
        {label && (
          <label className="form-label">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <input
            type={inputType}
            className={cn(
              'form-input',
              {
                'pl-10': leftIcon,
                'pr-10': rightIcon || showPasswordToggle,
                'border-red-300 focus:ring-red-300 focus:border-red-300': hasError,
              },
              className
            )}
            ref={ref}
            onChange={handleChange}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={
              hasError ? `${props.id || 'input'}-error` : 
              helperText ? `${props.id || 'input'}-helper` : undefined
            }
            {...props}
          />
          
          {(rightIcon || showPasswordToggle) && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {showPasswordToggle ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-300 rounded"
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              ) : (
                rightIcon
              )}
            </div>
          )}
        </div>
        
        {(hasError || helperText) && (
          <div className="mt-1">
            {hasError && (
              <p 
                className="form-error" 
                id={`${props.id || 'input'}-error`}
                role="alert"
              >
                {error || utf8Error}
              </p>
            )}
            {!hasError && helperText && (
              <p 
                className="text-sm text-gray-500"
                id={`${props.id || 'input'}-helper`}
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

Input.displayName = 'Input';

export default Input;
