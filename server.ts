import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Mercado Pago Configuration
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '' 
});

// API Routes
app.post("/api/create-preference", async (req, res) => {
  try {
    if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
      throw new Error('MERCADO_PAGO_ACCESS_TOKEN is not set');
    }
    const { title, price, quantity, userId, coins } = req.body;

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
          success: `${process.env.APP_URL || 'http://localhost:3000'}/dashboard?payment=success&coins=${coins}`,
          failure: `${process.env.APP_URL || 'http://localhost:3000'}/pricing?payment=failure`,
          pending: `${process.env.APP_URL || 'http://localhost:3000'}/pricing?payment=pending`,
        },
        auto_return: 'approved',
        external_reference: userId, // Pass userId to identify who bought
        metadata: {
          user_id: userId,
          coins: coins
        }
      }
    });

    res.json({ init_point: result.init_point });
  } catch (error) {
    console.error('Error creating preference:', error);
    res.status(500).json({ error: 'Failed to create payment preference' });
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

// Vite middleware for development
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
