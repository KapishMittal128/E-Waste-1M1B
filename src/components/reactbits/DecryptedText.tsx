import React, { useEffect, useState, useRef } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  characters?: string;
  className?: string;
  encryptedClassName?: string;
  animateOn?: 'view' | 'hover';
}

const DEFAULT_CHARS = '0123456789ABCDEF!@#$%&*<>/[]{}';

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 40,
  maxIterations = 8,
  characters = DEFAULT_CHARS,
  className = '',
  encryptedClassName = 'text-emerald-400/80 font-mono',
  animateOn = 'view',
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isDecrypted, setIsDecrypted] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasTriggeredRef = useRef(false);

  const startDecryption = () => {
    let iteration = 0;
    const len = text.length;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ' || char === '\n') return char;
            if (index < (iteration / maxIterations) * len) {
              return text[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('')
      );

      iteration += 1;

      if (iteration > maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        setIsDecrypted(true);
      }
    }, speed);
  };

  useEffect(() => {
    if (animateOn === 'view') {
      const observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && !hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            startDecryption();
          }
        },
        { threshold: 0.2 }
      );

      if (elementRef.current) observer.observe(elementRef.current);
      return () => observer.disconnect();
    }
  }, [text, animateOn]);

  return (
    <span
      ref={elementRef}
      onMouseEnter={() => {
        if (animateOn === 'hover') startDecryption();
      }}
      className={`${className} ${!isDecrypted ? encryptedClassName : ''}`}
    >
      {displayText}
    </span>
  );
};
