import React from 'react';
import { cn } from '../utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ className, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-8',
    md: 'w-8 h-10',
    lg: 'w-12 h-16',
    xl: 'w-24 h-32'
  };

  const textClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-xl',
    xl: 'text-4xl'
  };

  return (
    <div className={cn("flex items-center gap-3 group", className)}>
      {/* Emblem Shield */}
      <div className={cn(
        "relative flex items-center justify-center bg-black border-2 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all duration-300 group-hover:border-white/40 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]",
        sizeClasses[size]
      )}
      style={{
        clipPath: 'polygon(50% 100%, 100% 80%, 100% 0, 0 0, 0 80%)'
      }}>
        {/* Inner Shield Line */}
        <div className="absolute inset-1 border border-white/10" style={{
          clipPath: 'polygon(50% 100%, 100% 80%, 100% 0, 0 0, 0 80%)'
        }} />
        
        {/* Broken Heart */}
        <span className={cn(
          "relative z-10 drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300",
          size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-6xl'
        )}>
          💔
        </span>
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <span className={cn(
          "font-black tracking-tighter uppercase text-white",
          textClasses[size]
        )}>
          INABALÁVEL
        </span>
        {size !== 'sm' && (
          <span className="text-[0.65em] font-bold text-white/50 uppercase tracking-[0.2em] -mt-1">
            Crie o Extraordinário
          </span>
        )}
      </div>
    </div>
  );
}
