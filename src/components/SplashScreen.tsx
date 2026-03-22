import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Total animation time: 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 400); // Wait for exit animation to finish before unmounting
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden"
        >
          {/* Ambient glow */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.15, scale: 1.5 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute w-[600px] h-[600px] bg-red-600/30 rounded-full blur-[120px] pointer-events-none"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.85, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ 
              duration: 1, 
              ease: [0.16, 1, 0.3, 1], // Custom cinematic easing
              delay: 0.1 
            }}
            className="relative flex items-center gap-4"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-[0.2em] uppercase">
              Inabalável
            </h1>
            <motion.span 
              initial={{ opacity: 0, scale: 0, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.8, 
                ease: "easeOut",
                delay: 0.6,
                type: "spring",
                bounce: 0.4
              }}
              className="text-4xl md:text-6xl lg:text-7xl"
            >
              💔
            </motion.span>
          </motion.div>

          {/* Subtle cinematic letterbox effect */}
          <motion.div 
            initial={{ height: '20vh' }}
            animate={{ height: '0vh' }}
            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
            className="absolute top-0 left-0 right-0 bg-black z-10"
          />
          <motion.div 
            initial={{ height: '20vh' }}
            animate={{ height: '0vh' }}
            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
            className="absolute bottom-0 left-0 right-0 bg-black z-10"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
