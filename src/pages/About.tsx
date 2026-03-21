import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Zap, Globe, Smartphone, ArrowRight, User, Linkedin, Twitter, Github, Heart } from 'lucide-react';
import Logo from '../components/Logo';

export default function About() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto py-20 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8"
        >
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">O Manifesto Inabalável</span>
        </motion.div>
        <div className="mb-8">
          <Logo size="xl" />
        </div>
        <p className="text-xl md:text-2xl text-white/40 font-medium leading-tight max-w-2xl mx-auto">
          Nascido da rejeição, forjado na persistência. 
          Este é o lugar onde os ignorados criam o extraordinário.
        </p>
      </section>

      {/* CEO Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center bg-white/5 rounded-[60px] p-8 md:p-16 border border-white/10">
        <div className="relative">
          <div className="aspect-square rounded-[40px] overflow-hidden border-2 border-purple-500/30 p-2">
            <img 
              src="https://i.imgur.com/e7EnlHN.jpg" 
              alt="Marcelo da Silva Reis" 
              className="w-full h-full object-cover rounded-[32px] bg-gradient-to-br from-purple-600 to-red-600"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 p-6 bg-white text-black rounded-3xl shadow-2xl shadow-purple-500/20">
            <p className="text-xs font-black uppercase tracking-widest mb-1">CEO & Fundador</p>
            <p className="text-xl font-black">Marcelo Reis</p>
          </div>
        </div>
        <div className="space-y-8">
          <h2 className="text-4xl font-black tracking-tighter">"NINGUÉM LIGA ATÉ QUE TODO MUNDO USE."</h2>
          <p className="text-lg text-white/60 leading-relaxed">
            Olá, eu sou Marcelo da Silva Reis. Criei o Inabalável porque cansei de ver ideias incríveis morrendo 
            na praia por falta de recursos técnicos. 
            Minha missão é democratizar a criação extraordinária.
          </p>
          <div className="flex gap-4">
            {[
              { icon: Linkedin, label: "LinkedIn", url: "https://linkedin.com/in/marcelodasilvareis30" },
              { icon: Twitter, label: "Twitter", url: "https://twitter.com/marcelodasilvareis30" },
              { icon: Github, label: "GitHub", url: "https://github.com/marcelodasilvareis30" }
            ].map((social, i) => (
              <a 
                key={i}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all text-white/40 hover:text-white"
                title={social.label}
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Disruptivo",
            desc: "Quebramos as regras do design tradicional para criar algo que realmente chama a atenção.",
            icon: Zap
          },
          {
            title: "Emocional",
            desc: "Cada pixel é pensado para transmitir a paixão e a dor de quem está criando.",
            icon: Heart
          },
          {
            title: "Tecnológico",
            desc: "Usamos o que há de mais moderno em IA para que você não precise se preocupar com o código.",
            icon: Sparkles
          }
        ].map((value, i) => (
          <div key={i} className="p-10 rounded-[40px] bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-8">
              <value.icon size={28} className="text-purple-400" />
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">{value.title}</h3>
            <p className="text-white/60 leading-relaxed">{value.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="text-center py-20">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8">PRONTO PARA SER <span className="text-red-500">INABALÁVEL</span>?</h2>
        <button className="px-12 py-6 bg-white text-black font-black rounded-3xl hover:scale-105 transition-all shadow-2xl shadow-white/5 flex items-center gap-3 mx-auto group">
          Começar Agora <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
        </button>
      </section>
    </div>
  );
}
