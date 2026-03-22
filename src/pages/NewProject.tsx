import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, setDoc, updateDoc, increment, collection, serverTimestamp, getDoc, getDocFromServer } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firestore-errors';
import { generateProjectContent } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Layout, 
  Globe, 
  Smartphone, 
  ArrowRight, 
  Loader2,
  AlertCircle,
  Coins,
  Monitor
} from 'lucide-react';
import { cn } from '../utils';

export default function NewProject() {
  const location = useLocation();
  const [name, setName] = React.useState('');
  const [type, setType] = React.useState<'website' | 'app' | 'landing' | 'service'>('website');
  const [objective, setObjective] = React.useState(location.state?.initialPrompt || '');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [progress, setProgress] = React.useState(0);
  const navigate = useNavigate();

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!auth.currentUser || !name.trim() || !objective.trim()) return;
    
    setLoading(true);
    setError('');
    setProgress(10);

    try {
      // 1. Check Free Mode and coins
      setProgress(20);
      
      const settingsRef = doc(db, 'settings', 'global');
      const settingsSnap = await getDocFromServer(settingsRef);
      const isFreeMode = settingsSnap.exists() && settingsSnap.data().freeMode === true;

      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('Perfil de usuário não encontrado.');
      }
      
      const userData = userDoc.data();
      if (!isFreeMode && userData.coins < 5) {
        throw new Error('Moedas insuficientes. Por favor, recarregue sua conta.');
      }
      
      // 2. Generate content with AI
      const content = await generateProjectContent(name, type, objective);
      setProgress(60);

      // 3. Create project in Firestore
      const projectId = Math.random().toString(36).substring(7);
      const slug = name.toLowerCase().replace(/ /g, '-') + '-' + Math.random().toString(36).substring(2, 5);
      
      const projectData = {
        id: projectId,
        userId: auth.currentUser.uid,
        name,
        type,
        objective,
        content: JSON.stringify(content),
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        slug
      };

      await setDoc(doc(db, 'projects', projectId), projectData);
      setProgress(80);

      // 4. Deduct coins if not in Free Mode
      if (!isFreeMode) {
        await updateDoc(userRef, {
          coins: increment(-5)
        });
        
        // 5. Log transaction
        const transactionId = Math.random().toString(36).substring(7);
        await setDoc(doc(db, 'transactions', transactionId), {
          id: transactionId,
          userId: auth.currentUser.uid,
          amount: 5,
          type: 'spend',
          description: `Geração de projeto: ${name}`,
          createdAt: new Date().toISOString()
        });
      }

      setProgress(100);
      setTimeout(() => navigate(`/editor/${projectId}`), 1000);

    } catch (err: any) {
      console.error("Erro na geração:", err);
      if (err.message?.includes('permission-denied') || err.message?.includes('insufficient permissions')) {
        handleFirestoreError(err, OperationType.WRITE, 'projects/users/transactions');
      }
      setError(err.message || 'Erro ao gerar projeto. Tente novamente.');
      setLoading(false);
    }
  };

  const projectTypes = [
    { id: 'website', label: 'Website', icon: Globe },
    { id: 'app', label: 'Web App', icon: Monitor },
    { id: 'landing', label: 'Landing Page', icon: Layout },
    { id: 'service', label: 'Serviço', icon: Smartphone },
  ];

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {loading ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-32 text-center"
        >
          <div className="relative mb-8">
            <div className="w-16 h-16 border-2 border-white/10 border-t-white rounded-full animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50" size={20} />
          </div>
          <h2 className="text-xl font-medium mb-3 text-white uppercase tracking-widest font-black">Carregando o Inabalável 💔</h2>
          <p className="text-sm text-white/40 mb-8 max-w-sm">
            Nossa IA está estruturando sua ideia. Isso levará apenas alguns segundos.
          </p>
          
          <div className="w-full max-w-xs bg-white/5 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeInOut" }}
            />
          </div>
          <p className="mt-4 text-[10px] font-medium text-white/40 uppercase tracking-widest">{progress}% concluído</p>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-2">
              <Sparkles size={14} className="text-purple-400" />
              <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">
                Melhores engenheiros do mundo no desenvolvimento de software
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Detalhes do Projeto
            </h1>
            <p className="text-white/50 text-sm">
              Configure as informações básicas para a IA gerar a estrutura ideal.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-8">
            <div className="space-y-6 bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 sm:p-8">
              
              {/* Name Input */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-white/80">Nome do Projeto</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Acme Corp, Meu Portfólio..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:ring-1 focus:ring-white/30 outline-none transition-all"
                  autoFocus
                />
              </div>

              {/* Type Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-white/80">Tipo de Projeto</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {projectTypes.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id as any)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all",
                        type === t.id 
                          ? "bg-white/10 border-white/30 text-white" 
                          : "bg-white/5 border-white/5 text-white/50 hover:border-white/20 hover:text-white/80"
                      )}
                    >
                      <t.icon size={20} />
                      <span className="text-xs font-medium">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt/Objective Input */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-white/80">O que você quer construir?</label>
                <textarea
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="Descreva sua ideia em detalhes. Quanto mais específico, melhor o resultado..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:ring-1 focus:ring-white/30 outline-none transition-all min-h-[120px] resize-y"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500">
                <AlertCircle size={18} />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Action Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <div className="flex items-center gap-3 text-sm text-white/60">
                <Coins size={16} className="text-white/40" />
                <span>Custo: <strong className="text-white">5 moedas</strong></span>
              </div>
              
              <button
                type="submit"
                disabled={!name.trim() || !objective.trim() || loading}
                className="w-full sm:w-auto px-8 py-3 bg-white text-black text-sm font-medium rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:bg-white"
              >
                Gerar Projeto <Sparkles size={16} />
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}
