import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Copy, Check, Smartphone, Sparkles, Zap } from 'lucide-react';

export default function PixDonation() {
  const [copied, setCopied] = React.useState(false);
  const pixKey = "94991233751";

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group"
    >
      {/* Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-red-600 rounded-[40px] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative bg-brand-card border border-white/10 rounded-[40px] p-8 md:p-12 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-red-600/10 blur-[100px] rounded-full animate-pulse delay-700"></div>

        <div className="relative flex flex-col md:flex-row items-center gap-12">
          {/* Left Side: Branding & Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Sparkles size={14} className="text-purple-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Apoie o extraordinário</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-[0.9]">
              💔 INABALAVEL<br />
              <span className="text-brand-gradient">CRIE O EXTRAORDINÁRIO</span>
            </h2>
            
            <p className="text-lg text-white/40 max-w-md mb-8 font-medium">
              Sua doação ajuda a manter este projeto vivo e em constante evolução. 
              Juntos, transformamos o impossível em realidade.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 text-yellow-500 font-bold">
                <Zap size={18} />
                <span>Processamento Instantâneo</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/20"></div>
              <div className="flex items-center gap-2 text-purple-400 font-bold">
                <Heart size={18} />
                <span>Gratidão Eterna</span>
              </div>
            </div>
          </div>

          {/* Right Side: Pix Card */}
          <div className="w-full md:w-auto">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="relative w-full md:w-80 bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 rounded-2xl bg-brand-accent/20 flex items-center justify-center">
                  <Smartphone size={24} className="text-brand-accent" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Chave Pix</p>
                  <p className="text-sm font-bold">Telefone</p>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-xs font-medium text-white/40 mb-2 uppercase tracking-widest">Número</p>
                <div className="text-2xl font-black tracking-tight font-display">
                  94 99123-3751
                </div>
              </div>

              <button
                onClick={handleCopy}
                className="w-full group/btn relative py-4 bg-white text-black font-black rounded-2xl overflow-hidden transition-all active:scale-95"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="copied"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <Check size={20} />
                      COPIADO!
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <Copy size={20} />
                      COPIAR CHAVE
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              <p className="mt-4 text-center text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
                Marcelo da Silva Reis
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
