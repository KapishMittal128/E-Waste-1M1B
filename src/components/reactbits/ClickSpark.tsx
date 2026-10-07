import React, { useRef, useEffect } from 'react';

interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  children: React.ReactNode;
  className?: string;
}

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

export const ClickSpark: React.FC<ClickSparkProps> = ({
  sparkColor = '#10B981',
  sparkSize = 8,
  sparkRadius = 22,
  sparkCount = 8,
  duration = 380,
  children,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const draw = (currentTime: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter(spark => {
        const elapsed = currentTime - spark.startTime;
        if (elapsed >= duration) return false;

        const progress = elapsed / duration;
        const ease = 1 - Math.pow(1 - progress, 3);
        const distance = ease * sparkRadius;
        const lineLen = (1 - progress) * sparkSize;

        const x1 = spark.x + Math.cos(spark.angle) * distance;
        const y1 = spark.y + Math.sin(spark.angle) * distance;
        const x2 = spark.x + Math.cos(spark.angle) * (distance + lineLen);
        const y2 = spark.y + Math.sin(spark.angle) * (distance + lineLen);

        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2 * (1 - progress);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [duration, sparkColor, sparkRadius, sparkSize]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const now = performance.now();
    for (let i = 0; i < sparkCount; i++) {
      sparksRef.current.push({
        x,
        y,
        angle: (i / sparkCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.2,
        startTime: now,
      });
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`relative inline-block ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-30 w-full h-full"
      />
      {children}
    </div>
  );
};
