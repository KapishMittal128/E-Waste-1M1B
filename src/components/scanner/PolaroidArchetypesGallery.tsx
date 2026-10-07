import React from 'react';
import { motion } from 'framer-motion';

interface PolaroidArchetypesGalleryProps {
  onSelectPreset: (presetKey: string) => void;
  disabled?: boolean;
}

export const PolaroidArchetypesGallery: React.FC<PolaroidArchetypesGalleryProps> = ({
  onSelectPreset,
  disabled = false,
}) => {
  const polaroids = [
    {
      id: 'swollen-battery',
      num: '01',
      title: 'LI-ION CELL & COBALT',
      subtitle: 'HAZARD: THERMAL RUNAWAY',
      note: 'never puncture! store in dry sand.',
      imgSrc: '/images/polaroid_battery.jpg',
      tapeRotation: '-rotate-6',
      cardTilt: '-rotate-2',
      badge: 'SEVERE HAZARD',
      badgeClass: 'bg-rose-500/90 text-white',
      accentColor: '#E11D48',
    },
    {
      id: 'dell-laptop',
      num: '02',
      title: 'SILICON MOTHERBOARD',
      subtitle: 'URBAN MINING: 94% RECOVERY',
      note: 'recovers ~0.2g pure gold & copper!',
      imgSrc: '/images/polaroid_pcb.jpg',
      tapeRotation: 'rotate-4',
      cardTilt: 'rotate-1',
      badge: 'HIGH VALUE',
      badgeClass: 'bg-emerald-600/90 text-white',
      accentColor: '#059669',
    },
    {
      id: 'samsung-phone',
      num: '03',
      title: 'SMARTPHONE & DISPLAY',
      subtitle: 'MODULAR CIRCULAR HARVEST',
      note: 'screen & logic board salvageable.',
      imgSrc: '/images/polaroid_battery.jpg', // Disassembled electronics with screen & parts
      tapeRotation: '-rotate-3',
      cardTilt: '-rotate-1',
      badge: 'URBAN HARVEST',
      badgeClass: 'bg-amber-600/90 text-white',
      accentColor: '#D97706',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 select-none">
      {/* Editorial Header with Expressive Red Script (Matching Image 2 & 3) */}
      <div className="text-center space-y-2 mb-10">
        <div className="relative inline-block">
          <span className="font-script text-rose-500 text-5xl sm:text-7xl -rotate-6 inline-block transform drop-shadow-md select-none">
            enjoy every circuit.
          </span>
          {/* Expressive Red Brush Underline / Slash */}
          <svg
            className="w-48 sm:w-64 h-4 mx-auto -mt-2 text-rose-500/80"
            viewBox="0 0 200 12"
            fill="none"
          >
            <path
              d="M 2 8 C 50 2, 150 2, 198 8"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <p className="text-xs sm:text-sm font-mono tracking-widest text-zinc-400 uppercase">
          TACTILE HARDWARE ARCHETYPES // CLICK ANY POLAROID TO RUN EDGE TRIAGE
        </p>
      </div>

      {/* Triptych of 3 Polaroids with Real Masking Tape Effect (Matching Image 2) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-6 lg:gap-8 items-center justify-center">
        {polaroids.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.03, y: -6, rotate: 0 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            onClick={() => !disabled && onSelectPreset(item.id)}
            className={`relative group cursor-pointer ${item.cardTilt} transition-transform duration-300`}
          >
            {/* Masking / Washi Tape Graphic on Top Edge */}
            <div
              className={`absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 w-28 h-7 bg-amber-100/75 backdrop-blur-[2px] shadow-sm border border-amber-200/50 ${item.tapeRotation} flex items-center justify-center`}
              style={{
                clipPath: 'polygon(0% 15%, 4% 0%, 96% 0%, 100% 20%, 97% 85%, 100% 100%, 3% 100%, 0% 80%)',
              }}
            >
              <span className="text-[9px] font-mono tracking-widest text-amber-900/60 uppercase font-semibold">
                E-WASTE #{item.num}
              </span>
            </div>

            {/* Polaroid Frame Body */}
            <div className="bg-[#FAF9F5] text-zinc-900 p-4 pb-6 rounded-sm shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border border-stone-200/80 transition-shadow duration-300 group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)]">
              {/* Photo Container */}
              <div className="relative aspect-square w-full bg-zinc-950 overflow-hidden rounded-xs border border-stone-300/60">
                <img
                  src={item.imgSrc}
                  alt={item.title}
                  className="w-full h-full object-cover grayscale contrast-125 brightness-95 group-hover:scale-105 group-hover:contrast-115 transition-all duration-500"
                />

                {/* Subtle Film Grain Vignette Overlay */}
                <div className="absolute inset-0 bg-radial-vignette opacity-20 pointer-events-none" />

                {/* Status Pill on Photo */}
                <div className="absolute top-2.5 right-2.5">
                  <span
                    className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm ${item.badgeClass}`}
                  >
                    {item.badge}
                  </span>
                </div>
              </div>

              {/* Bottom Margin Notes (Classic Polaroid Aesthetic) */}
              <div className="mt-4 space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-zinc-500 tracking-wider">
                    {item.num} // ARCHETYPE
                  </span>
                  <span className="font-mono text-[10px] text-zinc-400 uppercase">
                    OFFLINE TEST
                  </span>
                </div>

                <h4 className="font-space font-black text-sm tracking-tight text-zinc-900 uppercase">
                  {item.title}
                </h4>

                <p className="font-mono text-[10px] text-zinc-600 tracking-tight">
                  {item.subtitle}
                </p>

                {/* Handwritten Ink Note */}
                <div className="pt-1 border-t border-stone-200">
                  <p className="font-caveat text-sm text-rose-600 font-semibold italic -rotate-1">
                    "{item.note}"
                  </p>
                </div>
              </div>

              {/* Hover Cue */}
              <div className="mt-2 text-center">
                <span className="text-[9px] font-mono text-zinc-400 group-hover:text-zinc-800 transition-colors uppercase tracking-widest">
                  Tap to diagnose →
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};
