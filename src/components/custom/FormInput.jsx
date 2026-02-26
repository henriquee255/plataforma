import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FaExclamationCircle } from 'react-icons/fa';

/**
 * FormInput - Input with label and error handling
 * Combines Shadcn Input + Label with validation display
 *
 * @param {string} label - Input label
 * @param {string} error - Error message
 * @param {boolean} required - Show required indicator
 * @param {string} id - Input ID (auto-generated if not provided)
 * @param {string} helperText - Helper text below input
 * @param {React.ReactNode} icon - Icon to show inside input (left side)
 */
const FormInput = ({
  label,
  error,
  required = false,
  id,
  helperText,
  icon,
  className = '',
  ...inputProps
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={inputId} className="text-sm font-medium">
          {label}
          {required && (
            <span className="ml-1 text-destructive" aria-label="obrigatório">
              *
            </span>
          )}
        </Label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}

        <Input
          id={inputId}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          className={`${icon ? 'pl-10' : ''} ${hasError ? 'border-destructive focus-visible:ring-destructive' : ''} ${className}`}
          {...inputProps}
        />
      </div>

      {helperText && !hasError && (
        <p id={`${inputId}-helper`} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}

      {hasError && (
        <p
          id={`${inputId}-error`}
          className="text-sm text-destructive flex items-center gap-1"
          role="alert"
        >
          <FaExclamationCircle className="h-3.5 w-3.5" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
