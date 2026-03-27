import express from "express";
import path from "path";
import fs from 'fs';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';
import { Octokit } from "octokit";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const PORT = 3000;

const httpServer = createServer(app);
let io: Server | null = null;

if (!process.env.VERCEL) {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  app.set("io", io);
}

app.use(express.json({ limit: '10mb' }));

// Helper function to get PayPal Access Token
async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials missing');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const data = await response.json();
  return data.access_token;
}

// API Routes
app.post("/api/publish", async (req, res) => {
  const { githubToken, repoOwner, repoName, files, commitMessage } = req.body;

  if (!githubToken || !repoOwner || !repoName || !files) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  try {
    const octokit = new Octokit({ auth: githubToken });

    // For simplicity, this assumes we are updating files.
    // In a real scenario, you'd need to handle creating/updating files more robustly.
    for (const file of files) {
      try {
        // Try to get the file to see if it exists
        const { data: existingFile } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
          owner: repoOwner,
          repo: repoName,
          path: file.path,
        });

        await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
          owner: repoOwner,
          repo: repoName,
          path: file.path,
          message: commitMessage || 'Update from Inabalável',
          content: Buffer.from(file.content).toString('base64'),
          sha: (existingFile as any).sha,
        });
      } catch (e) {
        // If file doesn't exist, create it
        await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
          owner: repoOwner,
          repo: repoName,
          path: file.path,
          message: commitMessage || 'Create from Inabalável',
          content: Buffer.from(file.content).toString('base64'),
        });
      }
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('Error publishing to GitHub:', error);
    res.status(500).json({ error: 'Erro ao publicar no GitHub', details: error.message });
  }
});

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

app.post("/api/update-icon", (req, res) => {
  const { iconUrl } = req.body;
  const manifestPath = path.join(process.cwd(), 'public', 'manifest.json');
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    manifest.icons[0].src = iconUrl;
    manifest.icons[1].src = iconUrl;
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating manifest:', error);
    res.status(500).json({ error: 'Failed to update manifest' });
  }
});

app.post("/api/paypal/create-order", async (req, res) => {
  try {
    const { price, coins, userId } = req.body;
    const accessToken = await getPayPalAccessToken();

    const response = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: `coins-${coins}-${userId}`,
            amount: {
              currency_code: 'BRL',
              value: price.toString(),
            },
            custom_id: JSON.stringify({ userId, coins })
          },
        ],
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error('PayPal create order error:', error);
    res.status(500).json({ error: 'Erro ao criar pedido no PayPal' });
  }
});

app.post("/api/paypal/capture-order", async (req, res) => {
  try {
    const { orderID } = req.body;
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    
    // Notify user via WebSocket
    if (data.status === 'COMPLETED') {
      const customId = data.purchase_units[0].payments.captures[0].custom_id;
      if (customId) {
        const { userId, coins } = JSON.parse(customId);
        const io = req.app.get("io");
        if (io) {
          io.to(userId).emit("notification", {
            title: "Pagamento Aprovado",
            message: `Você comprou ${coins} moedas com sucesso!`,
            type: "success"
          });
        }
      }
    }

    res.json(data);
  } catch (error: any) {
    console.error('PayPal capture error:', error);
    res.status(500).json({ error: 'Erro ao capturar pedido no PayPal' });
  }
});

const startServer = async () => {
  const isDev = process.env.NODE_ENV !== "production";
  console.log(`Server environment: NODE_ENV=${process.env.NODE_ENV}, isDev=${isDev}`);

  if (isDev) {
    console.log("Starting server in DEVELOPMENT mode with Vite middleware");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode (static serving)");
    const distPath = path.join(process.cwd(), 'dist');
    
    // Serve static files from dist
    app.use(express.static(distPath));
    
    // Handle SPA routing - serve index.html for all non-API routes
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Only listen if not running as a Vercel function
  if (!process.env.VERCEL) {
    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
};

// Only start the server if not running as a Vercel function
if (!process.env.VERCEL) {
  startServer();
}

export default app;
