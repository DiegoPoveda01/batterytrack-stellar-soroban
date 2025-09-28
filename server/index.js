import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import batteryRoutes from './routes/batteries.js';
import walletRoutes from './routes/wallet.js';

const app = express();
const PORT = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.set('json spaces', 2);

app.get('/', (_req, res) => {
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.send(`
    <h1>BatteryTrack API</h1>
    <p>Servidor en marcha. Endpoints útiles:</p>
    <ul>
      <li><a href="/health">/health</a> — estado del servidor</li>
      <li><code>GET /api/batteries</code></li>
      <li><code>POST /api/batteries</code></li>
      <li><code>POST /api/batteries/:id/estado</code></li>
      <li><a href="/api/batteries/events/all">/api/batteries/events/all</a></li>
    </ul>
    <p>Frontend (Vite) corre en <code>http://localhost:5173</code> o el puerto que muestre la consola (p. ej. 5174).</p>
    <p>Formato de respuesta API: <code>{ ok, data, meta? }</code> o <code>{ ok: false, error }</code></p>
  `);
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// Serve the real Stellar logo from project root without copying files
// (assets públicos servidos por el frontend en client/public)

app.use('/api/batteries', batteryRoutes);
app.use('/api/wallet', walletRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
