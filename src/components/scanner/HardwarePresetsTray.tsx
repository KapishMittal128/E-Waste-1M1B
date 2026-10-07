import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, AlertTriangle, Tv, Cpu, ChevronDown, ChevronUp } from 'lucide-react';
import { TiltedCard } from '../reactbits/TiltedCard';
import { HandwrittenNote } from '../annotations/HandwrittenNote';

interface HardwarePresetsTrayProps {
  onSelectPreset: (presetKey: string) => void;
  disabled?: boolean;
}

export const HardwarePresetsTray: React.FC<HardwarePresetsTrayProps> = ({
  onSelectPreset,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const presets = [
    {
      id: 'samsung-phone',
      title: 'SMARTPHONE',
      subtitle: 'PCB + Cobalt 14.2g',
      badge: 'COMMON',
      badgeColor: 'border-zinc-700/60 text-zinc-300 bg-zinc-800/40',
      icon: Smartphone,
      isHazard: false,
    },
    {
      id: 'swollen-battery',
      title: 'LI-ION CELL',
      subtitle: 'HAZARD: THERMAL',
      badge: 'CRITICAL',
      badgeColor: 'border-orange-500/50 text-orange-400 bg-orange-500/10 shadow-[0_0_12px_rgba(255,87,34,0.2)]',
      icon: AlertTriangle,
      isHazard: true,
      note: 'fire hazard when swollen!',
    },
    {
      id: 'crt-tv',
      title: 'CRT MONITOR',
      subtitle: 'HAZARD: LEAD / HG',
      badge: 'LEADED GLASS',
      badgeColor: 'border-zinc-700/60 text-zinc-300 bg-zinc-800/40',
      icon: Tv,
      isHazard: false,
    },
    {
      id: 'dell-laptop',
      title: 'MOTHERBOARD',
      subtitle: 'Au/Cu/Pd 94% RECV',
      badge: 'HIGH VALUE',
      badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
      icon: Cpu,
      isHazard: false,
      note: 'recovers ~0.2g gold',
    },
  ];

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between px-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
        >
          <span>HARDWARE ARCHETYPE PRESETS</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <span className="text-[10px] font-mono text-zinc-500 uppercase hidden sm:inline">
          TEST RUN WITHOUT PHYSICAL HARDWARE
        </span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1 pb-2">
              {presets.map((preset) => {
                const Icon = preset.icon;

                return (
                  <TiltedCard
                    key={preset.id}
                    rotateAmplitude={10}
                    scaleOnHover={1.03}
                    onClick={() => !disabled && onSelectPreset(preset.id)}
                    className="h-full"
                  >
                    <div
                      className={`relative p-5 rounded-2xl border text-left transition-all duration-300 group flex flex-col justify-between h-36 select-none cursor-pointer backdrop-blur-2xl shadow-lg ${
                        preset.isHazard
                          ? 'border-orange-500/40 bg-gradient-to-b from-[#1c1214]/90 to-[#120b0d]/90 hover:border-orange-500 hover:shadow-[0_0_25px_rgba(255,87,34,0.25)]'
                          : 'border-white/10 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 hover:border-white/25 hover:shadow-[0_0_25px_rgba(255,255,255,0.06)]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div
                          className={`p-2.5 rounded-xl border ${
                            preset.isHazard
                              ? 'border-orange-500/50 bg-orange-500/20 text-orange-400'
                              : 'border-white/10 bg-zinc-800/60 text-white group-hover:border-emerald-500/40 group-hover:text-emerald-400'
                          } transition-colors`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-semibold ${preset.badgeColor}`}
                        >
                          {preset.badge}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs font-mono font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                          {preset.title}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-400">
                          {preset.subtitle}
                        </div>
                      </div>
                    </div>
                  </TiltedCard>
                );
              })}
            </div>

            {/* Handwritten Marginalia below preset row */}
            <div className="flex items-center justify-between px-3 pt-2">
              <HandwrittenNote arrow="up" text="fire hazard when swollen!" color="orange" tilt={-2} />
              <HandwrittenNote arrow="up" text="recovers ~0.2g precious gold" color="amber" tilt={2} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
