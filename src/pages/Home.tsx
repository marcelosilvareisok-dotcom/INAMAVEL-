import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Zap, 
  Globe, 
  Layout, 
  Heart, 
  ArrowRight,
  Code,
  Smartphone
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full animate-pulse delay-700" />
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <Sparkles size={14} className="text-purple-400" />
            <span className="text-sm font-medium text-white/80">Ideias ignoradas, agora dominam.</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-[120px] font-black tracking-tighter mb-8 leading-[0.85] uppercase"
          >
            CRIE O <span className="text-brand-gradient">EXTRAORDINÁRIO</span> EM SEGUNDOS.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/40 max-w-3xl mx-auto mb-12 leading-tight font-medium"
          >
            Inabalável💔 é o construtor de sites com IA para quem foi ignorado. 
            Transforme sua visão em realidade sem escrever uma única linha de código.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/login"
              className="group relative px-8 py-4 bg-white text-black font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-red-500/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              <span className="relative flex items-center gap-2">
                Começar Agora <ArrowRight size={18} />
              </span>
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 bg-white/5 text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
            >
              Ver Manifesto
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Geração Instantânea",
                desc: "Responda 3 perguntas e deixe nossa IA criar a estrutura, o design e o texto para você.",
                color: "text-yellow-400"
              },
              {
                icon: Layout,
                title: "Editor Visual",
                desc: "Personalize cada detalhe com nosso editor drag-and-drop intuitivo e poderoso.",
                color: "text-purple-400"
              },
              {
                icon: Globe,
                title: "Publicação em 1 Clique",
                desc: "Coloque seu projeto no ar instantaneamente com um link personalizado e seguro.",
                color: "text-blue-400"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
              >
                <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon size={24} className={feature.color} />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Concept */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">
              DO <span className="text-red-500 italic">NINGUÉM LIGA</span> AO <span className="text-purple-500 italic">TODO MUNDO USA</span>.
            </h2>
            <p className="text-xl text-white/60 mb-8 leading-relaxed">
              Inspirado na força de quem já foi rejeitado, criamos uma ferramenta para os subestimados. 
              Pessoas comuns agora podem criar coisas extraordinárias.
            </p>
            <div className="space-y-4">
              {[
                { icon: Smartphone, text: "Totalmente Responsivo" },
                { icon: Code, text: "Exportação de Código Limpo" },
                { icon: Heart, text: "Feito com ❤️ por Marcelo Reis" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white/80">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <item.icon size={14} className="text-purple-400" />
                  </div>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-purple-600 to-red-600 p-1">
              <div className="w-full h-full bg-[#050505] rounded-[calc(1.5rem-4px)] flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full">
                   {/* Mockup UI */}
                   <div className="absolute top-8 left-8 right-8 bottom-8 bg-white/5 rounded-xl border border-white/10 p-6">
                      <div className="w-full h-4 bg-white/10 rounded-full mb-6" />
                      <div className="flex gap-4 mb-8">
                        <div className="flex-1 h-32 bg-white/5 rounded-xl border border-white/10" />
                        <div className="flex-1 h-32 bg-white/5 rounded-xl border border-white/10" />
                      </div>
                      <div className="space-y-3">
                        <div className="w-3/4 h-3 bg-white/10 rounded-full" />
                        <div className="w-1/2 h-3 bg-white/10 rounded-full" />
                        <div className="w-2/3 h-3 bg-white/10 rounded-full" />
                      </div>
                   </div>
                   {/* Floating Elements */}
                   <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute top-1/4 -right-4 p-4 bg-purple-500 rounded-2xl shadow-2xl shadow-purple-500/20"
                   >
                    <Sparkles size={24} className="text-white" />
                   </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <Heart size={20} className="text-red-500 fill-red-500" />
            <span className="font-black tracking-tighter uppercase text-xl">Inabalável💔</span>
          </div>
          <p className="text-white/40 text-sm">
            © 2026 Inabalável. Criado por Marcelo da Silva Reis.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/40 hover:text-white transition-colors">Twitter</a>
            <a href="#" className="text-white/40 hover:text-white transition-colors">GitHub</a>
            <a href="#" className="text-white/40 hover:text-white transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
