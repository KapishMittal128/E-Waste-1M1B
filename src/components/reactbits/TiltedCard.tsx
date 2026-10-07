import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const springValues = {
  damping: 25,
  stiffness: 120,
  mass: 0.8,
};

interface TiltedCardProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  rotateAmplitude?: number;
  scaleOnHover?: number;
  onClick?: () => void;
  spotlight?: boolean;
}

export const TiltedCard: React.FC<TiltedCardProps> = ({
  children,
  className = '',
  containerClassName = '',
  rotateAmplitude = 12,
  scaleOnHover = 1.025,
  onClick,
  spotlight = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const glareOpacity = useSpring(0, { damping: 20, stiffness: 150 });

  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rX = ((mouseY / rect.height) - 0.5) * -rotateAmplitude * 2;
    const rY = ((mouseX / rect.width) - 0.5) * rotateAmplitude * 2;

    rotateX.set(rX);
    rotateY.set(rY);

    setGlarePosition({
      x: (mouseX / rect.width) * 100,
      y: (mouseY / rect.height) * 100,
    });
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
    glareOpacity.set(1);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    glareOpacity.set(0);
  }

  return (
    <div
      className={`[perspective:900px] ${containerClassName}`}
      onClick={onClick}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
        }}
        className={`relative transition-shadow duration-300 will-change-transform ${className}`}
      >
        {children}

        {spotlight && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden"
            style={{ opacity: glareOpacity }}
          >
            <div
              className="absolute inset-0 transition-opacity duration-300"
              style={{
                background: `radial-gradient(350px circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.08), transparent 70%)`,
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
