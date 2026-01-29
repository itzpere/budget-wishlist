import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import { mkdirSync, existsSync } from 'fs';
import path from 'path';

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function initDb() {
  if (_db) return _db;

  // Use environment variable if set, otherwise use default
  const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'data');
  
  try {
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }
  } catch (error) {
    console.error('Failed to create data directory:', error);
    console.error('Current working directory:', process.cwd());
    console.error('Attempted data directory:', dataDir);
    throw error;
  }

  const dbPath = path.join(dataDir, 'sqlite.db');
  console.log('Opening database at:', dbPath);
  
  try {
    const sqlite = new Database(dbPath);
    sqlite.pragma('journal_mode = WAL');
    _db = drizzle(sqlite, { schema });
    console.log('Database initialized successfully');
    return _db;
  } catch (error) {
    console.error('Failed to open database:', error);
    console.error('Database path:', dbPath);
    throw error;
  }
}

// Lazy initialization using Proxy
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(target, prop) {
    const instance = initDb();
    return instance[prop as keyof typeof instance];
  }
});
