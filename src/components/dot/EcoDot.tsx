import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export type DotState = 'idle' | 'scanning' | 'hazard' | 'success';

interface EcoDotProps {
  state?: DotState;
  size?: number;
  className?: string;
  onTap?: () => void;
  showAccessories?: boolean;
}

export const EcoDot: React.FC<EcoDotProps> = ({
  state = 'idle',
  size = 110,
  className = '',
  onTap,
  showAccessories = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);

  // Mouse tracking springs for the pupils
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 18, stiffness: 260, mass: 0.5 };
  const pupilX = useSpring(mouseX, springConfig);
  const pupilY = useSpring(mouseY, springConfig);

  // Global cursor gaze tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dotCenterX = rect.left + rect.width / 2;
      const dotCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - dotCenterX;
      const deltaY = e.clientY - dotCenterY;
      const dist = Math.hypot(deltaX, deltaY);
      const maxOffset = size * 0.12; // Maximum eye travel boundary

      if (dist === 0) {
        mouseX.set(0);
        mouseY.set(0);
      } else {
        const factor = Math.min(1, dist / 280);
        mouseX.set((deltaX / dist) * maxOffset * factor);
        mouseY.set((deltaY / dist) * maxOffset * factor);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [size, mouseX, mouseY]);

  // Periodic natural blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3800 + Math.random() * 2500);

    return () => clearInterval(blinkInterval);
  }, []);

  const isHazard = state === 'hazard';
  const isScanning = state === 'scanning';
  const isSuccess = state === 'success';

  const handleTap = () => {
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 300);
    if (onTap) onTap();
  };

  // Color schemes based on state
  // Idle: Lush tactile velvet emerald
  // Scanning: Electric cyber cyan
  // Hazard: Urgent safety orange / fiery alert
  // Success: Radiant mint celebration
  const bodyGradient = isHazard
    ? 'linear-gradient(135deg, #fb923c 0%, #ea580c 45%, #9a3412 100%)'
    : isScanning
    ? 'linear-gradient(135deg, #38bdf8 0%, #0284c7 45%, #0f172a 100%)'
    : isSuccess
    ? 'linear-gradient(135deg, #34d399 0%, #059669 45%, #064e3b 100%)'
    : 'linear-gradient(135deg, #10b981 0%, #059669 45%, #064e3b 85%, #022c22 100%)';

  const bodyShadow = isHazard
    ? '0 12px 35px rgba(234, 88, 12, 0.45), inset 0 2px 8px rgba(255, 255, 255, 0.4), inset 0 -6px 12px rgba(0, 0, 0, 0.5)'
    : isScanning
    ? '0 12px 35px rgba(14, 165, 233, 0.4), inset 0 2px 8px rgba(255, 255, 255, 0.4), inset 0 -6px 12px rgba(0, 0, 0, 0.5)'
    : isSuccess
    ? '0 12px 35px rgba(16, 185, 129, 0.5), inset 0 2px 8px rgba(255, 255, 255, 0.45), inset 0 -6px 12px rgba(0, 0, 0, 0.4)'
    : '0 12px 32px rgba(5, 150, 105, 0.35), inset 0 2px 8px rgba(255, 255, 255, 0.35), inset 0 -6px 12px rgba(0, 0, 0, 0.55)';

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex flex-col items-center justify-center select-none cursor-pointer group ${className}`}
      style={{ width: size, height: size + 16 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleTap}
    >
      {/* 1. Tactical Holographic Targeting Ring (Scanning Mode) */}
      {isScanning && (
        <motion.div
          className="absolute -inset-5 rounded-full border border-dashed border-cyan-400/60 pointer-events-none"
          animate={{ rotate: 360, scale: [0.96, 1.04, 0.96] }}
          transition={{
            rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
            scale: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
      )}

      {/* 2. Soft Ambient Contact Drop Shadow (Breathes and scales with body) */}
      <motion.div
        className="absolute bottom-1 w-3/4 h-3 rounded-full bg-black/50 blur-sm pointer-events-none"
        animate={
          isHazard
            ? { scaleX: [0.9, 1.1, 0.9], opacity: [0.4, 0.7, 0.4] }
            : isSuccess
            ? { scaleX: [1, 0.6, 1], opacity: [0.6, 0.2, 0.6] }
            : {
                scaleX: isHovered ? 1.15 : [0.92, 1.05, 0.92],
                opacity: isHovered ? 0.65 : [0.4, 0.55, 0.4],
              }
        }
        transition={{
          duration: isHazard ? 0.4 : 2.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 3. Main Tactile 3D Plush Body */}
      <motion.div
        className="relative rounded-full flex items-center justify-center overflow-visible will-change-transform"
        style={{
          width: size,
          height: size,
          background: bodyGradient,
          boxShadow: bodyShadow,
        }}
        animate={
          isHazard
            ? {
                x: [-3, 3, -3, 3, 0],
                y: [0, -2, 0],
                scaleX: [1, 1.06, 0.96, 1.04, 1],
                scaleY: [1, 0.95, 1.05, 0.97, 1],
              }
            : isSuccess
            ? {
                y: [0, -28, 0],
                rotate: [0, 360],
                scaleX: [1, 0.9, 1.1, 1],
                scaleY: [1, 1.15, 0.9, 1],
              }
            : isScanning
            ? {
                y: [-2, 2, -2],
                scaleX: [0.98, 1.02, 0.98],
                scaleY: [1.02, 0.98, 1.02],
              }
            : isTapped
            ? {
                scaleX: 1.16,
                scaleY: 0.86,
              }
            : isHovered
            ? {
                scaleX: 1.06,
                scaleY: 0.94,
                y: -3,
              }
            : {
                y: [-3, 2, -3],
                scaleX: [0.98, 1.02, 0.98],
                scaleY: [1.02, 0.98, 1.02],
              }
        }
        transition={
          isHazard
            ? { duration: 0.35, repeat: Infinity }
            : isSuccess
            ? { duration: 0.75, times: [0, 0.45, 0.8, 1], ease: 'easeOut' }
            : { duration: 3.0, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        {/* Felt Texture Overlay (Organic grain) */}
        <div
          className="absolute inset-0 rounded-full opacity-20 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)`,
            backgroundSize: '4px 4px',
          }}
        />

        {/* Top-Left Specular Keylight Crescent (Creates tangible volume) */}
        <div className="absolute top-2 left-3 w-2/5 h-1/3 rounded-full bg-gradient-to-br from-white/40 via-white/10 to-transparent pointer-events-none -rotate-12 blur-[0.5px]" />

        {/* Bottom Ambient Occlusion / Rim Glow */}
        <div className="absolute bottom-0 inset-x-0 h-1/3 rounded-b-full bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

        {/* 4. Expressive Eyes & Gaze Tracking */}
        <motion.div
          className="relative z-10 flex items-center justify-center gap-3"
          style={{ x: pupilX, y: pupilY }}
        >
          {/* Left Eye */}
          <div className="relative flex flex-col items-center">
            {/* Alarm Eyebrow (Hazard only) */}
            {isHazard && (
              <motion.div
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: -4, rotate: -18 }}
                className="w-4 h-1 bg-white rounded-full mb-1"
              />
            )}

            <motion.div
              className="relative rounded-full bg-white flex items-center justify-center shadow-md overflow-hidden"
              style={{
                width: size * 0.26,
                height: isBlinking ? 2 : size * 0.28,
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3), 0 2px 5px rgba(0,0,0,0.2)',
              }}
              animate={{
                scaleY: isBlinking ? 0.05 : 1,
              }}
              transition={{ duration: 0.1 }}
            >
              {!isBlinking && (
                <div
                  className="relative rounded-full bg-zinc-950 flex items-center justify-center"
                  style={{
                    width: isHazard ? size * 0.16 : size * 0.14,
                    height: isHazard ? size * 0.16 : size * 0.14,
                  }}
                >
                  {/* Glossy catchlight glints */}
                  <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-white" />
                  <div className="absolute bottom-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-white/70" />
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Eye */}
          <div className="relative flex flex-col items-center">
            {/* Alarm Eyebrow (Hazard only) */}
            {isHazard && (
              <motion.div
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: -4, rotate: 18 }}
                className="w-4 h-1 bg-white rounded-full mb-1"
              />
            )}

            <motion.div
              className="relative rounded-full bg-white flex items-center justify-center shadow-md overflow-hidden"
              style={{
                width: size * 0.26,
                height: isBlinking ? 2 : size * 0.28,
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3), 0 2px 5px rgba(0,0,0,0.2)',
              }}
              animate={{
                scaleY: isBlinking ? 0.05 : 1,
              }}
              transition={{ duration: 0.1 }}
            >
              {!isBlinking && (
                <div
                  className="relative rounded-full bg-zinc-950 flex items-center justify-center"
                  style={{
                    width: isHazard ? size * 0.16 : size * 0.14,
                    height: isHazard ? size * 0.16 : size * 0.14,
                  }}
                >
                  {/* Glossy catchlight glints */}
                  <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-white" />
                  <div className="absolute bottom-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-white/70" />
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* 5. Expressive Mouth */}
        <div className="absolute bottom-3 flex items-center justify-center pointer-events-none">
          {isHazard ? (
            // Alarmed 'O' Mouth
            <div className="w-2.5 h-3 rounded-full bg-zinc-900 border border-white/20 animate-pulse" />
          ) : isSuccess ? (
            // Joyful Big Smile
            <div className="w-5 h-2.5 border-b-2 border-white rounded-b-full" />
          ) : isHovered ? (
            // Curious Little Smile
            <div className="w-3.5 h-1.5 border-b-2 border-white/80 rounded-b-full" />
          ) : (
            // Calm neutral arc
            <div className="w-2 h-0.5 bg-black/40 rounded-full" />
          )}
        </div>

        {/* 6. Mini Technical Monocle Loupe Accessory (Inspired by OpenAI Dots film) */}
        {showAccessories && !isHazard && (
          <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full border border-amber-300/70 bg-cyan-400/20 backdrop-blur-[1px] pointer-events-none shadow-sm flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full border border-amber-300/40" />
          </div>
        )}
      </motion.div>
    </div>
  );
};
