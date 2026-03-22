import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Phone, Mail, Target } from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { phone: string; objective: string }) => void;
}

export default function RegistrationModal({ isOpen, onClose, onSubmit }: RegistrationModalProps) {
  const [phone, setPhone] = React.useState('');
  const [objective, setObjective] = React.useState('');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 w-full max-w-md relative"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white">
            <X size={20} />
          </button>
          
          <h2 className="text-2xl font-black mb-2">Novo por aqui?</h2>
          <p className="text-white/60 mb-6">Faça seu cadastro agora para personalizar sua experiência.</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Telefone (Opcional)</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-purple-500 outline-none transition-all"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Objetivo de criação (Opcional)</label>
              <div className="relative">
                <Target className="absolute left-4 top-3 text-white/20" size={18} />
                <textarea
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-purple-500 outline-none transition-all h-24"
                  placeholder="Ex: Quero criar um app para..."
                />
              </div>
            </div>
            
            <button
              onClick={() => onSubmit({ phone, objective })}
              className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-all"
            >
              Finalizar Cadastro
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
