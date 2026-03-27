import React, { useState } from 'react';
import PixDonation from '../components/PixDonation';
import { Coins, Zap, ShieldCheck } from 'lucide-react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { auth, db } from '../firebase';

const PACKAGES = [
  { id: 'basic', title: 'Iniciante', coins: 100, price: 10 },
  { id: 'pro', title: 'Profissional', coins: 500, price: 45, popular: true },
  { id: 'enterprise', title: 'Inabalável', coins: 2000, price: 150 },
];

export default function Pricing() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePayPalCreateOrder = async (data: any, actions: any, pkg: any) => {
    try {
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: pkg.price,
          coins: pkg.coins,
          userId: auth.currentUser?.uid
        })
      });
      const order = await response.json();
      return order.id;
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      throw error;
    }
  };

  const handlePayPalApprove = async (data: any, actions: any) => {
    try {
      setLoading(true);
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderID: data.orderID
        })
      });
      const result = await response.json();
      if (result.status === 'COMPLETED') {
        // Update user coins in Firestore
        if (auth.currentUser) {
          const { doc, getDoc, updateDoc } = await import('firebase/firestore');
          const userRef = doc(db, 'users', auth.currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const currentCoins = userSnap.data().coins || 0;
            const customId = result.purchase_units[0].payments.captures[0].custom_id;
            const { coins } = JSON.parse(customId);
            await updateDoc(userRef, {
              coins: currentCoins + coins
            });
          }
        }
        setSelectedPackage(null);
      }
    } catch (error) {
      console.error("Error capturing PayPal order:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
          Adquira mais <span className="text-yellow-500">Moedas</span>
        </h1>
        <p className="text-white/60 max-w-2xl mx-auto">
          As moedas são usadas para gerar novos projetos, componentes e utilizar a inteligência artificial.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PACKAGES.map((pkg) => (
          <div 
            key={pkg.id}
            className={`relative bg-[#111] border rounded-3xl p-8 flex flex-col transition-all ${
              pkg.popular ? 'border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.2)] scale-105' : 'border-white/10 hover:border-white/20'
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                Mais Popular
              </div>
            )}
            
            <h3 className="text-2xl font-bold mb-2">{pkg.title}</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-black">R$ {pkg.price}</span>
            </div>

            <div className="flex items-center gap-3 mb-8 p-4 bg-white/5 rounded-2xl">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center text-yellow-500">
                <Coins size={24} />
              </div>
              <div>
                <p className="font-bold text-lg">+{pkg.coins}</p>
                <p className="text-xs text-white/40 uppercase tracking-widest">Moedas Inabaláveis</p>
              </div>
            </div>

            <div className="mt-auto space-y-4">
              {selectedPackage === pkg.id ? (
                <div className="space-y-4">
                  <div className="relative z-0">
                    <PayPalButtons 
                      style={{ layout: "vertical", color: "gold", shape: "rect" }}
                      createOrder={(data, actions) => handlePayPalCreateOrder(data, actions, pkg)}
                      onApprove={handlePayPalApprove}
                      onCancel={() => setSelectedPackage(null)}
                    />
                  </div>
                  <button 
                    onClick={() => setSelectedPackage(null)}
                    className="w-full py-2 text-sm text-white/40 hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`w-full py-4 rounded-xl font-bold transition-all ${
                    pkg.popular 
                      ? 'bg-purple-500 text-white hover:bg-purple-600' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Comprar Agora
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-12 border-t border-white/10">
        <PixDonation />
      </div>
    </div>
  );
}
