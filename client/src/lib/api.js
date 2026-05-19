const BASE = '/api/excuses';

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  list: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.category && params.category !== 'all') qs.set('category', params.category);
    if (params.sort) qs.set('sort', params.sort);
    const q = qs.toString();
    return request(`${BASE}${q ? `?${q}` : ''}`);
  },
  random: (category) => {
    const qs = category && category !== 'all' ? `?category=${category}` : '';
    return request(`${BASE}/random${qs}`);
  },
  get: (id) => request(`${BASE}/${id}`),
  create: (body) => request(BASE, { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  incrementUsed: (id) => request(`${BASE}/${id}/used`, { method: 'PATCH' }),
  remove: (id) => request(`${BASE}/${id}`, { method: 'DELETE' })
};

export const CATEGORIES = ['work', 'school', 'social', 'family', 'other'];
