import React from 'react';
import { motion } from 'framer-motion';
import { 
  XCircle, 
  Camera, 
  Smartphone, 
  Laptop, 
  BatteryCharging, 
  Tv, 
  Monitor, 
  Cable, 
  Printer, 
  Zap 
} from 'lucide-react';
import { SpotlightCard } from '../reactbits/SpotlightCard';
import { HandwrittenNote } from '../annotations/HandwrittenNote';

interface NotEWasteCardProps {
  description: string;
  onTryAgain: () => void;
}

export const NotEWasteCard: React.FC<NotEWasteCardProps> = ({ description, onTryAgain }) => {
  const validItems = [
    { label: 'Smartphones & Tablets', icon: Smartphone },
    { label: 'Broken Laptops & PCs', icon: Laptop },
    { label: 'Batteries & Cells', icon: BatteryCharging },
    { label: 'CRT & LED Screens', icon: Tv },
    { label: 'Monitors & Displays', icon: Monitor },
    { label: 'Chargers & Cables', icon: Cable },
    { label: 'Printers & Peripherals', icon: Printer },
    { label: 'Power Banks & UPS', icon: Zap },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-6 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center mx-auto text-zinc-400 shadow-xl">
        <XCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-mono font-extrabold text-white uppercase tracking-tight">
          NON-ELECTRONIC ITEM DETECTED
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm font-sans">
          The edge vision model classified this image as:{' '}
          <span className="text-white font-mono font-bold">"{description}"</span>
        </p>
        <p className="text-zinc-500 text-xs font-mono max-w-md mx-auto">
          EWaste Off triages electronic equipment, components, batteries, and circuitry only. Municipal household refuse should follow standard city disposal.
        </p>
      </div>

      <SpotlightCard className="p-6 text-left space-y-4 bg-[#0c0c0e]/95 border border-white/10">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
            ACCEPTED HARDWARE ARCHETYPES FOR SCANNING
          </p>
          <HandwrittenNote arrow="left" text="accepted items" color="zinc" tilt={2} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-zinc-300">
          {validItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800"
              >
                <Icon className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </SpotlightCard>

      <div className="pt-2">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={onTryAgain}
          className="px-8 py-3.5 rounded-full bg-white text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors shadow-lg shadow-white/10 inline-flex items-center gap-2"
        >
          <Camera className="w-4 h-4" />
          <span>RETRY WITH HARDWARE PHOTO</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
