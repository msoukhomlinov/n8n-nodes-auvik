import { promises as fs } from 'fs';
import * as path from 'path';
import * as os from 'os';

type Serializable = unknown;

type CacheRecord = {
  expiresAt: number;
  value: Serializable;
};

type CacheFileSchema = Record<string, CacheRecord>;

const CACHE_DIR = path.join(os.tmpdir(), 'n8n-nodes-auvik');
const CACHE_FILE = path.join(CACHE_DIR, 'kv-cache.json');

async function ensureCacheFileExists(): Promise<void> {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.access(CACHE_FILE).catch(async () => {
      await fs.writeFile(CACHE_FILE, JSON.stringify({}), 'utf8');
    });
  } catch {
    // ignore
  }
}

async function readCacheFile(): Promise<CacheFileSchema> {
  await ensureCacheFileExists();
  try {
    const raw = await fs.readFile(CACHE_FILE, 'utf8');
    const parsed = JSON.parse(raw) as CacheFileSchema;
    return parsed ?? {};
  } catch {
    return {};
  }
}

async function writeCacheFile(data: CacheFileSchema): Promise<void> {
  await ensureCacheFileExists();
  await fs.writeFile(CACHE_FILE, JSON.stringify(data), 'utf8');
}

export const kvFileCache = {
  async get<T = unknown>(key: string): Promise<T | undefined> {
    const data = await readCacheFile();
    const entry = data[key];
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      delete data[key];
      await writeCacheFile(data);
      return undefined;
    }
    return entry.value as T;
  },
  async set<T = unknown>(key: string, value: T, ttlMs: number): Promise<void> {
    const data = await readCacheFile();
    data[key] = { value, expiresAt: Date.now() + ttlMs };
    await writeCacheFile(data);
  },
  async delete(key: string): Promise<void> {
    const data = await readCacheFile();
    delete data[key];
    await writeCacheFile(data);
  },
  async clear(): Promise<void> {
    await writeCacheFile({});
  },
};

export function buildCacheKey(parts: Array<string | number | boolean | undefined | null>): string {
  return parts.map((p) => (p === undefined || p === null ? '' : String(p))).join('|');
}


