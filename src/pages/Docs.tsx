import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, CheckCircle, Zap, BrainCircuit } from 'lucide-react';

export default function Docs() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black tracking-tighter">Documentação Inabalável</h1>
        <p className="text-white/60">O mapa da nossa evolução técnica e estratégica.</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-bold">
          <span className="text-red-500">⚠️</span>
          <span>🤝</span>
          <span className="text-white/80">"inabalavel💔"</span>
        </div>
      </div>

      <div className="grid gap-6">
        <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="text-emerald-500" />
            <h2 className="text-xl font-bold">O que já fizemos</h2>
          </div>
          <ul className="space-y-2 text-white/60 list-disc list-inside">
            <li>Autenticação robusta (Firebase: Google, GitHub, Email/Senha).</li>
            <li>Sistema de moedas e integração com Mercado Pago.</li>
            <li>Fluxo de publicação direta para GitHub.</li>
            <li>Interface moderna e responsiva com Tailwind CSS.</li>
            <li>Transições cinematográficas entre páginas.</li>
          </ul>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <BrainCircuit className="text-purple-500" />
            <h2 className="text-xl font-bold">O que estamos fazendo (Backend como Cérebro)</h2>
          </div>
          <p className="text-white/60">
            Estamos migrando a inteligência do app para o servidor. Em vez de o frontend decidir como criar um usuário, o backend (server.ts) agora orquestra essa lógica. Isso garante segurança, centralização de regras de negócio e um frontend muito mais leve.
          </p>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="text-amber-500" />
            <h2 className="text-xl font-bold">O que podemos evoluir</h2>
          </div>
          <ul className="space-y-2 text-white/60 list-disc list-inside">
            <li>Orquestração avançada de IA (RAG, cadeias de pensamento).</li>
            <li>Sistema de notificações em tempo real (WebSockets).</li>
            <li>Painel analítico detalhado no backend.</li>
            <li>Integração com mais provedores de pagamento e serviços.</li>
          </ul>
        </section>
      </div>
    </motion.div>
  );
}
