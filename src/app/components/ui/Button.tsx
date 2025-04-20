import { ButtonHTMLAttributes, ElementType, ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps<T extends ElementType = 'button'> extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
  as?: T;
  href?: string;
}

export function Button<T extends ElementType = 'button'>({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  children,
  as,
  ...props
}: ButtonProps<T>) {
  const Component = as || 'button';
  const baseStyles = clsx(
    'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200',
    {
      'text-white bg-blue-600 hover:bg-blue-700': variant === 'primary',
      'text-gray-700 bg-gray-200 hover:bg-gray-300': variant === 'secondary',
      'text-blue-600 bg-white border border-current hover:bg-blue-50': variant === 'outline',
      'px-3 py-1.5 text-sm': size === 'sm',
      'px-4 py-2 text-base': size === 'md',
      'px-6 py-2.5 text-lg': size === 'lg',
      'opacity-50 cursor-not-allowed': disabled || isLoading,
    },
    className
  );

  return (
    <Component
      className={baseStyles}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </Component>
  );
} 