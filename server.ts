import express from "express";
import path from "path";
import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes
app.post("/api/create-preference", async (req, res) => {
  try {
    const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (!token) {
      console.error('MERCADO_PAGO_ACCESS_TOKEN is missing');
      return res.status(500).json({ 
        error: 'Configuração incompleta', 
        details: 'MERCADO_PAGO_ACCESS_TOKEN não configurado no servidor.' 
      });
    }

    const client = new MercadoPagoConfig({ accessToken: token });
    const { title, price, quantity, userId, coins } = req.body;

    const baseUrl = process.env.APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: [
          {
            id: `coins-${coins}`,
            title: title,
            unit_price: Number(price),
            quantity: Number(quantity),
            currency_id: 'BRL'
          }
        ],
        back_urls: {
          success: `${baseUrl}/dashboard?payment=success&coins=${coins}`,
          failure: `${baseUrl}/pricing?payment=failure`,
          pending: `${baseUrl}/pricing?payment=pending`,
        },
        auto_return: 'approved',
        external_reference: userId,
        metadata: {
          user_id: userId,
          coins: coins
        }
      }
    });

    if (!result.init_point) {
      throw new Error('Mercado Pago não retornou o ponto de início (init_point)');
    }

    res.json({ init_point: result.init_point });
  } catch (error: any) {
    console.error('Error creating preference:', error);
    res.status(500).json({ 
      error: 'Erro ao criar preferência', 
      details: error.message || 'Erro interno no servidor de pagamento'
    });
  }
});

// Webhook for Mercado Pago (to confirm payment)
app.post("/api/webhook", async (req, res) => {
  // In a real app, you would verify the payment here and update the user's coins in Firestore
  // Since we don't have a public URL for webhooks in this environment, 
  // we'll rely on the client-side success callback for this demo, 
  // but this is where the real logic should be.
  console.log('Webhook received:', req.body);
  res.sendStatus(200);
});

const startServer = async () => {
  // Only use Vite in development and when NOT on Vercel
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    // Static serving only for non-Vercel production (like local production build)
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Only listen if not running as a Vercel function
  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
};

startServer();

export default app;
