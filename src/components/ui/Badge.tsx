import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'hazard' | 'success' | 'cyan' | 'amber' | 'white';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono tracking-wider uppercase font-semibold transition-all duration-200 border';

  const variants = {
    default: 'bg-zinc-900/80 text-zinc-300 border-zinc-700/60 shadow-sm backdrop-blur-md',
    outline: 'border-white/10 text-zinc-400 bg-white/[0.02] backdrop-blur-md',
    secondary: 'bg-zinc-800/80 text-zinc-200 border-zinc-600/50 backdrop-blur-md',
    hazard: 'bg-orange-500/10 text-orange-400 border-orange-500/30 shadow-[0_0_12px_rgba(255,87,34,0.15)] font-bold',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)] font-bold',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)] font-bold',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)] font-bold',
    white: 'bg-white text-black font-extrabold shadow-md border-transparent hover:bg-zinc-200',
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
