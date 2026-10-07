import React, { useEffect, useRef } from 'react';

interface AuroraProps {
  colorStops?: string[];
  amplitude?: number;
  speed?: number;
  blend?: number;
  className?: string;
}

export const Aurora: React.FC<AuroraProps> = ({
  colorStops = ['#052e16', '#064e3b', '#0f172a', '#022c22'],
  amplitude = 1.0,
  speed = 0.5,
  blend = 0.65,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    let time = 0;

    const render = () => {
      time += 0.003 * speed;
      ctx.clearRect(0, 0, width, height);

      // Deep atmospheric base
      ctx.fillStyle = '#08090C';
      ctx.fillRect(0, 0, width, height);

      // Aurora Wave 1 - Deep Emerald / Forest
      const grad1 = ctx.createRadialGradient(
        width * (0.3 + 0.15 * Math.sin(time * 0.8)),
        height * (0.2 + 0.1 * Math.cos(time * 0.6)),
        0,
        width * 0.35,
        height * 0.35,
        Math.max(width, height) * 0.65
      );
      grad1.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
      grad1.addColorStop(0.5, 'rgba(5, 46, 22, 0.08)');
      grad1.addColorStop(1, 'transparent');

      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Aurora Wave 2 - Cyan / Teal Edge Stream
      const grad2 = ctx.createRadialGradient(
        width * (0.7 + 0.2 * Math.cos(time * 0.7)),
        height * (0.4 + 0.15 * Math.sin(time * 0.9)),
        10,
        width * 0.65,
        height * 0.45,
        Math.max(width, height) * 0.6
      );
      grad2.addColorStop(0, 'rgba(6, 182, 212, 0.09)');
      grad2.addColorStop(0.4, 'rgba(15, 23, 42, 0.06)');
      grad2.addColorStop(1, 'transparent');

      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Aurora Wave 3 - Warm Amber Solar Flare (Subtle)
      const grad3 = ctx.createRadialGradient(
        width * (0.5 + 0.25 * Math.sin(time * 0.5)),
        height * (0.65 + 0.1 * Math.cos(time * 0.75)),
        0,
        width * 0.5,
        height * 0.65,
        Math.max(width, height) * 0.5
      );
      grad3.addColorStop(0, 'rgba(245, 158, 11, 0.04)');
      grad3.addColorStop(0.6, 'transparent');

      ctx.fillStyle = grad3;
      ctx.fillRect(0, 0, width, height);

      // Subtle horizontal scanning lines / vignette
      const vignette = ctx.createLinearGradient(0, 0, 0, height);
      vignette.addColorStop(0, 'rgba(8, 9, 12, 0.6)');
      vignette.addColorStop(0.5, 'transparent');
      vignette.addColorStop(1, 'rgba(8, 9, 12, 0.85)');

      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [amplitude, speed, blend, colorStops]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none -z-10 w-full h-full ${className}`}
      style={{ opacity: 0.9 }}
    />
  );
};
