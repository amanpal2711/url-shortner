import sqlite3 from 'sqlite3';
import type { UrlRow } from './types/index.js';

const db = new sqlite3.Database('urls.db');

// Helper to promisify get/all/run
const get = (sql: string, params: unknown[] = []): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err: Error | null, row: unknown) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const all = (sql: string, params: unknown[] = []): Promise<unknown[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err: Error | null, rows: unknown[]) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const run = (sql: string, params: unknown[] = []): Promise<{ lastID: number; changes: number }> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(this: sqlite3.RunResult, err: Error | null) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

// Initialize schema
export async function initDatabase(): Promise<void> {
  await run(`
    CREATE TABLE IF NOT EXISTS urls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      long_url TEXT NOT NULL,
      clicks INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME
    )
  `);
  
  await run(`CREATE INDEX IF NOT EXISTS idx_code ON urls(code)`);
  await run(`CREATE INDEX IF NOT EXISTS idx_created_at ON urls(created_at)`);
}

export const queries = {
  async findByCode(code: string): Promise<UrlRow | undefined> {
    return get('SELECT * FROM urls WHERE code = ?', [code]) as Promise<UrlRow | undefined>;
  },
  
  async findAll(): Promise<UrlRow[]> {
    return all('SELECT * FROM urls ORDER BY created_at DESC') as Promise<UrlRow[]>;
  },
  
  async insert(code: string, longUrl: string, expiresAt: string | null): Promise<number> {
    const result = await run('INSERT INTO urls (code, long_url, expires_at) VALUES (?, ?, ?)', 
      [code, longUrl, expiresAt]);
    return result.lastID;
  },
  
  async incrementClicks(code: string): Promise<void> {
    await run('UPDATE urls SET clicks = clicks + 1 WHERE code = ?', [code]);
  },
  
  async deleteByCode(code: string): Promise<number> {
    const result = await run('DELETE FROM urls WHERE code = ?', [code]);
    return result.changes;
  }
};

export default db;
