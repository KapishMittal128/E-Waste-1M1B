import React, { useState, useEffect, useRef } from 'react';

interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 60,
  disabled = false,
  magnetStrength = 2.5,
  activeTransition = 'transform 0.15s ease-out',
  inactiveTransition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
  className = '',
  onClick,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const magnetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) {
      setPosition({ x: 0, y: 0 });
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!magnetRef.current) return;
      const { left, top, width, height } = magnetRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.hypot(distX, distY);

      if (distance < Math.max(width, height) / 2 + padding) {
        setIsHovered(true);
        setPosition({
          x: distX / magnetStrength,
          y: distY / magnetStrength,
        });
      } else {
        setIsHovered(false);
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [padding, disabled, magnetStrength]);

  return (
    <div
      ref={magnetRef}
      className={`inline-block ${className}`}
      onClick={onClick}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: isHovered ? activeTransition : inactiveTransition,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};
