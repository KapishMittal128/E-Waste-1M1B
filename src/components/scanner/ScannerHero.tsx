import React, { useState } from 'react';
import { Camera, Upload, Search, Sparkles, ShieldCheck, BatteryWarning, Tv, Smartphone, Laptop, Cable, Heart } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface ScannerHeroProps {
  onStartCamera: () => void;
  onUploadImage: () => void;
  onSearchManual: (query: string) => void;
  onSelectPreset: (presetKey: string) => void;
  isAnalyzing: boolean;
}

export const ScannerHero: React.FC<ScannerHeroProps> = ({
  onStartCamera,
  onUploadImage,
  onSearchManual,
  onSelectPreset,
  isAnalyzing
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const hasApiKey = !!((import.meta as any).env?.VITE_GEMINI_API_KEY || localStorage.getItem('ewaste_gemini_api_key'));

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchManual(searchQuery.trim());
    }
  };

  // presets
  const samplePresets = [
    {
      id: 'samsung-phone',
      name: 'Samsung Galaxy S9',
      category: 'Mobile Phone',
      icon: Smartphone,
      badge: '94% Match',
    },
    {
      id: 'swollen-battery',
      name: 'Swollen Li-Ion Battery',
      category: 'Hazard Alert',
      icon: BatteryWarning,
      badge: 'Hazardous',
    },
    {
      id: 'crt-tv',
      name: 'CRT Television',
      category: 'High-Lead Glass',
      icon: Tv,
      badge: 'Leaded Glass',
    },
    {
      id: 'dell-laptop',
      name: 'Dell Inspiron 15',
      category: 'Notebook PC',
      icon: Laptop,
      badge: 'Repairable',
    },
    {
      id: 'cables-chargers',
      name: 'Tangled Cables Bundle',
      category: 'Copper Scrap',
      icon: Cable,
      badge: 'Recyclable',
    }
  ];

  return (
    <div className="relative overflow-hidden py-10 sm:py-16">
      {/* background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-radial-gradient pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-8">
        
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-zinc-950/90 border border-zinc-800 text-xs text-zinc-300 shadow-md backdrop-blur-md hover:border-zinc-700 transition-colors">
            <span>made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse inline" />
            <span>by</span>
            <span className="text-white font-bold tracking-tight">Kapish Mittal</span>
          </div>

          <Badge variant="outline" className="px-3.5 py-1.5 text-xs text-zinc-400 border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-300 mr-1" />
            <span>Gwalior Action Intervention</span>
          </Badge>

          <Badge
            variant="outline"
            className={`px-3.5 py-1.5 text-xs border bg-zinc-950/80 backdrop-blur-md ${
              hasApiKey
                ? 'text-emerald-400 border-emerald-900'
                : 'text-amber-400 border-amber-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            <span>{hasApiKey ? 'Gemini AI Active' : 'Setup AI Vision'}</span>
          </Badge>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Turn Dead Electronics Into <br />
            <span className="text-zinc-400">
              Responsible Next Action
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Identify electronic devices, analyze component hazards, and route directly to 
            <span className="text-zinc-200 font-semibold"> MPPCB-authorized recyclers</span> across Gwalior.
          </p>
        </div>

        <Card className="p-6 sm:p-8 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              variant="shimmer"
              size="lg"
              onClick={onStartCamera}
              disabled={isAnalyzing}
              className="py-5 text-base sm:text-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-200 flex items-center justify-center text-black">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="leading-tight font-black">Scan Your E-Waste</div>
                  <div className="text-[11px] text-zinc-600 font-normal">{hasApiKey ? 'Gemini AI will identify what it is' : 'Setup AI key first'}</div>
                </div>
              </div>
              <Sparkles className="w-5 h-5 text-zinc-700" />
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={onUploadImage}
              disabled={isAnalyzing}
              className="py-5 text-base sm:text-lg flex items-center justify-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-white">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="leading-tight font-black">Upload Device Photo</div>
                <div className="text-[11px] text-zinc-400 font-normal">{hasApiKey ? 'AI will analyze & classify the image' : 'AI key required for image analysis'}</div>
              </div>
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">or enter manually</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-zinc-500 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="e.g. Samsung phone, swollen battery, CRT TV, laptop, charger cord..."
                className="glass-input-dark w-full pl-11 pr-28 py-3.5 text-xs text-zinc-100"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!searchQuery.trim() || isAnalyzing}
                className="absolute right-2 px-4 py-1.5 text-xs"
              >
                Analyze
              </Button>
            </div>
          </form>

        </Card>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
            <span className="font-bold uppercase tracking-wider text-[10px] text-zinc-400">
              Quick Test Items (Try Instant Analysis)
            </span>
            <span className="text-[10px] text-zinc-500 hidden sm:inline">Click any item below to simulate real-world scan</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {samplePresets.map(preset => {
              const Icon = preset.icon;
              return (
                <button
                  key={preset.id}
                  onClick={() => onSelectPreset(preset.id)}
                  disabled={isAnalyzing}
                  className="p-3.5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-850/80 border border-zinc-800/80 hover:border-zinc-600 text-left transition-all group flex flex-col justify-between h-28 shadow-md disabled:opacity-40"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-zinc-750 text-zinc-400">
                      {preset.badge}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-100 group-hover:text-white transition-colors line-clamp-1">
                      {preset.name}
                    </div>
                    <div className="text-[10px] text-zinc-500">{preset.category}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {isAnalyzing && (
          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center gap-3 animate-pulse shadow-xl">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold text-zinc-200">
              AI Vision Engine analyzing circuitry, hazardous materials, and components...
            </span>
          </div>
        )}

      </div>
    </div>
  );
};
