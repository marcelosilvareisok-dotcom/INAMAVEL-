import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, Sparkles, X } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExplore: () => void;
}

export default function WelcomeModal({ isOpen, onClose, onExplore }: WelcomeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-500/20 blur-[100px] -z-10" />
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Rocket className="text-white" size={32} />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white tracking-tight">
                  Bem-vindo ao <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">INABALÁVEL💔</span> 🚀
                </h2>
                <p className="text-white/60 leading-relaxed">
                  Você acaba de entrar na plataforma mais poderosa para criar, evoluir e dominar com inteligência artificial.
                  Prepare-se para transformar suas ideias em realidade. 💡🔥
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  Começar agora
                </button>
                <button
                  onClick={onExplore}
                  className="px-6 py-3 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Sparkles size={18} className="text-purple-400" />
                  Explorar recursos
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
