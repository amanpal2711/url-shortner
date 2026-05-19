import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { queries, initDatabase } from './database.js';
import { generateCode, isValidCode } from './utils/generateCode.js';
import { isValidUrl } from './utils/validateUrl.js';
import type { CreateUrlRequest, Url, UrlRow } from './types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from client dist in production
const distPath = path.join(__dirname, '../../client/dist');
app.use(express.static(distPath));

// Helper to convert DB row to URL object
function rowToUrl(row: UrlRow): Url {
  return {
    id: row.id,
    code: row.code,
    longUrl: row.long_url,
    clicks: row.clicks,
    createdAt: row.created_at,
    expiresAt: row.expires_at
  };
}

// POST /api/shorten - Create short URL
app.post('/api/shorten', async (req: Request, res: Response) => {
  const { longUrl, customAlias, expiresAt }: CreateUrlRequest = req.body;

  // Validate URL
  if (!longUrl || !isValidUrl(longUrl)) {
    return res.status(400).json({ error: 'Invalid URL provided' });
  }

  let code = customAlias?.trim();
  const isCustom = !!code;

  // Validate custom alias
  if (isCustom && code) {
    if (!isValidCode(code)) {
      return res.status(400).json({
        error: 'Custom alias must be 3-20 characters (alphanumeric, underscore, hyphen only)'
      });
    }
  } else {
    code = generateCode();
  }

  try {
    // Check for duplicates
    const existing = await queries.findByCode(code);
    if (existing) {
      return res.status(409).json({
        error: isCustom ? 'Custom alias already taken' : 'Code conflict, please retry'
      });
    }

    // Insert into database
    await queries.insert(code, longUrl, expiresAt || null);

    res.status(201).json({
      shortUrl: `http://localhost:${PORT}/${code}`,
      code
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to create short URL' });
  }
});

// GET /api/urls - Get all URLs
app.get('/api/urls', async (_req: Request, res: Response) => {
  try {
    const rows = await queries.findAll();
    const urls: Url[] = rows.map(rowToUrl);
    res.json(urls);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch URLs' });
  }
});

// DELETE /api/urls/:code - Delete a URL
app.delete('/api/urls/:code', async (req: Request, res: Response) => {
  const { code } = req.params;

  try {
    const changes = await queries.deleteByCode(code);

    if (changes === 0) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to delete URL' });
  }
});

// GET /:code - Redirect to original URL
app.get('/:code', async (req: Request, res: Response) => {
  const { code } = req.params;

  try {
    const row = await queries.findByCode(code);

    if (!row) {
      // Return 404 page for browser requests
      if (req.headers.accept?.includes('text/html')) {
        return res.status(404).sendFile(path.join(distPath, 'index.html'));
      }
      return res.status(404).json({ error: 'Short URL not found' });
    }

    // Check expiry
    if (row.expires_at && new Date(row.expires_at) < new Date()) {
      if (req.headers.accept?.includes('text/html')) {
        return res.status(410).sendFile(path.join(distPath, 'index.html'));
      }
      return res.status(410).json({ error: 'This link has expired' });
    }

    // Increment clicks
    await queries.incrementClicks(code);

    // Redirect
    res.redirect(row.long_url);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to redirect' });
  }
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// SPA fallback - serve index.html for all non-API routes
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Initialize database and start server
async function startServer() {
  try {
    await initDatabase();
    console.log('Database initialized');
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
