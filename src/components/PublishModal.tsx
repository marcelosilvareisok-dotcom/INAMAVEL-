import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Github, Heart, CheckCircle2, Loader2, Copy, Smartphone } from 'lucide-react';
import { Project } from '../types';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onPublishSuccess: () => void;
}

export default function PublishModal({ isOpen, onClose, project, onPublishSuccess }: PublishModalProps) {
  const [step, setStep] = React.useState<'donation' | 'github' | 'publishing' | 'success'>('donation');
  const [githubToken, setGithubToken] = React.useState('');
  const [repoName, setRepoName] = React.useState(project.slug || `inabalavel-${Date.now()}`);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [error, setError] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  const pixKey = "94991233751";

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePublish = async () => {
    if (!githubToken.trim()) {
      setError('Por favor, insira seu Personal Access Token do GitHub.');
      return;
    }
    
    setIsPublishing(true);
    setError('');
    setStep('publishing');

    try {
      // 1. Check if repo exists, if not create it
      let repoUrl = '';
      const headers = {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      };

      // Get user info
      const userRes = await fetch('https://api.github.com/user', { headers });
      if (!userRes.ok) throw new Error('Token inválido ou expirado.');
      const userData = await userRes.json();
      const username = userData.login;

      // Check repo
      const repoRes = await fetch(`https://api.github.com/repos/${username}/${repoName}`, { headers });
      
      if (repoRes.status === 404) {
        // Create repo
        const createRes = await fetch('https://api.github.com/user/repos', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            name: repoName,
            description: 'Projeto criado com Inabalável💔',
            private: false,
            auto_init: true
          })
        });
        if (!createRes.ok) throw new Error('Erro ao criar repositório.');
        const createData = await createRes.json();
        repoUrl = createData.html_url;
      } else if (repoRes.ok) {
        const repoData = await repoRes.json();
        repoUrl = repoData.html_url;
      } else {
        throw new Error('Erro ao verificar repositório.');
      }

      // 2. Push code (index.html)
      const content = JSON.parse(project.content || '{}');
      const htmlContent = content.html || '<h1>Projeto Vazio</h1>';
      
      // Get current file sha if exists
      let sha = '';
      const fileRes = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/index.html`, { headers });
      if (fileRes.ok) {
        const fileData = await fileRes.json();
        sha = fileData.sha;
      }

      const pushRes = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/index.html`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          message: 'Deploy via Inabalável💔',
          content: btoa(unescape(encodeURIComponent(htmlContent))),
          sha: sha || undefined
        })
      });

      if (!pushRes.ok) throw new Error('Erro ao enviar código para o GitHub.');

      // 3. Update project status in Firebase
      const docRef = doc(db, 'projects', project.id);
      await updateDoc(docRef, {
        status: 'published',
        githubUrl: repoUrl,
        updatedAt: new Date().toISOString()
      });

      setStep('success');
      onPublishSuccess();

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro inesperado.');
      setStep('github');
    } finally {
      setIsPublishing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[40px] p-8 md:p-12 overflow-hidden shadow-2xl"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white"
          >
            <X size={20} />
          </button>

          {step === 'donation' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Heart size={32} className="text-red-500 fill-red-500" />
              </div>
              <h2 className="text-3xl font-black tracking-tighter mb-4 uppercase">Apoie o Movimento</h2>
              <p className="text-white/60 mb-8 leading-relaxed">
                Para publicar seu projeto e exportar o código para o GitHub, pedimos uma doação voluntária. 
                Isso mantém o Inabalável vivo e sem limites para todos.
              </p>

              <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Smartphone className="text-purple-400" size={20} />
                  <span className="text-sm font-bold uppercase tracking-widest text-white/40">Chave Pix (Telefone)</span>
                </div>
                <div className="text-3xl font-black tracking-tight mb-6">{pixKey}</div>
                <button
                  onClick={handleCopy}
                  className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {copied ? <CheckCircle2 size={20} className="text-green-500" /> : <Copy size={20} />}
                  {copied ? 'COPIADO!' : 'COPIAR CHAVE'}
                </button>
              </div>

              <button 
                onClick={() => setStep('github')}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-red-600 text-white font-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-purple-500/20"
              >
                JÁ FIZ MINHA DOAÇÃO
              </button>
            </div>
          )}

          {step === 'github' && (
            <div>
              <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mb-6">
                <Github size={32} className="text-white" />
              </div>
              <h2 className="text-3xl font-black tracking-tighter mb-4 uppercase">Conectar GitHub</h2>
              <p className="text-white/60 mb-8 leading-relaxed">
                Vamos criar um repositório e enviar seu código. Precisamos de um Personal Access Token (Classic) com permissão de "repo".
              </p>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold mb-6">
                  {error}
                </div>
              )}

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Nome do Repositório</label>
                  <input 
                    type="text" 
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">GitHub Token</label>
                  <input 
                    type="password" 
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxx"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <a href="https://github.com/settings/tokens/new" target="_blank" rel="noopener noreferrer" className="text-[10px] text-purple-400 hover:underline mt-2 inline-block">
                    Criar um token no GitHub &rarr;
                  </a>
                </div>
              </div>

              <button 
                onClick={handlePublish}
                disabled={!githubToken.trim() || !repoName.trim()}
                className="w-full py-4 bg-white text-black font-black rounded-2xl hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                PUBLICAR E EXPORTAR
              </button>
            </div>
          )}

          {step === 'publishing' && (
            <div className="text-center py-12">
              <Loader2 size={48} className="animate-spin text-purple-500 mx-auto mb-6" />
              <h2 className="text-2xl font-black tracking-tighter mb-2 uppercase">Publicando...</h2>
              <p className="text-white/60">Criando repositório e enviando código para o GitHub.</p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
              <h2 className="text-3xl font-black tracking-tighter mb-4 uppercase">ESTÁ NO AR!</h2>
              <p className="text-white/60 mb-8">
                Seu projeto foi publicado e o código fonte está seguro no seu GitHub.
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={onClose}
                  className="flex-1 py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
                >
                  Fechar
                </button>
                <a 
                  href={`https://github.com/${repoName}`} // This is a fallback, actual URL is in project.githubUrl
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-4 bg-white text-black font-bold rounded-2xl hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                >
                  <Github size={18} /> Ver no GitHub
                </a>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
