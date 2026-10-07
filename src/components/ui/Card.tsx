import React, { useRef, useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  spotlight?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, spotlight = true, children, ...props }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const resolvedRef = (ref as React.RefObject<HTMLDivElement>) || internalRef;
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!resolvedRef.current || !spotlight) return;
      const rect = resolvedRef.current.getBoundingClientRect();
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
      <div
        ref={resolvedRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => spotlight && setOpacity(1)}
        onMouseLeave={() => spotlight && setOpacity(0)}
        className={twMerge(
          clsx(
            'relative rounded-2xl bg-zinc-950/70 backdrop-blur-2xl border border-white/10 border-t-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300',
            className
          )
        )}
        {...props}
      >
        {spotlight && (
          <div
            className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
            style={{
              opacity,
              background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 80%)`,
            }}
          />
        )}
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={twMerge(clsx('flex flex-col space-y-1.5 p-6', className))}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h3
    className={twMerge(
      clsx('text-lg font-bold tracking-tight text-white font-space', className)
    )}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => (
  <p
    className={twMerge(clsx('text-xs text-zinc-400 font-sans', className))}
    {...props}
  >
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={twMerge(clsx('p-6 pt-0', className))} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={twMerge(
      clsx('flex items-center p-6 pt-0 border-t border-white/5', className)
    )}
    {...props}
  >
    {children}
  </div>
);
