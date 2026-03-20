import React from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Project } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';
import { 
  Plus, 
  Search, 
  ExternalLink, 
  MoreVertical, 
  Clock, 
  Globe, 
  Layout as LayoutIcon, 
  Smartphone,
  Zap,
  Trash2,
  Edit3,
  Heart
} from 'lucide-react';

export default function Dashboard() {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'projects'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(projectsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">MEUS PROJETOS</h1>
          <p className="text-white/60">Gerencie suas criações extraordinárias.</p>
        </div>
        <Link
          to="/new"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-all shadow-lg shadow-white/5 active:scale-95"
        >
          <Plus size={20} />
          Novo Projeto
        </Link>
      </div>

      {/* Stats / Quick Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Projetos Ativos", value: projects.length, icon: LayoutIcon, color: "text-purple-400" },
          { label: "Publicados", value: projects.filter(p => p.status === 'published').length, icon: Globe, color: "text-blue-400" },
          { label: "Rascunhos", value: projects.filter(p => p.status === 'draft').length, icon: Clock, color: "text-yellow-400" },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <stat.icon size={20} className={stat.color} />
              <span className="text-2xl font-black">{stat.value}</span>
            </div>
            <p className="text-sm font-medium text-white/40 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
        <input
          type="text"
          placeholder="Pesquisar projetos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
        />
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-white/40 font-medium">Carregando seus projetos...</p>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all"
              >
                {/* Preview Area */}
                <div className="aspect-video bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-red-500/5" />
                  <div className="relative w-full h-full bg-white/5 rounded-xl border border-white/10 p-4 transform group-hover:scale-105 transition-transform duration-500">
                    <div className="w-1/2 h-2 bg-white/10 rounded-full mb-4" />
                    <div className="space-y-2">
                      <div className="w-full h-1.5 bg-white/5 rounded-full" />
                      <div className="w-2/3 h-1.5 bg-white/5 rounded-full" />
                    </div>
                  </div>
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Link
                      to={`/editor/${project.id}`}
                      className="p-3 bg-white text-black rounded-xl hover:scale-110 transition-transform"
                      title="Editar"
                    >
                      <Edit3 size={20} />
                    </Link>
                    {project.status === 'published' && (
                      <a
                        href={`/p/${project.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-purple-500 text-white rounded-xl hover:scale-110 transition-transform"
                        title="Ver Site"
                      >
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Info Area */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1 truncate max-w-[200px]">{project.name}</h3>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40">
                        <Zap size={12} className="text-yellow-500" />
                        {project.type}
                      </div>
                    </div>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                      project.status === 'published' 
                        ? "bg-green-500/10 text-green-500 border-green-500/20" 
                        : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    )}>
                      {project.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-white/40 text-xs">
                      <Clock size={12} />
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </div>
                    <button className="p-2 text-white/20 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white/5 rounded-[40px] border border-dashed border-white/10">
          <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
            <Heart size={40} className="text-white/20" />
          </div>
          <h2 className="text-2xl font-black mb-2">NADA POR AQUI... AINDA.</h2>
          <p className="text-white/40 max-w-sm mb-8">
            Suas ideias extraordinárias estão esperando para ganhar vida. 
            Crie seu primeiro projeto agora.
          </p>
          <Link
            to="/new"
            className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-white/90 transition-all active:scale-95"
          >
            Começar Meu Primeiro Projeto
          </Link>
        </div>
      )}
    </div>
  );
}


