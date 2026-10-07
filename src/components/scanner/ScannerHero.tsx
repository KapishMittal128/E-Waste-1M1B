import React, { useState } from 'react';
import { EcoDot } from '../dot/EcoDot';
import { BlurText } from '../reactbits/BlurText';
import { HandwrittenNote } from '../annotations/HandwrittenNote';
import { UnifiedViewfinder, InputMode } from './UnifiedViewfinder';
import { HardwarePresetsTray } from './HardwarePresetsTray';
import { Badge } from '../ui/Badge';
import { ShieldCheck, Cpu } from 'lucide-react';

interface ScannerHeroProps {
  onStartCamera: () => void;
  onUploadImage: () => void;
  onUploadFile?: (file: File) => void;
  onSearchManual: (query: string) => void;
  onSelectPreset: (presetKey: string) => void;
  isAnalyzing: boolean;
}

export const ScannerHero: React.FC<ScannerHeroProps> = ({
  onStartCamera,
  onUploadImage,
  onUploadFile,
  onSearchManual,
  onSelectPreset,
  isAnalyzing,
}) => {
  const [inputMode, setInputMode] = useState<InputMode>('camera');

  const handleFileUpload = (file: File) => {
    if (onUploadFile) {
      onUploadFile(file);
    } else {
      onUploadImage();
    }
  };

  return (
    <div className="relative py-8 sm:py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-8 text-center">
      {/* Top Protocol Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <Badge variant="cyan" className="flex items-center gap-1.5">
          <Cpu className="w-3 h-3 text-cyan-400" />
          <span>LITERT INT8 // 346KB FOOTPRINT</span>
        </Badge>
        <Badge variant="success" className="flex items-center gap-1.5">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>ZERO-CLOUD LOCAL INFERENCE</span>
        </Badge>
      </div>

      {/* Sentient 3D Plush Mascot: The DOT */}
      <div className="flex flex-col items-center justify-center relative pt-2">
        <div className="relative inline-flex items-center justify-center">
          <EcoDot
            state={isAnalyzing ? 'scanning' : 'idle'}
            size={116}
            className="mx-auto"
          />

          {/* Handwritten Annotation pointing to The DOT */}
          <div className="hidden lg:block absolute left-full ml-6 top-6 whitespace-nowrap">
            <HandwrittenNote
              arrow="curved-left"
              text="sentient triage buddy — tracks your gaze & breathes!"
              color="amber"
              tilt={-3}
            />
          </div>
        </div>
      </div>

      {/* Kinetic Industrial Typography */}
      <div className="space-y-2 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-black font-space tracking-tight text-white leading-tight uppercase">
          <span className="bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            <BlurText text="POINT. IDENTIFY. DIVERT." delay={0.05} />
          </span>
        </h1>
        <p className="text-xs sm:text-sm font-mono text-zinc-400 tracking-wider uppercase">
          ON-DEVICE EDGE VISION // 2GB RAM BUDGET // 100% OFFLINE
        </p>
      </div>

      {/* Unified 3-Mode Viewfinder */}
      <div className="relative">
        <UnifiedViewfinder
          mode={inputMode}
          onModeChange={setInputMode}
          onStartCamera={onStartCamera}
          onUploadFile={handleFileUpload}
          onSearchManual={onSearchManual}
          isAnalyzing={isAnalyzing}
        />

        {/* Marginalia under Viewfinder */}
        <div className="pt-2 flex justify-center">
          <HandwrittenNote
            arrow="down"
            text="drop any circuit board, phone, or battery here — 100% offline edge AI"
            color="white"
            tilt={1.5}
            className="text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Collapsible Hardware Presets Tray with 3D Tilt */}
      <HardwarePresetsTray
        onSelectPreset={onSelectPreset}
        disabled={isAnalyzing}
      />
    </div>
  );
};
