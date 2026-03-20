import React from 'react';
import { motion } from 'motion/react';
import { Coins, Zap, Sparkles, Check, ArrowRight, Heart } from 'lucide-react';
import { db, auth } from '../firebase';
import { doc, updateDoc, increment, setDoc } from 'firebase/firestore';

export default function Pricing() {
  const [loading, setLoading] = React.useState<string | null>(null);

  const handlePurchase = async (amount: number, coins: number) => {
    if (!auth.currentUser) return;
    setLoading(amount.toString());
    
    try {
      // Simulate payment success
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        coins: increment(coins)
      });

      const transactionId = Math.random().toString(36).substring(7);
      await setDoc(doc(db, 'transactions', transactionId), {
        id: transactionId,
        userId: auth.currentUser.uid,
        amount: coins,
        type: 'purchase',
        description: `Compra de ${coins} moedas`,
        createdAt: new Date().toISOString()
      });

      alert(`Sucesso! Você recebeu ${coins} moedas.`);
    } catch (error) {
      console.error("Erro na compra:", error);
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    { coins: 20, price: "R$ 19", popular: false, features: ["4 gerações completas", "IA básica", "Suporte via email"] },
    { coins: 100, price: "R$ 79", popular: true, features: ["20 gerações completas", "IA avançada", "Exportação ilimitada", "Sem marca d'água"] },
    { coins: 500, price: "R$ 299", popular: false, features: ["100 gerações completas", "IA ultra-rápida", "Suporte prioritário", "Acesso antecipado"] },
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">ABASTEÇA SUA <span className="text-purple-500">CRIATIVIDADE</span>.</h1>
        <p className="text-xl text-white/60">
          Inamável💔 usa um sistema de moedas justo: pague apenas pelo que usar. 
          Sem assinaturas mensais chatas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative p-8 rounded-[40px] border transition-all ${
              plan.popular 
                ? 'bg-gradient-to-b from-purple-500/20 to-transparent border-purple-500/50 shadow-2xl shadow-purple-500/10' 
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                Mais Popular
              </div>
            )}

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center">
                <Coins size={24} className="text-yellow-500" />
              </div>
              <div>
                <h3 className="text-2xl font-black">{plan.coins} Moedas</h3>
                <p className="text-sm text-white/40">Pacote {plan.coins > 100 ? 'Extraordinário' : 'Essencial'}</p>
              </div>
            </div>

            <div className="mb-8">
              <span className="text-4xl font-black">{plan.price}</span>
              <span className="text-white/40 ml-2">pagamento único</span>
            </div>

            <div className="space-y-4 mb-8">
              {plan.features.map((feature, j) => (
                <div key={j} className="flex items-center gap-3 text-sm text-white/80">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check size={12} className="text-green-500" />
                  </div>
                  {feature}
                </div>
              ))}
            </div>

            <button
              onClick={() => handlePurchase(parseInt(plan.price.replace('R$ ', '')), plan.coins)}
              disabled={loading !== null}
              className={`w-full py-4 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group ${
                plan.popular 
                  ? 'bg-white text-black hover:bg-white/90' 
                  : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
              }`}
            >
              {loading === plan.price.replace('R$ ', '') ? 'Processando...' : 'Comprar Agora'}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Usage Table */}
      <div className="max-w-2xl mx-auto bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-12">
        <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
          <Zap size={24} className="text-purple-400" />
          Como as moedas funcionam?
        </h3>
        <div className="space-y-6">
          {[
            { action: "Gerar novo site com IA", cost: 5, icon: Sparkles },
            { action: "Edição avançada com IA", cost: 2, icon: Zap },
            { action: "Exportar código fonte", cost: 10, icon: Heart },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <item.icon size={18} className="text-white/40" />
                </div>
                <span className="font-medium text-white/80">{item.action}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                <Coins size={12} className="text-yellow-500" />
                <span className="text-sm font-bold text-yellow-500">{item.cost}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
