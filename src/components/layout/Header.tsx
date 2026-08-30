import React, { useState } from 'react';
import { ShieldCheck, MapPin, AlertTriangle, Sparkles, Building2, Layers } from 'lucide-react';
import { GWALIOR_LOCALITIES } from '../../data/recyclers';
import { Tabs } from '../ui/Tabs';
import { Badge } from '../ui/Badge';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedLocality: string;
  setSelectedLocality: (loc: string) => void;
  onOpenHazardGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedLocality,
  setSelectedLocality,
  onOpenHazardGuide
}) => {
  const [showLocalityMenu, setShowLocalityMenu] = useState(false);

  const navItems = [
    { id: 'scanner', label: 'Scan & Sort', icon: Sparkles },
    { id: 'recyclers', label: 'Authorized Recyclers', icon: MapPin },
    { id: 'school', label: 'School Bins', icon: Building2 },
    { id: 'trust', label: 'Safety & Trust', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-black/80 backdrop-blur-2xl border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('scanner')}
          >
            <div className="relative w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center shadow-lg group-hover:border-zinc-500 transition-all">
              <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full border-2 border-black animate-pulse" />
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-zinc-200 transition-colors">
                  EWaste <span className="text-zinc-400 font-bold">Off</span>
                </span>
                <Badge variant="outline" className="text-[10px] tracking-wider uppercase border-zinc-800 text-zinc-400 bg-zinc-950">
                  Gwalior
                </Badge>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block font-medium">
                E-Waste Action & Recycler Locator
              </p>
            </div>
          </div>

          {/* animated navigation tabs */}
          <nav className="hidden md:block">
            <Tabs
              items={navItems}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </nav>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowLocalityMenu(!showLocalityMenu)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-200 transition-colors shadow-sm"
                title="Change Gwalior Locality"
              >
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                <span className="max-w-[110px] truncate font-medium">{selectedLocality.split('(')[0].trim()}</span>
              </button>

              {showLocalityMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-zinc-900/95 border border-zinc-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl">
                  <div className="px-2 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
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
                        className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-colors flex items-center justify-between ${
                          selectedLocality === loc.name
                            ? 'bg-zinc-800 text-white font-bold'
                            : 'text-zinc-300 hover:bg-zinc-850 hover:text-white'
                        }`}
                      >
                        <span>{loc.name}</span>
                        {selectedLocality === loc.name && <ShieldCheck className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={onOpenHazardGuide}
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors"
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
