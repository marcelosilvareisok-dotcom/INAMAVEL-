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
  Heart, 
  ArrowRight,
  Code,
  Smartphone,
  MousePointer2,
  ShieldCheck
} from 'lucide-react';

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
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 font-sans overflow-x-hidden">
      {/* Hero Section - Recipe 2: Editorial */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden pt-20">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full animate-pulse delay-700" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 mb-12 backdrop-blur-md"
          >
            <Sparkles size={16} className="text-purple-400" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-white/60">A Revolução dos Ignorados</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <h1 className="text-[12vw] md:text-[14vw] font-black tracking-tighter leading-[0.82] uppercase mb-8">
              CRIE O <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-red-500 to-purple-500 bg-[length:200%_auto] animate-gradient">EXTRAORDINÁRIO</span>
            </h1>
            
            {/* Floating Badges */}
            <motion.div 
              animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -top-10 -right-10 hidden lg:block p-6 bg-white text-black rounded-[32px] shadow-2xl rotate-12"
            >
              <p className="text-[10px] font-black uppercase tracking-widest mb-1">Status</p>
              <p className="text-2xl font-black italic">SEM LIMITES</p>
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-white/40 max-w-2xl mx-auto mb-16 leading-tight font-medium"
          >
            Inabalável💔 é a plataforma definitiva para transformar sua dor em poder digital. 
            Crie sites, apps e sistemas complexos com a velocidade do pensamento.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              to="/login"
              className="group relative px-12 py-6 bg-white text-black font-black rounded-[32px] overflow-hidden transition-all hover:scale-105 active:scale-95 text-lg uppercase tracking-tighter"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-red-500/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              <span className="relative flex items-center gap-3">
                Começar Agora <ArrowRight size={24} />
              </span>
            </Link>
            
            {freeMode && (
              <div className="flex items-center gap-3 px-8 py-6 bg-purple-500/10 border border-purple-500/20 rounded-[32px] text-purple-400 font-black uppercase tracking-widest text-xs animate-pulse">
                <Zap size={20} />
                Uso Ilimitado Ativo
              </div>
            )}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20"
        >
          <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent mx-auto" />
        </motion.div>
      </section>

      {/* Stats Section - Recipe 5: Brutalist */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3">
          {[
            { label: "Projetos Criados", value: "12.5k+", icon: Layout },
            { label: "Tempo de Geração", value: "3.2s", icon: Zap },
            { label: "Taxa de Sucesso", value: "99.9%", icon: ShieldCheck },
          ].map((stat, i) => (
            <div key={i} className="p-12 border-r border-white/5 last:border-r-0 flex flex-col items-center text-center group hover:bg-white/5 transition-colors">
              <stat.icon size={32} className="text-purple-500 mb-6 group-hover:scale-110 transition-transform" />
              <p className="text-6xl font-black tracking-tighter mb-2">{stat.value}</p>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-white/40">{stat.label}</p>
            </div>
          ))}
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
                color: "bg-yellow-500/20 text-yellow-500"
              },
              {
                icon: Layout,
                title: "Design Lovable",
                desc: "Interfaces que as pessoas amam usar. Cada pixel é pensado para converter e encantar.",
                color: "bg-purple-500/20 text-purple-500"
              },
              {
                icon: Globe,
                title: "Escala Global",
                desc: "Publique em segundos e escale para milhões de usuários sem se preocupar com infraestrutura.",
                color: "bg-blue-500/20 text-blue-500"
              },
              {
                icon: Code,
                title: "Código Limpo",
                desc: "O que a IA gera é seu. Exporte código limpo, otimizado e pronto para produção.",
                color: "bg-green-500/20 text-green-500"
              },
              {
                icon: Smartphone,
                title: "Mobile First",
                desc: "Seu projeto nasce perfeito em qualquer tela. Do smartphone ao monitor ultra-wide.",
                color: "bg-red-500/20 text-red-500"
              },
              {
                icon: MousePointer2,
                title: "Editor Intuitivo",
                desc: "A liberdade de um designer com a facilidade de um editor de texto. Sem limites.",
                color: "bg-orange-500/20 text-orange-500"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[40px] bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all group relative overflow-hidden"
              >
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ${feature.color}`}>
                  <feature.icon size={32} />
                </div>
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">{feature.title}</h3>
                <p className="text-white/40 leading-relaxed font-medium">{feature.desc}</p>
                
                {/* Decorative Element */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />
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
              <Heart size={12} className="text-red-500 fill-red-500" />
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
                  className="absolute bottom-20 -left-10 p-6 bg-red-600 rounded-[32px] shadow-2xl"
                 >
                  <Heart size={32} className="text-white fill-white" />
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
              <div className="flex items-center gap-3 mb-8">
                <Heart size={32} className="text-red-500 fill-red-500" />
                <span className="font-black tracking-tighter uppercase text-3xl">Inabalável💔</span>
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
