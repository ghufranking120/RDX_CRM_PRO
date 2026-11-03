import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { apiRouter } from './server/routes';
import { whatsappService } from './server/whatsapp';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();

  // Parse CLI arguments: e.g. tsx server.ts --port 3000 --host 0.0.0.0
  let port = 3000;
  const portArgIndex = process.argv.indexOf('--port');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    port = parseInt(process.argv[portArgIndex + 1], 10);
  } else if (process.env.NODE_ENV === 'production' && process.env.PORT) {
    port = parseInt(process.env.PORT, 10);
  } else {
    // In dev / AI Studio environment, the server must run on port 3000
    port = 3000;
  }

  let host = '0.0.0.0';
  const hostArgIndex = process.argv.indexOf('--host');
  if (hostArgIndex !== -1 && process.argv[hostArgIndex + 1]) {
    host = process.argv[hostArgIndex + 1];
  }

  app.use(express.json());

  // Mount Comprehensive RDX CRM Production REST API (Auth, Multi-Tenant Data, Meta WhatsApp, n8n, Admin)
  app.use('/api', apiRouter);

  // Shared server-side Gemini client with required User-Agent
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Server-side Gemini AI Assistant endpoint for WhatsApp CRM
  app.post('/api/gemini/assist', async (req, res) => {
    try {
      const { action, customerMessage, tone, language, businessName } = req.body;

      if (!ai) {
        // Fallback smart response when API key is pending
        return res.json({
          reply: `Thank you for contacting ${businessName || 'our team'}. We have received your inquiry: "${customerMessage}". An agent will review the parameters and follow up shortly.`,
        });
      }

      let systemInstruction = `You are an expert WhatsApp CRM Customer Service Assistant for "${businessName || 'RDX CRM'}". Provide concise, helpful, and courteous replies formatted specifically for WhatsApp chat (use bullet points or emojis where appropriate).`;

      let prompt = '';
      if (action === 'summarize') {
        prompt = `Summarize this customer conversation into 3 concise bullet points for an internal CRM sales note:\n${customerMessage}`;
      } else if (action === 'translate') {
        prompt = `Translate the following customer message or reply into natural business ${language || 'Spanish'}:\n${customerMessage}`;
      } else {
        prompt = `Draft a ${tone || 'professional'} WhatsApp reply to this customer message:\n"${customerMessage}"`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({ reply: response.text });
    } catch (error: any) {
      console.error('Gemini Assist Error:', error?.message);
      return res.status(500).json({
        error: 'Failed to generate AI response',
        details: error?.message,
      });
    }
  });

  // Health probe
  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', platform: 'RDX CRM', timestamp: new Date().toISOString() });
  });

  // In development, hook Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : undefined,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  const server = app.listen(port, host, () => {
    console.log(`RDX CRM server running at http://${host}:${port}`);
    // Resume any pending Meta outbound message retries across restarts
    whatsappService.resumePendingRetries();
  });

  server.on('error', (err: any) => {
    console.error('Server listen error:', err);
  });
}

startServer();
