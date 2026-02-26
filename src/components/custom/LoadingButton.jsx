import React from 'react';
import { Button } from '@/components/ui/button';
import { FaSpinner } from 'react-icons/fa';

/**
 * LoadingButton - Button with loading state
 * Extends Shadcn Button with loading functionality
 *
 * @param {boolean} loading - Show loading spinner
 * @param {boolean} disabled - Disable button
 * @param {React.ReactNode} children - Button content
 * @param {string} loadingText - Text to show during loading
 * @param {string} variant - Button variant (default, destructive, outline, secondary, ghost, link)
 * @param {string} size - Button size (default, sm, lg, icon)
 */
const LoadingButton = ({
  loading = false,
  disabled = false,
  children,
  loadingText,
  variant = 'default',
  size = 'default',
  className = '',
  ...props
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={loading || disabled}
      className={className}
      {...props}
    >
      {loading && (
        <FaSpinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
      )}
      {loading ? loadingText || children : children}
    </Button>
  );
};

export default LoadingButton;
