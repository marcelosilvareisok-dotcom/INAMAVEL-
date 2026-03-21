import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="text-red-500 fill-red-500" size={20} />
            <span className="text-lg font-black tracking-tighter uppercase text-white">
              Inabalável<span className="text-red-500">💔</span>
            </span>
          </div>
          <p className="text-white/40 text-sm">Crie o extraordinário.</p>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-sm font-black uppercase tracking-widest text-white/40">Contato</h4>
          <p className="text-white/60">(94) 99123-3751</p>
          <a 
            href="https://wa.me/5594991233751" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-green-500 hover:text-green-400 transition-colors"
          >
            WhatsApp
          </a>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-black uppercase tracking-widest text-white/40">Colaboração</h4>
          <a 
            href="https://github.com/seu-usuario/seu-projeto" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block text-white/60 hover:text-white transition-colors"
          >
            GitHub do Projeto
          </a>
          <a 
            href="mailto:contato@seuemail.com" 
            className="block text-white/60 hover:text-white transition-colors"
          >
            Quero Contribuir
          </a>
        </div>
      </div>
    </footer>
  );
}
