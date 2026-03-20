import React from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, setDoc, updateDoc, increment, collection, serverTimestamp } from 'firebase/firestore';
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
  const [step, setStep] = React.useState(1);
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
      // 1. Check coins (Simplified for now, assume user has enough)
      setProgress(20);
      
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

      // 4. Deduct coins (5 coins for generation)
      const userRef = doc(db, 'users', auth.currentUser.uid);
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

      setProgress(100);
      setTimeout(() => navigate(`/editor/${projectId}`), 1000);

    } catch (err: any) {
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
    <div className="max-w-3xl mx-auto py-12">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
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
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Progress Bar */}
            <div className="flex gap-2 mb-12">
              {[1, 2, 3].map((s) => (
                <div 
                  key={s} 
                  className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                    s <= step ? 'bg-purple-500' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>

            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-black tracking-tighter mb-2">QUAL O NOME DO SEU PROJETO?</h1>
                  <p className="text-white/60">Dê uma identidade à sua visão extraordinária.</p>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Meu Portfólio, Inabalável App..."
                    className="w-full bg-white/5 border-b-2 border-white/10 py-6 text-3xl font-bold outline-none focus:border-purple-500 transition-all"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    disabled={!name}
                    onClick={() => setStep(2)}
                    className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-white/90 transition-all flex items-center gap-2 group disabled:opacity-50"
                  >
                    Próximo <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div>
                  <button 
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-white/40 hover:text-white mb-4 transition-colors"
                  >
                    <ArrowLeft size={16} /> Voltar
                  </button>
                  <h1 className="text-4xl font-black tracking-tighter mb-2">O QUE VOCÊ QUER CRIAR?</h1>
                  <p className="text-white/60">Escolha o formato que melhor se adapta à sua ideia.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projectTypes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setType(t.id as any)}
                      className={`p-6 rounded-3xl border-2 text-left transition-all ${
                        type === t.id 
                          ? 'bg-purple-500/10 border-purple-500' 
                          : 'bg-white/5 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <t.icon size={24} className={type === t.id ? 'text-purple-400' : 'text-white/40'} />
                      <h3 className="text-xl font-bold mt-4 mb-2">{t.label}</h3>
                      <p className="text-sm text-white/40">{t.desc}</p>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setStep(3)}
                    className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-white/90 transition-all flex items-center gap-2 group"
                  >
                    Próximo <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <div>
                  <button 
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 text-white/40 hover:text-white mb-4 transition-colors"
                  >
                    <ArrowLeft size={16} /> Voltar
                  </button>
                  <h1 className="text-4xl font-black tracking-tighter mb-2">QUAL O OBJETIVO?</h1>
                  <p className="text-white/60">Descreva o que seu projeto faz e para quem ele é.</p>
                </div>
                <textarea
                  autoFocus
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="Ex: Um site para vender consultoria de marketing digital para iniciantes..."
                  className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 h-48 text-xl outline-none focus:border-purple-500 transition-all resize-none"
                />
                
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500">
                    <AlertCircle size={20} />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white/5 rounded-3xl border border-white/10">
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
                    disabled={!objective || loading}
                    onClick={handleGenerate}
                    className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-purple-500 to-red-500 text-white font-bold rounded-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    Gerar com IA <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
