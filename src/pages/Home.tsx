import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { db } from '../firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { 
  Sparkles, 
  Zap, 
  Globe, 
  Layout, 
  ArrowRight,
  Code,
  Smartphone,
  MousePointer2,
  ShieldCheck
} from 'lucide-react';
import Logo from '../components/Logo';

export default function Home() {
  const [freeMode, setFreeMode] = React.useState(false);

  React.useEffect(() => {
    const docRef = doc(db, 'settings', 'global');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setFreeMode(docSnap.data().freeMode || false);
      }
    }, (error) => {
      console.error("Error listening to settings:", error);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg text-white selection:bg-white/30 font-sans overflow-x-hidden">
      <div className="atmosphere" />
      
      {/* Hero Section - Recipe 2: Editorial */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden pt-20">
        <div className="max-w-7xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass mb-12"
          >
            <Sparkles size={16} className="text-white/60" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">A Revolução dos Ignorados</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[100vw] overflow-hidden px-2 mb-12"
          >
            <h1 className="text-[16vw] sm:text-[14vw] md:text-[12vw] lg:text-[10vw] font-black tracking-tighter leading-[0.8] uppercase mb-4 text-brand-gradient">
              CRIE O <br />
              <span className="text-luxury lowercase opacity-80">extraordinário</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-white/40 max-w-xl mx-auto mb-16 leading-relaxed font-light px-4"
          >
            Inabalável💔 é a plataforma definitiva para transformar sua visão em poder digital. 
            Crie sites, apps e sistemas complexos com a velocidade do pensamento.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full px-4"
          >
            <Link
              to="/login"
              className="group relative w-full sm:w-auto px-16 py-6 bg-white text-black font-black rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 text-xs uppercase tracking-[0.2em]"
            >
              <span className="relative flex items-center justify-center gap-3">
                Começar Agora <ArrowRight size={18} />
              </span>
            </Link>
            
            {freeMode && (
              <div className="flex items-center justify-center w-full sm:w-auto gap-3 px-8 py-6 glass rounded-full text-white/60 font-black uppercase tracking-widest text-[10px] animate-pulse">
                <Zap size={16} />
                Uso Ilimitado Ativo
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none mb-8">
              PODER SEM <br />
              <span className="text-white/20">PRECEDENTES</span>
            </h2>
            <div className="w-24 h-2 bg-purple-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "IA de Elite",
                desc: "Nossa inteligência artificial não apenas gera texto, ela entende a psicologia do seu público.",
              },
              {
                icon: Layout,
                title: "Design Lovable",
                desc: "Interfaces que as pessoas amam usar. Cada pixel é pensado para converter e encantar.",
              },
              {
                icon: Globe,
                title: "Escala Global",
                desc: "Publique em segundos e escale para milhões de usuários sem se preocupar com infraestrutura.",
              },
              {
                icon: Code,
                title: "Código Limpo",
                desc: "O que a IA gera é seu. Exporte código limpo, otimizado e pronto para produção.",
              },
              {
                icon: Smartphone,
                title: "Mobile First",
                desc: "Seu projeto nasce perfeito em qualquer tela. Do smartphone ao monitor ultra-wide.",
              },
              {
                icon: MousePointer2,
                title: "Editor Intuitivo",
                desc: "A liberdade de um designer com a facilidade de um editor de texto. Sem limites.",
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-12 rounded-[48px] glass glass-hover group relative overflow-hidden"
              >
                <div className="w-12 h-12 flex items-center justify-center mb-8 text-white/60 group-hover:text-white transition-colors">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-black mb-4 uppercase tracking-tighter">{feature.title}</h3>
                <p className="text-white/30 leading-relaxed font-light text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Concept */}
      <section className="py-32 px-4 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-red-500/10 border border-red-500/20 mb-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-red-500">O Manifesto</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-12 leading-[0.85] uppercase">
              TRANSFORME <br />
              <span className="text-red-500 italic">DOR</span> EM <br />
              <span className="text-purple-500 italic">PODER</span>.
            </h2>
            <p className="text-xl text-white/60 mb-12 leading-relaxed font-medium">
              Inspirado na força de quem já foi rejeitado, o Inabalável💔 é mais que uma ferramenta. 
              É o seu arsenal digital para dominar o mercado que um dia te ignorou.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-3 text-xl font-black uppercase tracking-tighter hover:gap-6 transition-all group"
            >
              Conheça nossa história <ArrowRight size={24} className="text-purple-500" />
            </Link>
          </div>
          
          <div className="relative">
            <div className="aspect-square rounded-[60px] bg-gradient-to-br from-purple-600 to-red-600 p-1 rotate-3 hover:rotate-0 transition-transform duration-700">
              <div className="w-full h-full bg-[#050505] rounded-[58px] flex items-center justify-center overflow-hidden relative">
                 {/* Mockup UI */}
                 <div className="absolute inset-12 bg-white/5 rounded-3xl border border-white/10 p-8 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-32 h-4 bg-white/10 rounded-full" />
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/40" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                        <div className="w-3 h-3 rounded-full bg-green-500/40" />
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="w-full h-40 bg-white/5 rounded-2xl border border-white/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-24 bg-white/5 rounded-2xl border border-white/10" />
                        <div className="h-24 bg-white/5 rounded-2xl border border-white/10" />
                      </div>
                    </div>
                 </div>
                 
                 {/* Floating Elements */}
                 <motion.div 
                  animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="absolute top-20 -right-10 p-6 bg-purple-600 rounded-[32px] shadow-2xl"
                 >
                  <Sparkles size={32} className="text-white" />
                 </motion.div>
                 
                 <motion.div 
                  animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                  className="absolute bottom-20 -left-10"
                 >
                  <Logo size="lg" />
                 </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 px-4 border-t border-white/5 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-96 bg-purple-600/5 blur-[120px] -z-10" />
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-16 mb-24">
            <div className="max-w-sm">
              <div className="mb-8">
                <Logo size="lg" />
              </div>
              <p className="text-white/40 font-medium leading-relaxed">
                A plataforma definitiva para os subestimados. 
                Transformamos sua visão extraordinária em realidade digital.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-24">
              <div className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Plataforma</p>
                <ul className="space-y-4 font-bold text-sm">
                  <li><Link to="/dashboard" className="hover:text-purple-500 transition-colors">Dashboard</Link></li>
                  <li><Link to="/new" className="hover:text-purple-500 transition-colors">Novo Projeto</Link></li>
                  <li><Link to="/pricing" className="hover:text-purple-500 transition-colors">Preços</Link></li>
                </ul>
              </div>
              <div className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Comunidade</p>
                <ul className="space-y-4 font-bold text-sm">
                  <li><a href="#" className="hover:text-purple-500 transition-colors">Manifesto</a></li>
                  <li><a href="#" className="hover:text-purple-500 transition-colors">Discord</a></li>
                  <li><a href="#" className="hover:text-purple-500 transition-colors">Twitter</a></li>
                </ul>
              </div>
              <div className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Contato</p>
                <ul className="space-y-4 font-bold text-sm">
                  <li>
                    <a 
                      href="https://wa.me/5594991233751" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:text-green-500 transition-colors flex items-center gap-2"
                    >
                      WhatsApp
                    </a>
                  </li>
                  <li className="text-white/40">(94) 99123-3751</li>
                  <li><a href="mailto:contato@inabalavel.com" className="hover:text-purple-500 transition-colors">Email</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-white/5">
            <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">
              © 2026 Inabalável. Criado por Marcelo da Silva Reis.
            </p>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-white/20">
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
