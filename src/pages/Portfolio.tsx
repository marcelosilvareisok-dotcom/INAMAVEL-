import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Github, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronDown, 
  ExternalLink,
  Code2,
  Bot,
  Zap,
  Heart,
  X,
  ArrowRight
} from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Project } from '../types';
import { handleFirestoreError, OperationType } from '../utils/firestore-errors';

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const projectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch public projects or user's projects
    const q = query(
      collection(db, 'projects'),
      where('isPublic', '==', true),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(projectsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'projects');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const scrollToProjects = () => {
    projectsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full -z-10" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: Math.random() * 1000 }}
              animate={{ 
                opacity: [0, 1, 0],
                y: [Math.random() * 1000, Math.random() * 1000 - 200]
              }}
              transition={{ 
                duration: Math.random() * 5 + 5, 
                repeat: Infinity,
                delay: Math.random() * 5
              }}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{ left: `${Math.random() * 100}%` }}
            />
          ))}
        </div>

        <div className="max-w-4xl w-full space-y-12 relative">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-white/60 tracking-wider uppercase">
              Desenvolvedor & Automação com IA
            </span>
          </motion.div>

          {/* Name & Title */}
          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85]"
            >
              Carlos<br />
              <span className="text-white/40">Eduardo</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-white/50 max-w-2xl leading-relaxed font-light"
            >
              Especialista em <span className="text-white font-medium">Automação, Agentes de IA e Desenvolvimento</span> com experiência em otimização de processos, integrações via API e soluções No-code/Low-code.
            </motion.p>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-12 md:gap-20"
          >
            <div className="space-y-1">
              <p className="text-sm text-white/30 uppercase tracking-widest font-bold">Projetos</p>
              <p className="text-5xl font-black tracking-tighter">{projects.length > 0 ? `${projects.length}+` : '2+'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-white/30 uppercase tracking-widest font-bold">Automações</p>
              <p className="text-5xl font-black tracking-tighter">10+</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-white/30 uppercase tracking-widest font-bold">Agentes IA</p>
              <p className="text-5xl font-black tracking-tighter">5+</p>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <button 
              onClick={scrollToProjects}
              className="group px-8 py-4 bg-white text-black font-black rounded-full flex items-center gap-3 hover:scale-105 transition-all active:scale-95"
            >
              <ChevronDown size={20} className="group-hover:translate-y-1 transition-transform" />
              Ver Projetos
            </button>
            <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black rounded-full flex items-center gap-3 hover:bg-white/10 transition-all active:scale-95">
              <Github size={20} />
              GitHub
            </button>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="pt-12 space-y-4 border-t border-white/5"
          >
            <div className="flex items-center gap-4 text-white/40 hover:text-white transition-colors cursor-pointer">
              <Phone size={18} />
              <span className="font-medium">+55 (61) 99638-3234</span>
            </div>
            <div className="flex items-center gap-4 text-white/40 hover:text-white transition-colors cursor-pointer">
              <Mail size={18} />
              <span className="font-medium">carloseduardopereira2254@gmail.com</span>
            </div>
            <div className="flex items-center gap-4 text-white/40 hover:text-white transition-colors cursor-pointer">
              <MapPin size={18} />
              <span className="font-medium">Brasília - DF</span>
            </div>
          </motion.div>
        </div>

        {/* Animated Projects Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <button 
            onClick={() => setShowProjectsModal(true)}
            className="relative group p-1 rounded-full overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.3)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-red-500 to-purple-600 animate-spin-slow" />
            <div className="relative px-6 py-3 bg-[#050505] rounded-full flex items-center gap-3 group-hover:bg-transparent transition-colors">
              <Heart size={18} className="text-red-500 fill-red-500 animate-pulse" />
              <span className="font-black text-xs uppercase tracking-widest">Projetos Inabaláveis ❤️🩹</span>
            </div>
          </button>
        </motion.div>
      </section>

      {/* Projects Section */}
      <section ref={projectsRef} className="py-32 px-6 bg-[#080808]">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="space-y-4">
            <h2 className="text-5xl font-black tracking-tighter uppercase">Trabalhos <span className="text-white/30">Recentes</span></h2>
            <div className="w-20 h-1 bg-purple-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.length > 0 ? (
              projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-6 hover:bg-white/[0.08] transition-all"
                >
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center">
                    {project.type === 'app' ? <Bot className="text-blue-500" /> : <Zap className="text-yellow-500" />}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{project.name}</h3>
                    <p className="text-white/50 leading-relaxed line-clamp-2">{project.objective}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white/40">
                      {project.type}
                    </span>
                  </div>
                  <button className="flex items-center gap-2 text-sm font-bold text-purple-400 group-hover:text-purple-300 transition-colors">
                    Ver Detalhes <ExternalLink size={14} />
                  </button>
                </motion.div>
              ))
            ) : (
              // Fallback Placeholders
              <>
                {[
                  {
                    title: "Inabalável Platform",
                    desc: "Plataforma de automação e desenvolvimento com IA.",
                    tags: ["React", "Firebase", "Gemini AI"],
                    icon: <Zap className="text-yellow-500" />
                  },
                  {
                    title: "AI Agent Hub",
                    desc: "Central de agentes inteligentes para automação de processos.",
                    tags: ["Node.js", "Python", "OpenAI"],
                    icon: <Bot className="text-blue-500" />
                  }
                ].map((project, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -10 }}
                    className="group p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-6 hover:bg-white/[0.08] transition-all"
                  >
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center">
                      {project.icon}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">{project.title}</h3>
                      <p className="text-white/50 leading-relaxed">{project.desc}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white/40">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button className="flex items-center gap-2 text-sm font-bold text-purple-400 group-hover:text-purple-300 transition-colors">
                      Ver Detalhes <ExternalLink size={14} />
                    </button>
                  </motion.div>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Projects Modal */}
      <AnimatePresence>
        {showProjectsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl max-h-[90vh] bg-[#0a0a0a] border border-white/10 rounded-[40px] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(168,85,247,0.1)]"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-500">
                    <Heart size={24} className="fill-purple-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tighter uppercase">Projetos Inabaláveis</h2>
                    <p className="text-sm text-white/40">Trabalhos embutidos e destaques</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowProjectsModal(false)}
                  className="p-3 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <div 
                        key={project.id}
                        className="group p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/[0.08] transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                            {project.type === 'app' ? <Bot size={20} className="text-blue-500" /> : <Zap size={20} className="text-yellow-500" />}
                          </div>
                          <ArrowRight size={18} className="text-white/20 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                        <p className="text-sm text-white/40 line-clamp-2 mb-4">{project.objective}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400 px-2 py-1 bg-purple-400/10 rounded-md">
                            {project.type}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-20 text-center space-y-4">
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/10">
                        <Code2 size={40} />
                      </div>
                      <p className="text-white/40 font-medium tracking-widest uppercase text-xs">Nenhum projeto público encontrado</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 bg-white/5 border-t border-white/5 flex items-center justify-center">
                <button 
                  onClick={() => window.location.href = '/new'}
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full transition-all flex items-center gap-2"
                >
                  <PlusCircle size={18} />
                  Adicionar Novo Trabalho
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 text-center">
        <p className="text-white/20 text-sm font-medium uppercase tracking-[0.3em]">
          Feito com <Heart size={12} className="inline text-red-500 fill-red-500 mx-1" /> pelo Inabalável
        </p>
      </footer>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}

// Missing import PlusCircle
import { PlusCircle } from 'lucide-react';
