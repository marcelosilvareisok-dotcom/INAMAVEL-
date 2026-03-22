import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firestore-errors';
import { generateProjectContent } from '../services/gemini';
import { Project } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import MonacoEditor from '@monaco-editor/react';
import { Step } from 'react-joyride';
import Logo from '../components/Logo';
import PublishModal from '../components/PublishModal';
import Tutorial from '../components/Tutorial';
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
  X,
  Send,
  Loader2
} from 'lucide-react';

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = React.useState<Project | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState<'idle' | 'saving' | 'saved'>('idle');
  const [viewMode, setViewMode] = React.useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = React.useState<'content' | 'design' | 'settings'>('content');
  const [showPublishModal, setShowPublishModal] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [promptInput, setPromptInput] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [runTutorial, setRunTutorial] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('has_seen_editor_tutorial');
    if (!hasSeenTutorial) {
      setRunTutorial(true);
    }
  }, []);

  const tutorialSteps: Step[] = [
    {
      target: 'body',
      content: 'Bem-vindo ao Editor do INABALÁVEL💔! Vamos te guiar pelas ferramentas principais.',
      placement: 'center',
    },
    {
      target: '.editor-preview',
      content: 'Aqui você vê o preview do seu projeto em tempo real. Qualquer mudança no código ou via IA aparecerá aqui.',
    },
    {
      target: '.view-mode-toggle',
      content: 'Alterne entre a visualização de Desktop e Mobile para garantir que seu projeto seja responsivo.',
    },
    {
      target: '.sidebar-tabs',
      content: 'Use estas abas para alternar entre o Preview e o Editor de Código.',
    },
    {
      target: '.editor-code',
      content: 'Aqui você tem controle total sobre o código HTML/Tailwind. Você pode editar manualmente se desejar.',
    },
    {
      target: '.editor-prompt',
      content: 'Esta é a sua ferramenta mais poderosa! Peça para a IA fazer qualquer alteração, desde mudar cores até criar seções inteiras.',
    },
    {
      target: '.save-button',
      content: 'Não se esqueça de salvar suas alterações. O editor também possui salvamento automático.',
    },
    {
      target: '.publish-button',
      content: 'Quando estiver pronto, publique seu projeto diretamente no GitHub para colocá-lo no ar!',
    },
  ];

  // Remember last project
  React.useEffect(() => {
    if (id) {
      localStorage.setItem('last_project_id', id);
    }
  }, [id]);

  React.useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() } as Project);
        }
        setLoading(false);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `projects/${id}`);
      }
    };
    fetchProject();
  }, [id]);

  // Auto-save logic
  React.useEffect(() => {
    if (!project || loading) return;

    const timeout = setTimeout(async () => {
      setSaving('saving');
      try {
        const docRef = doc(db, 'projects', id!);
        await updateDoc(docRef, {
          ...project,
          updatedAt: new Date().toISOString()
        });
        setSaving('saved');
        setTimeout(() => setSaving('idle'), 2000);
      } catch (error) {
        console.error("Erro ao salvar automaticamente:", error);
        if (error instanceof Error && (error.message.includes('permission-denied') || error.message.includes('insufficient permissions'))) {
          handleFirestoreError(error, OperationType.UPDATE, `projects/${id}`);
        }
        setSaving('idle');
      }
    }, 2000); // Save after 2 seconds of inactivity

    return () => clearTimeout(timeout);
  }, [project, id]);

  const handleSave = async () => {
    if (!project || !id) return;
    setSaving('saving');
    try {
      const docRef = doc(db, 'projects', id);
      await updateDoc(docRef, {
        ...project,
        updatedAt: new Date().toISOString()
      });
      setSaving('saved');
      setTimeout(() => setSaving('idle'), 2000);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      handleFirestoreError(error, OperationType.UPDATE, `projects/${id}`);
      setSaving('idle');
    }
  };

  const handlePublish = async () => {
    if (!project || !id) return;
    setShowPublishModal(true);
  };

  const handleModify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim() || !project || isGenerating) return;

    let currentContent;
    try {
      currentContent = JSON.parse(project.content || '{}');
    } catch (e) {
      console.error("Erro ao parsear conteúdo do projeto:", e);
      alert("Erro ao ler o conteúdo do projeto. O formato está inválido.");
      return;
    }
    if (!currentContent.html) return;

    setIsGenerating(true);
    try {
      const newContent = await generateProjectContent(
        project.name, 
        project.type, 
        project.objective, 
        currentContent.html, 
        promptInput
      );
      
      const updatedProject = {
        ...project,
        content: JSON.stringify(newContent),
        updatedAt: new Date().toISOString()
      };

      const docRef = doc(db, 'projects', project.id);
      await updateDoc(docRef, updatedProject);
      
      setProject(updatedProject);
      setPromptInput('');
    } catch (error) {
      console.error("Erro ao modificar:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Erro ao modificar o projeto: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#050505] gap-4">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Carregando o Inabalável 💔</p>
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

  let content;
  try {
    content = JSON.parse(project.content || '{}');
  } catch (e) {
    console.error("Erro ao parsear conteúdo do projeto:", e);
    content = { html: "" };
  }

  return (
    <div className="h-screen flex flex-col bg-[#050505] overflow-hidden">
      <Tutorial 
        steps={tutorialSteps} 
        run={runTutorial} 
        onClose={() => {
          setRunTutorial(false);
          localStorage.setItem('has_seen_editor_tutorial', 'true');
        }} 
      />
      {/* Editor Header */}
      <header className="h-16 border-b border-white/5 bg-[#050505] flex items-center justify-between px-2 md:px-4 z-50">
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="h-8 w-px bg-white/10 mx-1 md:mx-2" />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xs md:text-sm font-bold truncate max-w-[80px] md:max-w-[150px]">{project.name}</h1>
              <AnimatePresence mode="wait">
                {saving === 'saving' && (
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="hidden md:flex items-center gap-1 text-[10px] text-purple-400 font-bold uppercase tracking-widest"
                  >
                    <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" />
                    Salvando...
                  </motion.div>
                )}
                {saving === 'saved' && (
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="hidden md:flex items-center gap-1 text-[10px] text-green-500 font-bold uppercase tracking-widest"
                  >
                    <CheckCircle2 size={10} />
                    Salvo
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <p className="text-[8px] md:text-[10px] text-white/40 uppercase tracking-widest font-black truncate">{project.type}</p>
          </div>
        </div>

        <div className="view-mode-toggle hidden sm:flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
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

        <div className="flex items-center gap-2 md:gap-3">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white"
          >
            <Layout size={18} />
          </button>
          <button 
            onClick={handleSave}
            disabled={saving === 'saving'}
            className="save-button flex items-center gap-2 px-3 md:px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs md:text-sm font-bold hover:bg-white/10 transition-all disabled:opacity-50"
          >
            <Save size={16} />
            <span className="hidden md:inline">{saving === 'saving' ? 'Salvando...' : 'Salvar'}</span>
          </button>
          <button 
            onClick={handlePublish}
            className="publish-button flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-purple-500 to-red-500 text-white rounded-xl text-xs md:text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-purple-500/20"
          >
            <Globe size={16} />
            <span className="hidden md:inline">Publicar</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar Left - Tools */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-[#050505] border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex items-center justify-between p-4 border-b border-white/5 lg:hidden">
            <span className="text-xs font-black uppercase tracking-widest text-white/40">Menu do Editor</span>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-white/5 rounded-lg text-white/40">
              <X size={20} />
            </button>
          </div>
          <div className="sidebar-tabs flex p-2 gap-1 border-b border-white/5">
            {[
              { id: 'content', icon: Eye, label: 'Preview' },
              { id: 'design', icon: Type, label: 'Código' },
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
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Visualização</p>
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <p className="text-sm text-white/80">
                    Você está visualizando o resultado gerado pela IA. Use os botões no topo para testar a responsividade.
                  </p>
                </div>
              </div>
            )}
            
            {activeTab === 'design' && (
              <div className="space-y-4 h-full flex flex-col">
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Código Fonte</p>
                <div className="editor-code flex-1 bg-black/50 border border-white/10 rounded-2xl overflow-hidden relative">
                  <MonacoEditor 
                    height="100%"
                    language="html"
                    theme="vs-dark"
                    value={content.html || ""}
                    onChange={(value) => {
                      const newHtml = value || "";
                      setProject(prev => prev ? {
                        ...prev,
                        content: JSON.stringify({ ...content, html: newHtml })
                      } : null);
                    }}
                    options={{
                      fontSize: 12,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      padding: { top: 16, bottom: 16 }
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/5">
            <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 flex items-center gap-3">
              <Zap size={20} className="text-purple-400" />
              <div>
                <p className="text-xs font-bold text-purple-400">DICA IA</p>
                <p className="text-[10px] text-white/60">O código gerado usa Tailwind CSS puro.</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Preview Area */}
        <main className="flex-1 bg-[#111] p-2 md:p-8 overflow-y-auto flex justify-center relative">
          {/* Mobile Sidebar Overlay */}
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
              />
            )}
          </AnimatePresence>

          <div className={`editor-preview bg-white text-black transition-all duration-500 shadow-2xl overflow-hidden rounded-2xl h-[calc(100vh-12rem)] ${
            viewMode === 'desktop' ? 'w-full max-w-6xl' : 'w-full max-w-[375px]'
          }`}>
            {content.html ? (
              <iframe 
                srcDoc={content.html} 
                title="Preview" 
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <div className="min-h-full font-sans">
                {content.sections?.map((section: any) => (
                  <section key={section.id} className={`p-6 md:p-12 ${section.type === 'hero' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                    <h2 className={`text-2xl md:text-4xl font-black tracking-tighter mb-4 ${section.type === 'hero' ? 'text-3xl md:text-6xl' : ''}`}>
                      {section.title}
                    </h2>
                    <p className={`text-sm md:text-lg leading-relaxed ${section.type === 'hero' ? 'text-white/60' : 'text-black/60'}`}>
                      {section.content}
                    </p>
                    {section.items && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8 md:mt-12">
                        {section.items.map((item: string, i: number) => (
                          <div key={i} className={`p-4 md:p-6 rounded-2xl border ${section.type === 'hero' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                            <p className="font-bold text-sm md:text-base">{item}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                ))}
                <footer className="p-6 md:p-8 text-center text-[10px] md:text-xs text-black/40 border-t border-black/5 flex justify-center">
                  <Logo size="sm" />
                </footer>
              </div>
            )}
          </div>

          {/* Floating Prompt Input */}
          {content.html && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-black/60 border border-white/10 rounded-full backdrop-blur-md shadow-2xl">
                <Sparkles size={14} className="text-purple-400" />
                <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">
                  Melhores engenheiros do mundo no desenvolvimento de software
                </span>
              </div>
              <form 
                onSubmit={handleModify}
                className="editor-prompt w-full bg-[#0a0a0a] border border-white/10 rounded-2xl p-2 flex items-center gap-2 shadow-2xl shadow-black/50 backdrop-blur-xl"
              >
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="Peça para a IA alterar algo (ex: Mude a cor do botão para azul)..."
                  className="flex-1 bg-transparent border-none text-white text-sm px-4 py-2 focus:outline-none placeholder:text-white/30"
                  disabled={isGenerating}
                />
                <button
                  type="submit"
                  disabled={!promptInput.trim() || isGenerating}
                  className="p-3 bg-white text-black rounded-xl hover:bg-white/90 transition-all disabled:opacity-50 disabled:hover:bg-white flex items-center justify-center"
                >
                  {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* Publish Modal */}
      {project && (
        <PublishModal 
          isOpen={showPublishModal} 
          onClose={() => setShowPublishModal(false)} 
          projectName={project.name}
          projectSlug={project.slug}
          onPublish={async (config) => {
            const response = await fetch('/api/publish', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                githubToken: config.githubToken,
                repoOwner: config.repoOwner,
                repoName: config.repoName,
                files: [{ path: 'index.html', content: project.content }],
                commitMessage: `Publicação do projeto ${project.name}`
              })
            });

            if (!response.ok) {
              const data = await response.json();
              throw new Error(data.error || 'Erro ao publicar');
            }

            // Update project status in Firestore
            const projectRef = doc(db, 'projects', project.id);
            await updateDoc(projectRef, { status: 'published' });
            setProject({ ...project, status: 'published' });
          }}
        />
      )}
    </div>
  );
}
