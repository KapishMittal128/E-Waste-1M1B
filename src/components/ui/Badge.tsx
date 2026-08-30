import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'hazard' | 'success' | 'white';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors';

  const variants = {
    default: 'bg-zinc-900 text-zinc-300 border border-zinc-750',
    outline: 'border border-zinc-800 text-zinc-400 bg-transparent',
    secondary: 'bg-zinc-800 text-zinc-200 border border-zinc-700',
    hazard: 'bg-zinc-900 text-zinc-100 border border-zinc-500 font-bold',
    success: 'bg-zinc-900 text-zinc-200 border border-zinc-600',
    white: 'bg-white text-black font-extrabold shadow-sm',
  };

  return (
    <div
      className={twMerge(clsx(baseClasses, variants[variant], className))}
      {...props}
    >
      {children}
    </div>
  );
};
