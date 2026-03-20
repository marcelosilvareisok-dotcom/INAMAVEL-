import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Project } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Save, 
  Globe, 
  Eye, 
  Smartphone, 
  Monitor, 
  Plus, 
  Settings, 
  ArrowLeft,
  Sparkles,
  Zap,
  Layout,
  Type,
  Image as ImageIcon,
  MousePointer2,
  CheckCircle2,
  X
} from 'lucide-react';

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = React.useState<Project | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = React.useState<'content' | 'design' | 'settings'>('content');
  const [showPublishModal, setShowPublishModal] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      const docRef = doc(db, 'projects', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProject({ id: docSnap.id, ...docSnap.data() } as Project);
      }
      setLoading(false);
    };
    fetchProject();
  }, [id]);

  const handleSave = async () => {
    if (!project || !id) return;
    setSaving(true);
    try {
      const docRef = doc(db, 'projects', id);
      await updateDoc(docRef, {
        ...project,
        updatedAt: new Date().toISOString()
      });
      // Show success toast or something
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!project || !id) return;
    try {
      const docRef = doc(db, 'projects', id);
      await updateDoc(docRef, {
        status: 'published',
        updatedAt: new Date().toISOString()
      });
      setProject({ ...project, status: 'published' });
      setShowPublishModal(true);
    } catch (error) {
      console.error("Erro ao publicar:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#050505]">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#050505] p-4 text-center">
        <h1 className="text-4xl font-black mb-4">PROJETO NÃO ENCONTRADO</h1>
        <p className="text-white/40 mb-8">O projeto que você está procurando não existe ou você não tem permissão.</p>
        <button onClick={() => navigate('/dashboard')} className="px-8 py-4 bg-white text-black font-bold rounded-2xl">
          Voltar ao Dashboard
        </button>
      </div>
    );
  }

  const content = JSON.parse(project.content || '{}');

  return (
    <div className="h-screen flex flex-col bg-[#050505] overflow-hidden">
      {/* Editor Header */}
      <header className="h-16 border-b border-white/5 bg-[#050505] flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="h-8 w-px bg-white/10 mx-2" />
          <div>
            <h1 className="text-sm font-bold truncate max-w-[150px]">{project.name}</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">{project.type}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
          <button 
            onClick={() => setViewMode('desktop')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'desktop' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
          >
            <Monitor size={18} />
          </button>
          <button 
            onClick={() => setViewMode('mobile')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'mobile' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
          >
            <Smartphone size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-all disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
          <button 
            onClick={handlePublish}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-red-500 text-white rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-purple-500/20"
          >
            <Globe size={16} />
            Publicar
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Left - Tools */}
        <aside className="w-72 border-r border-white/5 bg-[#050505] flex flex-col">
          <div className="flex p-2 gap-1 border-b border-white/5">
            {[
              { id: 'content', icon: Layout, label: 'Estrutura' },
              { id: 'design', icon: Sparkles, label: 'Design' },
              { id: 'settings', icon: Settings, label: 'Config' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${
                  activeTab === tab.id ? 'bg-white/5 text-white' : 'text-white/40 hover:text-white'
                }`}
              >
                <tab.icon size={18} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {activeTab === 'content' && (
              <div className="space-y-4">
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Seções Geradas</p>
                {content.sections?.map((section: any, i: number) => (
                  <div key={section.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl group hover:border-purple-500/50 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">{section.type}</span>
                      <MousePointer2 size={12} className="text-white/20 group-hover:text-purple-400" />
                    </div>
                    <h3 className="text-sm font-bold truncate">{section.title}</h3>
                  </div>
                ))}
                <button className="w-full py-3 border-2 border-dashed border-white/10 rounded-2xl text-white/40 text-sm font-bold hover:border-white/20 hover:text-white transition-all flex items-center justify-center gap-2">
                  <Plus size={16} /> Adicionar Seção
                </button>
              </div>
            )}
            
            {activeTab === 'design' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Paleta de Cores</p>
                  <div className="grid grid-cols-3 gap-2">
                    {['#8B5CF6', '#EF4444', '#050505'].map((color, i) => (
                      <div key={i} className="aspect-square rounded-xl border border-white/10 p-1">
                        <div className="w-full h-full rounded-lg" style={{ backgroundColor: color }} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Tipografia</p>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-lg font-black tracking-tighter">Inter Black</p>
                    <p className="text-xs text-white/40">Sans-serif moderna</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/5">
            <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 flex items-center gap-3">
              <Zap size={20} className="text-purple-400" />
              <div>
                <p className="text-xs font-bold text-purple-400">DICA IA</p>
                <p className="text-[10px] text-white/60">Use o editor para refinar o que a IA criou.</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Preview Area */}
        <main className="flex-1 bg-[#111] p-8 overflow-y-auto flex justify-center">
          <div className={`bg-white text-black transition-all duration-500 shadow-2xl overflow-hidden rounded-2xl ${
            viewMode === 'desktop' ? 'w-full max-w-5xl' : 'w-[375px]'
          }`}>
            {/* Mock Website Content */}
            <div className="min-h-full font-sans">
              {content.sections?.map((section: any) => (
                <section key={section.id} className={`p-12 ${section.type === 'hero' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                  <h2 className={`text-4xl font-black tracking-tighter mb-4 ${section.type === 'hero' ? 'text-5xl md:text-6xl' : ''}`}>
                    {section.title}
                  </h2>
                  <p className={`text-lg leading-relaxed ${section.type === 'hero' ? 'text-white/60' : 'text-black/60'}`}>
                    {section.content}
                  </p>
                  {section.items && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                      {section.items.map((item: string, i: number) => (
                        <div key={i} className={`p-6 rounded-2xl border ${section.type === 'hero' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                          <p className="font-bold">{item}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              ))}
              <footer className="p-8 text-center text-xs text-black/40 border-t border-black/5">
                Feito com Inabalável💔
              </footer>
            </div>
          </div>
        </main>
      </div>

      {/* Publish Success Modal */}
      <AnimatePresence>
        {showPublishModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPublishModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[40px] p-12 text-center"
            >
              <div className="w-20 h-20 bg-green-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
              <h2 className="text-3xl font-black tracking-tighter mb-4">ESTÁ NO AR!</h2>
              <p className="text-white/60 mb-8">
                Seu projeto extraordinário agora é público. Compartilhe com o mundo.
              </p>
              
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between mb-8">
                <code className="text-purple-400 font-bold truncate">inabalavel.app/p/{project.slug}</code>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white">
                  <Save size={18} />
                </button>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowPublishModal(false)}
                  className="flex-1 py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
                >
                  Continuar Editando
                </button>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 py-4 bg-white text-black font-bold rounded-2xl hover:bg-white/90 transition-all"
                >
                  Ir para Dashboard
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
