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
  }
};

await redisClient.connect();

export default redisClient;
