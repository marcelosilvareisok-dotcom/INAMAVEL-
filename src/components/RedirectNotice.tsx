import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShieldAlert, ExternalLink } from 'lucide-react';

const NEW_APP_URL = 'https://inamavel-2-0.vercel.app/';

export default function RedirectNotice() {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = NEW_APP_URL;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleManualRedirect = () => {
    window.location.href = NEW_APP_URL;
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505] p-6 font-sans text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative max-w-2xl w-full glass p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl text-center"
      >
        <div className="flex justify-center mb-8">
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-red-500/20 flex items-center justify-center border border-white/10"
          >
            <ShieldAlert size={40} className="text-purple-400" />
          </motion.div>
        </div>

        <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-6 uppercase">
          Comunicado da <span className="text-brand-gradient">Administração</span>
        </h1>

        <div className="space-y-4 text-white/70 text-lg leading-relaxed mb-10">
          <p>
            Informamos que, por decisão estratégica da administração e para garantir a melhor experiência possível, 
            esta versão da plataforma foi descontinuada.
          </p>
          <p>
            Identificamos a necessidade de uma infraestrutura mais robusta e moderna, o que nos levou ao lançamento do 
            <span className="text-white font-bold"> Inabalável 2.0</span>.
          </p>
          <p className="text-sm italic opacity-60">
            Você será redirecionado automaticamente em {countdown} segundos...
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleManualRedirect}
            className="w-full sm:w-auto px-8 py-4 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:scale-105 transition-transform group"
          >
            ACESSAR NOVA VERSÃO
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <a 
            href={NEW_APP_URL}
            className="w-full sm:w-auto px-8 py-4 glass glass-hover rounded-2xl flex items-center justify-center gap-2 text-sm font-bold tracking-widest uppercase"
          >
            LINK DIRETO
            <ExternalLink size={16} />
          </a>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
            Inabalável &copy; 2026 - Evolução Constante
          </p>
        </div>
      </motion.div>
    </div>
  );
}
