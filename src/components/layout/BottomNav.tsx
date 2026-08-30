import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, Building2, Layers } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'scanner', label: 'Scan', icon: Sparkles, highlight: true },
    { id: 'recyclers', label: 'Recyclers', icon: MapPin },
    { id: 'school', label: 'School Bins', icon: Building2 },
    { id: 'trust', label: 'Safety', icon: Layers },
  ];

  return (
    <div className="md:hidden fixed bottom-3 left-4 right-4 z-50">
      <div className="bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-1.5 shadow-2xl shadow-black/80">
        <div className="grid grid-cols-4 items-center gap-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            if (item.highlight) {
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="flex flex-col items-center justify-center -mt-5 group relative"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xl ${
                    isActive 
                      ? 'bg-white text-black scale-105 shadow-white/10 ring-2 ring-zinc-400' 
                      : 'bg-zinc-900 text-white border border-zinc-700'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] mt-1 font-bold ${isActive ? 'text-white' : 'text-zinc-400'}`}>
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center py-2 rounded-2xl transition-all ${
                  isActive ? 'text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveDock"
                    className="absolute inset-0 bg-zinc-900 rounded-2xl"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex flex-col items-center">
                  <Icon className="w-4 h-4" />
                  <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[65px]">
                    {item.label}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
