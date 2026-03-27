import React, { useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { Loader2 } from 'lucide-react';

// Initialize with your public key
const publicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;
if (publicKey) {
  initMercadoPago(publicKey, { locale: 'pt-BR' });
}

interface MercadoPagoButtonProps {
  title: string;
  price: number;
  quantity: number;
  coins: number;
  userId: string;
}

export const MercadoPagoButton: React.FC<MercadoPagoButtonProps> = ({ 
  title, 
  price, 
  quantity, 
  coins, 
  userId 
}) => {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuy = async () => {
    if (!publicKey) {
      setError('Chave pública do Mercado Pago não configurada.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          price,
          quantity,
          userId,
          coins,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.details || 'Erro ao criar preferência de pagamento');
      }

      const { init_point } = await response.json();
      
      // Instead of using the Wallet brick which requires a preferenceId from the backend
      // and can be complex to set up in a sandbox, we'll redirect directly to the init_point
      // which is the standard Mercado Pago Checkout Pro experience.
      window.location.href = init_point;
      
    } catch (err: any) {
      console.error('Mercado Pago Error:', err);
      setError(err.message || 'Ocorreu um erro ao processar o pagamento.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="p-3 mb-4 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl">
          {error}
        </div>
      )}
      
      <button
        onClick={handleBuy}
        disabled={isLoading}
        className="w-full py-4 px-6 bg-[#009EE3] hover:bg-[#008ED2] text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <>
            Pagar com Mercado Pago
            <img 
              src="https://http2.mlstatic.com/frontend-assets/sdk/mp-logo.svg" 
              alt="Mercado Pago" 
              className="h-5 brightness-0 invert"
              referrerPolicy="no-referrer"
            />
          </>
        )}
      </button>
      
      <p className="text-[10px] text-center text-white/20 mt-3 uppercase tracking-widest">
        Pagamento 100% Seguro via Mercado Pago
      </p>
    </div>
  );
};
