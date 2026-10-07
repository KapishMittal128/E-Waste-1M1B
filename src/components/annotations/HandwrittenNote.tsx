import React from 'react';
import { motion } from 'framer-motion';

interface HandwrittenNoteProps {
  children?: React.ReactNode;
  text?: string;
  arrow?: 'left' | 'right' | 'up' | 'down' | 'curved-left' | 'curved-right' | 'none';
  color?: 'white' | 'orange' | 'amber' | 'emerald' | 'zinc';
  className?: string;
  tilt?: number; // degrees, e.g. -2.5
}

export const HandwrittenNote: React.FC<HandwrittenNoteProps> = ({
  children,
  text,
  arrow = 'none',
  color = 'amber',
  className = '',
  tilt = -2.5,
}) => {
  const colorClasses = {
    white: 'text-zinc-200',
    orange: 'text-[#FF5722]',
    amber: 'text-amber-400',
    emerald: 'text-emerald-400',
    zinc: 'text-zinc-400',
  }[color];

  const strokeColor = {
    white: '#E4E4E7',
    orange: '#FF5722',
    amber: '#FBBF24',
    emerald: '#34D399',
    zinc: '#A1A1AA',
  }[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 3, rotate: tilt - 1 }}
      animate={{ opacity: 1, y: 0, rotate: tilt }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`inline-flex items-center gap-2 font-caveat select-none pointer-events-none text-base sm:text-lg leading-tight drop-shadow-sm ${colorClasses} ${className}`}
    >
      {arrow === 'left' && (
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      )}

      {arrow === 'curved-left' && (
        <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 28 28" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 6c-8 2-14 8-14 16m0 0l-4-4m4 4l4-4" />
        </svg>
      )}

      {arrow === 'up' && (
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      )}

      <span>{text || children}</span>

      {arrow === 'right' && (
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      )}

      {arrow === 'curved-right' && (
        <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 28 28" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 6c8 2 14 8 14 16m0 0l4-4m-4 4l-4-4" />
        </svg>
      )}

      {arrow === 'down' && (
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      )}
    </motion.div>
  );
};
