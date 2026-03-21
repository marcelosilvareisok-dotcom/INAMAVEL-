import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc, increment, setDoc } from 'firebase/firestore';
import { Project } from '../types';
import { handleFirestoreError, OperationType } from '../utils/firestore-errors';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';
import { 
  Plus, 
  Search, 
  ExternalLink, 
  Clock, 
  Globe, 
  Layout as LayoutIcon, 
  Trash2,
  Edit3,
  Coins,
  Sparkles,
  ArrowRight,
  Monitor,
  Share2
} from 'lucide-react';
import ShareModal from '../components/ShareModal';

export default function Dashboard() {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [prompt, setPrompt] = React.useState('');
  const [showPaymentSuccess, setShowPaymentSuccess] = React.useState<{ coins: number } | null>(null);
  const [shareProject, setShareProject] = React.useState<{ url: string; name: string } | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    // Handle payment success from Mercado Pago
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const coinsStr = urlParams.get('coins');

    if (paymentStatus === 'success' && coinsStr) {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          const coins = parseInt(coinsStr);
          const updateCoins = async () => {
            try {
              const userRef = doc(db, 'users', user.uid);
              await updateDoc(userRef, {
                coins: increment(coins)
              });

              const transactionId = Math.random().toString(36).substring(7);
              await setDoc(doc(db, 'transactions', transactionId), {
                id: transactionId,
                userId: user.uid,
                amount: coins,
                type: 'purchase',
                description: `Compra de ${coins} moedas (Mercado Pago)`,
                createdAt: new Date().toISOString()
              });

              setShowPaymentSuccess({ coins });
              window.history.replaceState({}, document.title, window.location.pathname);
            } catch (error) {
              console.error("Erro ao atualizar moedas:", error);
              handleFirestoreError(error, OperationType.WRITE, 'users/transactions');
            }
          };
          updateCoins();
          unsubscribe();
        }
      });
      return () => unsubscribe();
    }
  }, []);

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
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'projects');
    });

    return () => unsubscribe();
  }, []);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    // Pass the prompt to the new project page
    navigate('/new', { state: { initialPrompt: prompt } });
  };

  return (
    <div className="space-y-10 pb-20 max-w-4xl mx-auto">
      <AnimatePresence>
        {showPaymentSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPaymentSuccess(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-[#09090B] border border-white/10 rounded-2xl p-8 text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                <Coins size={32} className="text-white" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Recarga Concluída</h2>
              <p className="text-sm text-white/60 mb-8">
                Você recebeu {showPaymentSuccess.coins} moedas. Sua criatividade agora não tem limites.
              </p>
              <button 
                onClick={() => setShowPaymentSuccess(null)}
                className="w-full py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-white/90 transition-all"
              >
                Continuar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero / Create Section */}
      <div className="flex flex-col items-center justify-center pt-12 pb-8 text-center space-y-6">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
          O que você quer construir?
        </h1>
        <p className="text-white/50 text-sm max-w-md">
          Descreva sua ideia em detalhes e nossa IA cuidará do resto.
        </p>
        
        <form onSubmit={handleCreateProject} className="w-full max-w-2xl relative mt-4 group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative flex items-center bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden shadow-sm focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/30 transition-all">
            <div className="pl-4 text-white/40">
              <Sparkles size={20} />
            </div>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Uma landing page para uma agência de marketing digital..."
              className="w-full bg-transparent border-none py-4 pl-3 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-0"
            />
            <div className="pr-2">
              <button
                type="submit"
                disabled={!prompt.trim()}
                className="p-2 bg-white text-black rounded-xl hover:bg-white/90 disabled:opacity-50 disabled:hover:bg-white transition-all"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Projects Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-lg font-medium text-white">Projetos Recentes</h2>
          
          <div className="relative w-64 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
            <input
              type="text"
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 pl-9 pr-3 text-xs text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-xs text-white/40">Carregando projetos...</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group flex flex-col bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 hover:bg-white/[0.02] transition-all cursor-pointer"
                  onClick={() => navigate(`/editor/${project.id}`)}
                >
                  {/* Minimal Preview Area */}
                  <div className="h-32 bg-[#111] border-b border-white/5 relative flex items-center justify-center overflow-hidden">
                    <Monitor size={32} className="text-white/10 group-hover:text-white/20 transition-colors" />
                    
                    {/* Quick Actions Overlay */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {project.status === 'published' && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShareProject({
                                url: `${window.location.origin}/p/${project.slug}`,
                                name: project.name
                              });
                            }}
                            className="p-1.5 bg-black/50 backdrop-blur-sm text-white/70 hover:text-white rounded-md border border-white/10 transition-colors"
                            title="Compartilhar"
                          >
                            <Share2 size={14} />
                          </button>
                          <a
                            href={`/p/${project.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 bg-black/50 backdrop-blur-sm text-white/70 hover:text-white rounded-md border border-white/10 transition-colors"
                            title="Ver Site"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Info Area */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-medium text-white truncate pr-2">{project.name}</h3>
                        <div className={cn(
                          "w-2 h-2 rounded-full flex-shrink-0",
                          project.status === 'published' ? "bg-green-500" : "bg-white/20"
                        )} title={project.status === 'published' ? 'Publicado' : 'Rascunho'} />
                      </div>
                      <p className="text-xs text-white/40 truncate">{project.type}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                      <div className="flex items-center gap-1.5 text-[11px] text-white/30">
                        <Clock size={12} />
                        {new Date(project.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2">
                        {project.status === 'published' && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setShareProject({
                                url: `${window.location.origin}/p/${project.slug}`,
                                name: project.name
                              });
                            }}
                            className="text-white/20 hover:text-blue-400 transition-colors"
                            title="Compartilhar"
                          >
                            <Share2 size={14} />
                          </button>
                        )}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle delete logic here or open a modal
                          }}
                          className="text-white/20 hover:text-red-400 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
            <LayoutIcon size={32} className="text-white/20 mb-4" />
            <h3 className="text-sm font-medium text-white mb-1">Nenhum projeto encontrado</h3>
            <p className="text-xs text-white/40 mb-6 max-w-xs">
              Você ainda não criou nenhum projeto. Use a barra de pesquisa acima para começar.
            </p>
          </div>
        )}
      </div>

      {shareProject && (
        <ShareModal
          isOpen={!!shareProject}
          onClose={() => setShareProject(null)}
          projectUrl={shareProject.url}
          projectName={shareProject.name}
        />
      )}
    </div>
  );
}


