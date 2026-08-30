import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'shimmer';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-bold transition-all duration-200 focus:outline-none disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] select-none';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'px-4 py-2.5 text-xs sm:text-sm rounded-xl gap-2',
    lg: 'px-6 py-3.5 text-sm sm:text-base rounded-2xl gap-2.5',
    icon: 'p-2 rounded-xl',
  };

  const variantClasses = {
    primary: 'bg-white text-black hover:bg-zinc-200 shadow-md shadow-white/5',
    shimmer: 'relative overflow-hidden bg-white text-black hover:bg-zinc-100 shadow-lg shadow-white/10 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-zinc-300/40 before:to-transparent',
    secondary: 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-100 hover:border-zinc-700',
    outline: 'border border-zinc-800 hover:border-zinc-600 bg-transparent text-zinc-300 hover:text-white',
    ghost: 'text-zinc-400 hover:text-white hover:bg-zinc-900',
  };

  return (
    <button
      className={twMerge(clsx(baseClasses, sizeClasses[size], variantClasses[variant], className))}
      {...props}
    >
      {children}
    </button>
  );
};
