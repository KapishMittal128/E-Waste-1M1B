import React, { useState } from 'react';
import { ShieldCheck, MapPin, AlertTriangle } from 'lucide-react';
import { GWALIOR_LOCALITIES } from '../../data/recyclers';
import { Badge } from '../ui/Badge';

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
    <header className="sticky top-0 z-40 w-full bg-zinc-950/70 backdrop-blur-2xl border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={onNavigateHome}
          >
            <div className="relative w-10 h-10 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-lg group-hover:border-emerald-500/50 transition-all">
              <div className="w-4 h-4 border-2 border-emerald-400 rounded-sm rotate-45 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-black animate-pulse" />
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-emerald-300 transition-colors font-space">
                  EWaste <span className="text-zinc-400 font-bold">Off</span>
                </span>
                <Badge variant="cyan" className="text-[10px] tracking-wider uppercase">
                  Gwalior
                </Badge>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block font-medium">
                Autonomous On-Device E-Waste Triage & Recycler Locator
              </p>
            </div>
          </div>

          {/* Right Action Controls: Locality & Emergency Protocol */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowLocalityMenu(!showLocalityMenu)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900/80 border border-white/10 hover:border-white/30 text-xs text-zinc-200 transition-all shadow-sm font-mono"
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
              className="p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 hover:border-orange-500/50 text-zinc-300 hover:text-orange-400 transition-all shadow-sm"
              title="Hazardous E-Waste Safety Protocol"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
