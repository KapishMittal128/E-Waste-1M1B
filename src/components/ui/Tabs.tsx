import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface TabsProps {
  items: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeTab,
  onChange,
  className
}) => {
  return (
    <div className={twMerge(clsx('flex items-center gap-1 bg-zinc-950/90 p-1.5 rounded-2xl border border-zinc-800/80 backdrop-blur-xl', className))}>
      {items.map(item => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-colors select-none flex items-center gap-2 ${
              isActive ? 'text-black' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-white rounded-xl shadow-md"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
