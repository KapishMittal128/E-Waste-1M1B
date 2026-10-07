import React from 'react';
import { motion } from 'framer-motion';

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
}

export const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 0.05,
  className = '',
  animateBy = 'words',
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: delay, delayChildren: i * 0.05 },
    }),
  };

  const child = {
    hidden: {
      opacity: 0,
      filter: 'blur(10px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring' as const,
        damping: 18,
        stiffness: 140,
      },
    },
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {elements.map((element, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block"
          style={{ marginRight: animateBy === 'words' ? '0.3em' : '0.02em' }}
        >
          {element}
        </motion.span>
      ))}
    </motion.span>
  );
};
