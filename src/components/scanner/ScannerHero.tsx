import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EcoDot } from '../dot/EcoDot';
import { UnifiedViewfinder, InputMode } from './UnifiedViewfinder';
import { 
  ShieldCheck, 
  Cpu, 
  MapPin, 
  AlertTriangle, 
  Info, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Smartphone, 
  BatteryCharging 
} from 'lucide-react';
import { GWALIOR_LOCALITIES } from '../../data/recyclers';

interface ScannerHeroProps {
  onStartCamera: () => void;
  onUploadImage: () => void;
  onUploadFile?: (file: File) => void;
  onSearchManual: (query: string) => void;
  onSelectPreset: (presetKey: string) => void;
  isAnalyzing: boolean;
  selectedLocality: string;
  onLocalityChange: (loc: string) => void;
  onOpenHazardGuide: () => void;
}

export const ScannerHero: React.FC<ScannerHeroProps> = ({
  onStartCamera,
  onUploadImage,
  onUploadFile,
  onSearchManual,
  onSelectPreset,
  isAnalyzing,
  selectedLocality,
  onLocalityChange,
  onOpenHazardGuide,
}) => {
  const [inputMode, setInputMode] = useState<InputMode>('camera');
  const [showLocalityMenu, setShowLocalityMenu] = useState(false);
  const [showInventorModal, setShowInventorModal] = useState(false);
  const [showArchetypes, setShowArchetypes] = useState(false);

  const handleFileUpload = (file: File) => {
    if (onUploadFile) {
      onUploadFile(file);
    } else {
      onUploadImage();
    }
  };

  const quickPresets = [
    { id: 'swollen-battery', label: 'Li-Ion Battery', icon: BatteryCharging, badge: 'Hazardous' },
    { id: 'dell-laptop', label: 'Motherboard PCB', icon: Cpu, badge: 'Gold/Copper' },
    { id: 'samsung-phone', label: 'Smartphone', icon: Smartphone, badge: 'Modular' },
  ];

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex flex-col justify-between">
      {/* 
        ===================================================================
        FULL-BLEED LAPTOP WALLPAPER: Pastoral Rolling Hills & Sky
        ===================================================================
      */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/pastoral_landscape.jpg"
          alt="Pastoral Green Hillside with Soft Clouds"
          className="w-full h-full object-cover object-top brightness-100 contrast-100"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60 pointer-events-none" />
      </div>

      {/* 
        ===================================================================
        TOP BAR: Minimalist, Airy & Uncluttered
        ===================================================================
      */}
      <header className="relative z-30 w-full max-w-7xl mx-auto pt-4 sm:pt-6 px-4 sm:px-8 flex items-center justify-between select-none">
        
        {/* Left: Compact Status Pill (Clickable for Specs) */}
        <button
          onClick={() => setShowInventorModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/35 hover:bg-black/50 backdrop-blur-2xl border border-white/20 text-xs text-white transition-all shadow-md group"
          title="View Inventor & Edge Model Specs"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-mono text-[11px] text-zinc-200">
            EcoEdgeNet <strong className="text-emerald-300">INT8</strong>
          </span>
          <Info className="w-3 h-3 text-zinc-400 group-hover:text-white transition-colors" />
        </button>

        {/* Center: Clean Brand Mark (Exact CREATIE Aesthetic from Image 1) */}
        <div className="text-center">
          <span className="font-space font-black tracking-[0.35em] text-white text-sm sm:text-base uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            EWASTE OFF
          </span>
        </div>

        {/* Right: Unified Locality + Safety Capsule */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/35 backdrop-blur-2xl border border-white/20 shadow-md">
          {/* Locality Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLocalityMenu(!showLocalityMenu)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl hover:bg-white/10 text-xs text-white transition-colors font-mono"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span className="max-w-[100px] truncate">{selectedLocality.split('(')[0].trim()}</span>
            </button>

            {showLocalityMenu && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-zinc-950/95 border border-white/20 shadow-2xl p-2 z-50 backdrop-blur-2xl">
                <div className="px-2 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-white/10 font-mono">
                  Select Gwalior Area
                </div>
                <div className="max-h-56 overflow-y-auto py-1">
                  {GWALIOR_LOCALITIES.map((loc) => (
                    <button
                      key={loc.name}
                      onClick={() => {
                        onLocalityChange(loc.name);
                        setShowLocalityMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-xl transition-colors flex items-center justify-between font-mono ${
                        selectedLocality === loc.name
                          ? 'bg-zinc-800 text-white font-bold'
                          : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                      }`}
                    >
                      <span>{loc.name}</span>
                      {selectedLocality === loc.name && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-[1px] h-4 bg-white/15" />

          {/* Hazard Protocol Button */}
          <button
            onClick={onOpenHazardGuide}
            className="p-1.5 rounded-xl hover:bg-rose-500/20 text-zinc-300 hover:text-rose-400 transition-colors"
            title="Hazardous E-Waste Protocol"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 
        ===================================================================
        MAIN LAPTOP WORKSPACE: Central, Clean, Focused on Triage
        ===================================================================
      */}
      <main className="relative z-10 w-full max-w-4xl mx-auto my-auto px-4 sm:px-6 py-4 flex flex-col items-center text-center">
        
        {/* Clean Architectural Headline with Red Script */}
        <div className="relative mb-4 select-none">
          
          {/* Yellow Wire Doodle (Image 1 Signature) */}
          <div className="absolute -top-6 -right-6 sm:-right-10 pointer-events-none">
            <svg width="48" height="48" viewBox="0 0 60 60" fill="none">
              <path
                d="M10 35 C8 15, 35 5, 40 25 C45 40, 15 50, 20 30 C25 15, 55 20, 50 45"
                stroke="#FACC15"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h1 className="font-space font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white uppercase leading-none drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
            ZERO E-WASTE. PURE EARTH.
          </h1>

          <div className="relative -mt-3 sm:-mt-4">
            <span className="font-script text-rose-500 text-4xl sm:text-6xl -rotate-4 inline-block drop-shadow-[0_4px_14px_rgba(225,29,72,0.5)]">
              preserve every circuit.
            </span>
          </div>

          {/* Two Tasteful Sticker Badges Pinned to the Headline */}
          <div className="flex items-center justify-center gap-3 mt-2">
            <span className="px-2.5 py-1 rounded-full bg-sky-200 text-sky-950 font-space font-extrabold text-[10px] sm:text-[11px] shadow-lg -rotate-3 border border-sky-300">
              LITERT INT8
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-950 font-space font-extrabold text-[10px] sm:text-[11px] shadow-lg rotate-2 border border-emerald-300">
              ZERO CLOUD
            </span>
          </div>
        </div>

        {/* Sentient Plush EcoDot Mascot on the Meadow */}
        <div className="mb-3">
          <EcoDot
            state={isAnalyzing ? 'scanning' : 'idle'}
            size={96}
            className="drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
          />
        </div>

        {/* Unified 3-Mode Viewfinder */}
        <div className="w-full max-w-2xl bg-zinc-950/80 backdrop-blur-2xl border border-white/20 rounded-3xl p-3 sm:p-5 shadow-2xl">
          <UnifiedViewfinder
            mode={inputMode}
            onModeChange={setInputMode}
            onStartCamera={onStartCamera}
            onUploadFile={handleFileUpload}
            onSearchManual={onSearchManual}
            isAnalyzing={isAnalyzing}
          />
        </div>

        {/* Quick Test Archetypes Strip (Accommodated Cleanly Without Clutter!) */}
        <div className="w-full max-w-2xl mt-4">
          <div className="flex items-center justify-between px-2 mb-2">
            <button
              onClick={() => setShowArchetypes(!showArchetypes)}
              className="flex items-center gap-1.5 text-xs font-mono text-zinc-300 hover:text-white transition-colors uppercase tracking-wider"
            >
              <span>Test Presets</span>
              {showArchetypes ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <span className="text-[10px] font-mono text-zinc-400">1-click offline triage</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {quickPresets.map((preset) => {
              const Icon = preset.icon;
              return (
                <button
                  key={preset.id}
                  onClick={() => onSelectPreset(preset.id)}
                  disabled={isAnalyzing}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/15 hover:border-white/30 transition-all text-left group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-mono text-zinc-200 group-hover:text-white truncate">
                      {preset.label}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-400 hidden sm:inline">
                    {preset.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Expandable Tactile Polaroids Modal / Drawer */}
          <AnimatePresence>
            {showArchetypes && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden pt-3"
              >
                <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/15">
                  <div
                    onClick={() => onSelectPreset('swollen-battery')}
                    className="bg-[#FAF9F5] p-2 pb-3 rounded shadow-md cursor-pointer hover:scale-105 transition-transform text-zinc-900"
                  >
                    <img src="/images/polaroid_battery.jpg" alt="Battery" className="w-full aspect-square object-cover rounded-xs grayscale" />
                    <p className="font-mono text-[9px] font-bold mt-1 uppercase truncate">01. Li-Ion Cell</p>
                    <p className="font-caveat text-xs text-rose-600 truncate">Thermal hazard</p>
                  </div>
                  <div
                    onClick={() => onSelectPreset('dell-laptop')}
                    className="bg-[#FAF9F5] p-2 pb-3 rounded shadow-md cursor-pointer hover:scale-105 transition-transform text-zinc-900"
                  >
                    <img src="/images/polaroid_pcb.jpg" alt="PCB" className="w-full aspect-square object-cover rounded-xs grayscale" />
                    <p className="font-mono text-[9px] font-bold mt-1 uppercase truncate">02. Silicon PCB</p>
                    <p className="font-caveat text-xs text-emerald-700 truncate">Au/Cu recovery</p>
                  </div>
                  <div
                    onClick={() => onSelectPreset('samsung-phone')}
                    className="bg-[#FAF9F5] p-2 pb-3 rounded shadow-md cursor-pointer hover:scale-105 transition-transform text-zinc-900"
                  >
                    <img src="/images/polaroid_battery.jpg" alt="Phone" className="w-full aspect-square object-cover rounded-xs grayscale" />
                    <p className="font-mono text-[9px] font-bold mt-1 uppercase truncate">03. Smartphone</p>
                    <p className="font-caveat text-xs text-amber-700 truncate">Screen & chassis</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* 
        ===================================================================
        BOTTOM ROW: Poetic Tagline & Benchmark Capsule
        ===================================================================
      */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto pb-4 px-4 sm:px-8 flex items-center justify-between text-xs text-zinc-300 select-none">
        <p className="font-mono text-[11px] text-zinc-300">
          — Not just code. Keeping heavy metals out of the soil.
        </p>
        <span className="font-mono text-[11px] text-zinc-400 hidden sm:inline">
          Latency: <strong>9.3ms</strong> // Local-First Edge AI
        </span>
      </footer>

      {/* 
        ===================================================================
        INVENTOR & ARCHITECTURE MODAL (Accommodated Cleanly Without Clutter)
        ===================================================================
      */}
      <AnimatePresence>
        {showInventorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md p-6 rounded-3xl bg-zinc-950/95 border border-white/20 shadow-2xl text-left space-y-4"
            >
              <button
                onClick={() => setShowInventorModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  ● 100% On-Device · Gwalior Edge Node
                </span>
                <h3 className="text-lg font-space font-extrabold text-white uppercase">
                  Kapish Mittal — Lead Inventor
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  EcoEdgeNet architecture classifying e-waste in 9.3ms locally on device without remote cloud latency or telemetry.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 font-mono text-[11px]">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-zinc-400 text-[10px]">WEIGHT</div>
                  <div className="font-bold text-white">346 KB</div>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-zinc-400 text-[10px]">FORMAT</div>
                  <div className="font-bold text-white">INT8</div>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-zinc-400 text-[10px]">PRIVACY</div>
                  <div className="font-bold text-emerald-400">100% Local</div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
