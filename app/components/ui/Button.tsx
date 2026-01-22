import {forwardRef} from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({className = '', variant = 'primary', size = 'md', children, ...props}, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded font-medium transition-colors';
    
    const variants = {
      primary: 'bg-black text-white hover:bg-gray-800',
      secondary: 'bg-gray-200 text-black hover:bg-gray-300',
      outline: 'border border-black text-black hover:bg-black hover:text-white',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
