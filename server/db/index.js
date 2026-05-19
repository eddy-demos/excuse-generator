import { JSONFilePreset } from 'lowdb/node';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFile = path.join(__dirname, 'excuses.json');

export const db = await JSONFilePreset(dbFile, { excuses: [] });
