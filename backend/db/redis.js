import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const DB_FILE = path.join(process.cwd(), 'redis_polyfill.json');

const loadStore = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return new Map(JSON.parse(data));
    }
  } catch (err) {
    console.error('Failed to load redis polyfill data:', err);
  }
  return new Map();
};

const saveStore = (storeMap) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(Array.from(storeMap.entries())));
  } catch (err) {
    console.error('Failed to save redis polyfill data:', err);
  }
};

const store = loadStore();

const redisClient = {
  connect: async () => console.log('✅ Redis polyfill (File-System Persisted) connected'),
  on: (event, handler) => { /* Dummy */ },

  // ── String ops ──
  get: async (key) => {
    const item = store.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      store.delete(key);
      saveStore(store);
      return null;
    }
    return item.value;
  },
  setEx: async (key, seconds, value) => {
    store.set(key, { value, expiresAt: Date.now() + seconds * 1000 });
    saveStore(store);
    return 'OK';
  },
  set: async (key, value) => {
    store.set(key, { value });
    saveStore(store);
    return 'OK';
  },
  del: async (key) => {
    store.delete(key);
    saveStore(store);
    return 1;
  },

  // ── List ops (for salary chat history etc.) ──
  rPush: async (key, ...values) => {
    const item = store.get(key);
    const list = (item && Array.isArray(item.value)) ? item.value : [];
    for (const v of values) list.push(v);
    store.set(key, { value: list, expiresAt: item?.expiresAt });
    saveStore(store);
    return list.length;
  },
  lRange: async (key, start, stop) => {
    const item = store.get(key);
    if (!item || !Array.isArray(item.value)) return [];
    const list = item.value;
    const end = stop === -1 ? list.length : stop + 1;
    return list.slice(start, end);
  },
  lTrim: async (key, start, stop) => {
    const item = store.get(key);
    if (!item || !Array.isArray(item.value)) return 'OK';
    const list = item.value;
    const end = stop === -1 ? list.length : stop + 1;
    store.set(key, { value: list.slice(start, end), expiresAt: item?.expiresAt });
    saveStore(store);
    return 'OK';
  },

  // ── Expiry ──
  expire: async (key, seconds) => {
    const item = store.get(key);
    if (!item) return 0;
    store.set(key, { ...item, expiresAt: Date.now() + seconds * 1000 });
    saveStore(store);
    return 1;
  },
};

await redisClient.connect();

export default redisClient;
