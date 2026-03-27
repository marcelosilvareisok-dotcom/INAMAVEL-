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

const isProd = process.env.NODE_ENV === "production" || !!process.env.VERCEL;

if (isProd) {
  console.log("Starting server in PRODUCTION mode (static serving)");
  const distPath = path.join(process.cwd(), 'dist');
  
  // Serve static files from dist
  app.use(express.static(distPath));
  
  // Handle SPA routing - serve index.html for all non-API routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Frontend not found. Please run build first.');
    }
  });
} else {
  console.log("Starting server in DEVELOPMENT mode with Vite middleware");
  const startDevServer = async () => {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.error("Failed to start Vite dev server:", e);
    }
  };
  startDevServer();
}

// Only listen if not running as a Vercel function
if (!process.env.VERCEL) {
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
