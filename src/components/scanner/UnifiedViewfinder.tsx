import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Search, CornerDownLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { DecryptedText } from '../reactbits/DecryptedText';
import { ClickSpark } from '../reactbits/ClickSpark';
import { Magnet } from '../reactbits/Magnet';
import { HandwrittenNote } from '../annotations/HandwrittenNote';

export type InputMode = 'camera' | 'upload' | 'search';

interface UnifiedViewfinderProps {
  mode: InputMode;
  onModeChange: (mode: InputMode) => void;
  onStartCamera: () => void;
  onUploadFile: (file: File) => void;
  onSearchManual: (query: string) => void;
  isAnalyzing: boolean;
}

export const UnifiedViewfinder: React.FC<UnifiedViewfinderProps> = ({
  mode,
  onModeChange,
  onStartCamera,
  onUploadFile,
  onSearchManual,
  isAnalyzing,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchManual(searchQuery.trim());
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUploadFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* 3-Mode Segmented Dock with Spring Pill */}
      <div className="flex flex-col items-center gap-1.5">
        <div className="inline-flex items-center gap-1 p-1.5 rounded-full bg-zinc-950/80 border border-white/10 shadow-2xl backdrop-blur-2xl">
          <button
            type="button"
            onClick={() => onModeChange('camera')}
            className={`relative px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-colors duration-200 flex items-center gap-2 select-none ${
              mode === 'camera' ? 'text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {mode === 'camera' && (
              <motion.div
                layoutId="active-view-mode"
                className="absolute inset-0 bg-white rounded-full -z-10 shadow-lg"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
            )}
            <Camera className="w-3.5 h-3.5" />
            <span>LIVE CAMERA</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange('upload')}
            className={`relative px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-colors duration-200 flex items-center gap-2 select-none ${
              mode === 'upload' ? 'text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {mode === 'upload' && (
              <motion.div
                layoutId="active-view-mode"
                className="absolute inset-0 bg-white rounded-full -z-10 shadow-lg"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
            )}
            <Upload className="w-3.5 h-3.5" />
            <span>DROP IMAGE</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange('search')}
            className={`relative px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-colors duration-200 flex items-center gap-2 select-none ${
              mode === 'search' ? 'text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {mode === 'search' && (
              <motion.div
                layoutId="active-view-mode"
                className="absolute inset-0 bg-white rounded-full -z-10 shadow-lg"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
            )}
            <Search className="w-3.5 h-3.5" />
            <span>MANUAL SEARCH</span>
          </button>
        </div>

        <HandwrittenNote arrow="curved-left" text="zero-latency mode switch" color="amber" tilt={-3} className="text-xs sm:text-sm" />
      </div>

      {/* Main Glass Viewfinder Frame with ClickSpark */}
      <ClickSpark sparkColor="#10B981" sparkRadius={25} className="w-full block">
        <div className="w-full relative min-h-[360px] sm:min-h-[400px] flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-zinc-950/70 border border-white/10 border-t-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-3xl overflow-hidden group">
          {/* Subtle Ambient Radial Glow inside viewport */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/[0.03] via-transparent to-emerald-500/[0.02]" />

          {/* Technical Corner Titanium Brackets */}
          <div className="pointer-events-none absolute top-5 left-5 w-6 h-6 border-t-2 border-l-2 border-emerald-400/60 rounded-tl-sm" />
          <div className="pointer-events-none absolute top-5 right-5 w-6 h-6 border-t-2 border-r-2 border-emerald-400/60 rounded-tr-sm" />
          <div className="pointer-events-none absolute bottom-14 left-5 w-6 h-6 border-b-2 border-l-2 border-emerald-400/60 rounded-bl-sm" />
          <div className="pointer-events-none absolute bottom-14 right-5 w-6 h-6 border-b-2 border-r-2 border-emerald-400/60 rounded-br-sm" />

          {/* Viewfinder Top Telemetry Header */}
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider z-20 pb-3 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-emerald-400 font-bold">
                <DecryptedText text="ECOEDGENET_INT8: ARMED" speed={25} />
              </span>
            </div>
            <div className="flex items-center gap-4 text-zinc-400">
              <span className="hidden sm:inline">
                PRECISION: <span className="text-zinc-200">INT8_PTQ</span>
              </span>
              <span>
                BUDGET: <span className="text-zinc-200">2GB RAM</span>
              </span>
            </div>
          </div>

          {/* Viewfinder Center Content */}
          <div className="my-auto py-6 text-center flex flex-col items-center justify-center relative z-20">
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-4"
                >
                  <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    />
                    <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm sm:text-base font-mono font-bold tracking-tight text-white uppercase">
                      INFERENCING HARDWARE ARCHETYPE...
                    </div>
                    <div className="text-xs font-mono text-emerald-400/90">
                      Extracting material bill & hazard classification (median 11.2ms)
                    </div>
                  </div>
                </motion.div>
              ) : mode === 'camera' ? (
                <motion.div
                  key="camera-mode"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-5 max-w-md mx-auto"
                >
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-900/90 border border-white/10 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/10 group-hover:border-emerald-500/40 transition-colors">
                    <Camera className="w-8 h-8 text-emerald-400" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base sm:text-lg font-bold font-space uppercase tracking-tight text-white">
                      POINT VIEWFINDER AT E-WASTE
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                      Runs 100% on-device inside your browser. No photos or telemetry leave this device.
                    </p>
                  </div>

                  <Magnet padding={80} magnetStrength={3}>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={onStartCamera}
                      className="px-7 py-3.5 rounded-full bg-white text-black font-mono font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-100 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.35)] flex items-center gap-2 select-none"
                    >
                      <Camera className="w-4 h-4" />
                      <span>START LIVE OPTICAL STREAM</span>
                    </motion.button>
                  </Magnet>
                </motion.div>
              ) : mode === 'upload' ? (
                <motion.div
                  key="upload-mode"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full max-w-lg p-8 sm:p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 space-y-4 ${
                    isDragOver
                      ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                      : 'border-white/15 hover:border-emerald-500/50 bg-zinc-900/40 hover:bg-zinc-900/60'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        onUploadFile(e.target.files[0]);
                      }
                    }}
                  />

                  <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-emerald-400 shadow-lg">
                    <Upload className="w-6 h-6" />
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-mono font-bold text-white uppercase tracking-tight">
                      DRAG & DROP HARDWARE PHOTO HERE
                    </div>
                    <div className="text-xs text-zinc-400 font-mono">
                      OR CLICK TO BROWSE LOCAL FILES (PNG, JPG, WEBP)
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="search-mode"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSearchSubmit}
                  className="w-full max-w-lg space-y-4"
                >
                  <div className="relative">
                    <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search hardware model: e.g. iPhone 11, Dell motherboard, 18650 cell..."
                      className="w-full bg-zinc-900/90 border border-white/10 rounded-2xl pl-12 pr-28 py-4 text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-inner"
                    />
                    <button
                      type="submit"
                      disabled={!searchQuery.trim()}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-white text-black font-mono font-bold text-xs uppercase tracking-wider disabled:opacity-40 hover:bg-zinc-200 transition-colors flex items-center gap-1.5 shadow-md"
                    >
                      <span>ANALYZE</span>
                      <CornerDownLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono text-zinc-400">
                    <span className="text-zinc-500">SUGGESTED:</span>
                    {['Li-Ion 18650', 'CRT TV', 'PCB Scrap', 'Laptop Battery'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setSearchQuery(tag);
                          onSearchManual(tag);
                        }}
                        className="px-2.5 py-1 rounded-lg border border-white/10 hover:border-emerald-500/50 bg-white/[0.02] hover:bg-emerald-500/10 text-zinc-300 hover:text-emerald-300 transition-all"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Viewfinder Bottom Status Ribbon */}
          <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between text-[11px] font-mono text-zinc-400 uppercase tracking-wider z-20">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>EDGE INFERENCE // NO CLOUD TELEMETRY</span>
            </div>
            <div className="text-zinc-500">
              EST. LATENCY: <span className="text-emerald-400 font-semibold">&lt;11.2MS</span> ON CORTEX-A53
            </div>
          </div>
        </div>
      </ClickSpark>
    </div>
  );
};
