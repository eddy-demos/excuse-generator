import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { db } from '../db/index.js';

const router = Router();

const CATEGORIES = ['work', 'school', 'social', 'family', 'other'];

function validatePayload(body, { partial = false } = {}) {
  const errors = [];
  const out = {};

  if (body.text !== undefined) {
    if (typeof body.text !== 'string') errors.push('text must be a string');
    else {
      const trimmed = body.text.trim();
      if (trimmed.length < 1 || trimmed.length > 500) {
        errors.push('text must be 1–500 characters');
      } else {
        out.text = trimmed;
      }
    }
  } else if (!partial) {
    errors.push('text is required');
  }

  if (body.category !== undefined) {
    if (!CATEGORIES.includes(body.category)) {
      errors.push(`category must be one of: ${CATEGORIES.join(', ')}`);
    } else {
      out.category = body.category;
    }
  } else if (!partial) {
    errors.push('category is required');
  }

  if (body.severity !== undefined) {
    const n = Number(body.severity);
    if (!Number.isInteger(n) || n < 1 || n > 5) {
      errors.push('severity must be an integer 1–5');
    } else {
      out.severity = n;
    }
  } else if (!partial) {
    errors.push('severity is required');
  }

  return { errors, data: out };
}

// GET /api/excuses?category=&sort=
router.get('/', (req, res) => {
  let items = [...db.data.excuses];
  const { category, sort } = req.query;

  if (category && category !== 'all') {
    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ error: 'invalid category' });
    }
    items = items.filter(e => e.category === category);
  }

  if (sort === 'timesUsed') {
    items.sort((a, b) => b.timesUsed - a.timesUsed);
  } else {
    // default: newest first
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  res.json(items);
});

// GET /api/excuses/random?category=
router.get('/random', (req, res) => {
  let items = db.data.excuses;
  const { category } = req.query;

  if (category && category !== 'all') {
    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ error: 'invalid category' });
    }
    items = items.filter(e => e.category === category);
  }

  if (items.length === 0) {
    return res.status(404).json({ error: 'no excuses found' });
  }

  const pick = items[Math.floor(Math.random() * items.length)];
  res.json(pick);
});

// GET /api/excuses/:id
router.get('/:id', (req, res) => {
  const excuse = db.data.excuses.find(e => e.id === req.params.id);
  if (!excuse) return res.status(404).json({ error: 'not found' });
  res.json(excuse);
});

// POST /api/excuses
router.post('/', async (req, res) => {
  const { errors, data } = validatePayload(req.body);
  if (errors.length) return res.status(400).json({ error: errors.join('; ') });

  const now = new Date().toISOString();
  const excuse = {
    id: uuid(),
    text: data.text,
    category: data.category,
    severity: data.severity,
    timesUsed: 0,
    createdAt: now,
    updatedAt: now
  };
  db.data.excuses.push(excuse);
  await db.write();
  res.status(201).json(excuse);
});

// PUT /api/excuses/:id
router.put('/:id', async (req, res) => {
  const idx = db.data.excuses.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });

  const { errors, data } = validatePayload(req.body, { partial: true });
  if (errors.length) return res.status(400).json({ error: errors.join('; ') });

  db.data.excuses[idx] = {
    ...db.data.excuses[idx],
    ...data,
    updatedAt: new Date().toISOString()
  };
  await db.write();
  res.json(db.data.excuses[idx]);
});

// PATCH /api/excuses/:id/used
router.patch('/:id/used', async (req, res) => {
  const idx = db.data.excuses.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });

  db.data.excuses[idx].timesUsed += 1;
  db.data.excuses[idx].updatedAt = new Date().toISOString();
  await db.write();
  res.json(db.data.excuses[idx]);
});

// DELETE /api/excuses/:id
router.delete('/:id', async (req, res) => {
  const idx = db.data.excuses.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });

  db.data.excuses.splice(idx, 1);
  await db.write();
  res.status(204).end();
});

export default router;
