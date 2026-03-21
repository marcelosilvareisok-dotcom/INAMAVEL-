import React from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, setDoc, updateDoc, increment, collection, serverTimestamp, getDoc, getDocFromServer } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firestore-errors';
import { generateProjectContent } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Zap, 
  Layout, 
  Globe, 
  Smartphone, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Coins
} from 'lucide-react';

export default function NewProject() {
  const [name, setName] = React.useState('');
  const [type, setType] = React.useState<'website' | 'app' | 'landing' | 'service'>('website');
  const [objective, setObjective] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [progress, setProgress] = React.useState(0);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!auth.currentUser) return;
    
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
    { id: 'website', label: 'Website', icon: Globe, desc: 'Sites institucionais ou blogs.' },
    { id: 'app', label: 'Web App', icon: Layout, desc: 'Aplicações com funcionalidades.' },
    { id: 'landing', label: 'Landing Page', icon: Zap, desc: 'Páginas de alta conversão.' },
    { id: 'service', label: 'Página de Serviço', icon: Smartphone, desc: 'Venda seus serviços online.' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      {loading ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-400" size={32} />
          </div>
          <h2 className="text-3xl font-black mb-4">A IA ESTÁ CRIANDO O EXTRAORDINÁRIO...</h2>
          <p className="text-white/40 mb-8 max-w-md">
            Estamos transformando suas ideias em uma estrutura moderna e profissional. 
            Isso levará apenas alguns segundos.
          </p>
          
          <div className="w-full max-w-md bg-white/5 h-2 rounded-full overflow-hidden border border-white/10">
            <motion.div 
              className="h-full bg-gradient-to-r from-purple-500 to-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-4 text-xs font-bold text-purple-400 uppercase tracking-widest">{progress}% CONCLUÍDO</p>
        </motion.div>
      ) : (
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-black tracking-tighter">CRIE SEU PROJETO</h1>
            <p className="text-white/60 text-xl">Preencha os detalhes abaixo para começar.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 uppercase tracking-widest">Nome do Projeto</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Meu Portfólio, Inabalável App..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-purple-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 uppercase tracking-widest">Tipo de Projeto</label>
                <div className="grid grid-cols-2 gap-3">
                  {projectTypes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setType(t.id as any)}
                      className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                        type === t.id 
                          ? 'bg-purple-500/10 border-purple-500' 
                          : 'bg-white/5 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <t.icon size={20} className={type === t.id ? 'text-purple-400' : 'text-white/40'} />
                      <span className="font-bold">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-white/60 uppercase tracking-widest">Objetivo</label>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Ex: Um site para vender consultoria de marketing digital para iniciantes..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 h-full min-h-[200px] outline-none focus:border-purple-500 transition-all resize-none"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 p-6 bg-white/5 rounded-3xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <Coins size={20} className="text-yellow-500" />
              </div>
              <div>
                <p className="text-sm font-bold">Custo da Geração</p>
                <p className="text-xs text-white/40">5 moedas serão debitadas</p>
              </div>
            </div>
            <button
              disabled={!name || !objective || loading}
              onClick={handleGenerate}
              className="px-10 py-4 bg-gradient-to-r from-purple-500 to-red-500 text-white font-bold rounded-2xl hover:scale-105 transition-all flex items-center gap-2 group disabled:opacity-50"
            >
              Gerar com IA <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
