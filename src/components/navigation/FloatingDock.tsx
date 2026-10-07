import React from 'react';
import { motion } from 'framer-motion';
import { Scan, MapPin, Building2, ShieldCheck } from 'lucide-react';

export type NavTab = 'scanner' | 'radar' | 'campus' | 'trust';

interface FloatingDockProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: 'scanner' as NavTab, label: 'Scanner', icon: Scan },
    { id: 'radar' as NavTab, label: 'Recycler Radar', icon: MapPin },
    { id: 'campus' as NavTab, label: 'Campus Bins', icon: Building2 },
    { id: 'trust' as NavTab, label: 'Trust & Specs', icon: ShieldCheck },
  ];

  return (
    <div className="fixed bottom-6 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
      <motion.nav
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-full bg-[#111113]/85 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/80"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-4 py-2 rounded-full flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-wider transition-colors duration-200 ${
                isActive ? 'text-black' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-dock-pill"
                  className="absolute inset-0 bg-white rounded-full -z-10 shadow-md shadow-white/20"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </motion.button>
          );
        })}
      </motion.nav>
    </div>
  );
};
