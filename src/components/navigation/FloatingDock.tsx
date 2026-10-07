import React from 'react';
import { motion } from 'framer-motion';
import { Scan, MapPin, Building2, ShieldCheck, Sparkles } from 'lucide-react';

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
    <>
      {/* 
        ===================================================================
        DESKTOP / LAPTOP: Vertical Side Dock (Left Side)
        Clean, uncluttered, macOS / native app style
        ===================================================================
      */}
      <aside className="fixed left-4 lg:left-6 top-1/2 -translate-y-1/2 z-50 hidden sm:flex flex-col items-center select-none pointer-events-auto">
        <motion.nav
          initial={{ x: -24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="flex flex-col items-center gap-2 p-2 rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
        >
          {/* Top Mini Brand Icon */}
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center mb-1 text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>

          <div className="w-6 h-[1px] bg-white/10 mb-1" />

          {/* Navigation Items */}
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <div key={tab.id} className="relative group">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ scale: 1.08 }}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                    isActive ? 'text-black' : 'text-zinc-300 hover:text-white hover:bg-white/10'
                  }`}
                  aria-label={tab.label}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-side-dock-pill"
                      className="absolute inset-0 bg-white rounded-xl shadow-lg shadow-white/20 -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <Icon className="w-5 h-5" />
                </motion.button>

                {/* Hover Tooltip on Right */}
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-zinc-950/90 text-white text-[11px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 border border-white/15 shadow-xl -translate-x-1 group-hover:translate-x-0 z-50">
                  {tab.label}
                </div>
              </div>
            );
          })}
        </motion.nav>
      </aside>

      {/* 
        ===================================================================
        MOBILE COMPACT DOCK: Bottom Floating Pill (Only on small screens)
        ===================================================================
      */}
      <div className="fixed bottom-4 inset-x-0 z-50 flex sm:hidden justify-center pointer-events-none px-4 select-none">
        <motion.nav
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="pointer-events-auto flex items-center gap-1 p-1.5 rounded-full bg-black/60 backdrop-blur-3xl border border-white/20 shadow-2xl ring-1 ring-white/10"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative p-2.5 rounded-full transition-colors ${
                  isActive ? 'text-black bg-white shadow-md' : 'text-zinc-300 hover:text-white'
                }`}
                title={tab.label}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </motion.nav>
      </div>
    </>
  );
};
