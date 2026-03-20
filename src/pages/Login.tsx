import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Heart, Mail, Lock, Chrome, ArrowRight, Sparkles } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  const translateError = (message: string) => {
    if (message.includes('auth/invalid-credential')) return 'Email ou senha incorretos.';
    if (message.includes('auth/user-not-found')) return 'Usuário não encontrado.';
    if (message.includes('auth/wrong-password')) return 'Senha incorreta.';
    if (message.includes('auth/email-already-in-use')) return 'Este email já está em uso.';
    if (message.includes('auth/weak-password')) return 'A senha deve ter pelo menos 6 caracteres.';
    if (message.includes('auth/invalid-email')) return 'Email inválido.';
    if (message.includes('auth/popup-closed-by-user')) return 'O login foi cancelado.';
    if (message.includes('auth/unauthorized-domain')) return 'Domínio não autorizado no Firebase.';
    return 'Ocorreu um erro. Tente novamente.';
  };

  const handleAuthSuccess = async (user: any) => {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || email.split('@')[0],
        photoURL: user.photoURL || '',
        coins: 100, // Welcome bonus increased
        createdAt: serverTimestamp(),
        role: 'user'
      });
    }
    navigate('/dashboard');
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleAuthSuccess(result.user);
    } catch (err: any) {
      setError(translateError(err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        const result = await signInWithEmailAndPassword(auth, email, password);
        await handleAuthSuccess(result.user);
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await handleAuthSuccess(result.user);
      }
    } catch (err: any) {
      setError(translateError(err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-white/5 border border-white/10 mb-6"
          >
            <Heart size={32} className="text-red-500 fill-red-500" />
          </motion.div>
          <h1 className="text-3xl font-black tracking-tighter mb-2">
            {isLogin ? 'BEM-VINDO DE VOLTA' : 'CRIE SUA CONTA'}
          </h1>
          <p className="text-white/60">
            {isLogin ? 'Suas ideias extraordinárias te esperam.' : 'Comece a criar o impossível hoje.'}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded border border-white/20 flex items-center justify-center group-hover:border-purple-500 transition-colors">
                  <div className="w-2 h-2 bg-purple-500 rounded-sm opacity-100" />
                </div>
                <span className="text-white/40 group-hover:text-white/60 transition-colors">Lembrar acesso</span>
              </label>
              {isLogin && (
                <button type="button" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                  Esqueceu a senha?
                </button>
              )}
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? 'Processando...' : isLogin ? 'Entrar' : 'Criar Conta'}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#050505] px-4 text-white/40 font-bold">Ou continue com</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <Chrome size={20} />
            Google
          </button>

          <p className="mt-8 text-center text-sm text-white/40">
            {isLogin ? 'Ainda não tem conta?' : 'Já tem uma conta?'}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-purple-400 font-bold hover:text-purple-300 transition-colors"
            >
              {isLogin ? 'Criar agora' : 'Entrar agora'}
            </button>
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-white/20 text-xs font-bold uppercase tracking-widest">
          <Sparkles size={12} />
          Powered by Gemini AI
        </div>
      </motion.div>
    </div>
  );
}
