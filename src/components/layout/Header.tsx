import React, { useState } from 'react';
import { ShieldCheck, MapPin, AlertTriangle } from 'lucide-react';
import { GWALIOR_LOCALITIES } from '../../data/recyclers';

interface HeaderProps {
  onNavigateHome?: () => void;
  selectedLocality: string;
  setSelectedLocality: (loc: string) => void;
  onOpenHazardGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigateHome,
  selectedLocality,
  setSelectedLocality,
  onOpenHazardGuide
}) => {
  const [showLocalityMenu, setShowLocalityMenu] = useState(false);

  return (
    <header className="absolute top-0 inset-x-0 z-40 w-full bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-sm select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Left: Desktop OS Brand Capsule */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group select-none"
            onClick={onNavigateHome}
          >
            <div className="relative w-8 h-8 rounded-xl bg-black/40 border border-white/20 flex items-center justify-center shadow-md group-hover:border-emerald-400/60 transition-all">
              <div className="w-3.5 h-3.5 border-2 border-emerald-400 rounded-xs rotate-45 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border border-black animate-pulse" />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-space font-black text-sm sm:text-base tracking-tight text-white group-hover:text-emerald-300 transition-colors uppercase">
                EWaste <span className="text-zinc-300 font-semibold">Off</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-mono text-emerald-300 uppercase tracking-wider font-semibold">
                GWALIOR
              </span>
            </div>
          </div>

          {/* Center: Minimalist Tracked Brand Stamp (Exact CREATIE aesthetic from Image 1) */}
          <div className="hidden md:flex items-center justify-center pointer-events-none select-none">
            <span className="font-space font-black tracking-[0.35em] text-white/95 text-xs sm:text-sm uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
              CREATIE · ECOEDGENET
            </span>
          </div>

          {/* Right: Mac/Laptop Menu Bar Controls (Locality & Hazard Protocol) */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowLocalityMenu(!showLocalityMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/20 hover:border-white/40 text-xs text-white transition-all shadow-sm font-mono"
                title="Change Gwalior Locality"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span className="max-w-[120px] truncate font-medium">{selectedLocality.split('(')[0].trim()}</span>
              </button>

              {showLocalityMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-zinc-950/95 border border-white/15 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-2xl">
                  <div className="px-2 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-white/10 font-mono">
                    Select Gwalior Area
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1">
                    {GWALIOR_LOCALITIES.map(loc => (
                      <button
                        key={loc.name}
                        onClick={() => {
                          setSelectedLocality(loc.name);
                          setShowLocalityMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-colors flex items-center justify-between font-mono ${
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

            <button
              onClick={onOpenHazardGuide}
              className="p-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/20 hover:border-rose-400/60 text-zinc-200 hover:text-rose-400 transition-all shadow-sm"
              title="Hazardous E-Waste Safety Protocol"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
