import { useEffect, useState } from 'react';
import { api, CATEGORIES } from '../lib/api';
import { copyToClipboard } from '../lib/clipboard';
import { useToast } from '../components/Toast';
import CategoryTag from '../components/CategoryTag';
import Severity from '../components/Severity';

export default function GeneratePage() {
  const [category, setCategory] = useState('all');
  const [excuse, setExcuse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);
  const showToast = useToast();

  const fetchRandom = async () => {
    setLoading(true);
    setEmpty(false);
    try {
      const data = await api.random(category);
      setExcuse(data);
    } catch (err) {
      if (err.message.includes('no excuses')) {
        setExcuse(null);
        setEmpty(true);
      } else {
        showToast(err.message, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = async () => {
    if (!excuse) return;
    const ok = await copyToClipboard(excuse.text);
    if (ok) {
      showToast('Copied!');
      try {
        const updated = await api.incrementUsed(excuse.id);
        setExcuse(updated);
      } catch (err) {
        // silent — the copy still worked
        console.error(err);
      }
    } else {
      showToast('Copy failed', 'error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <h1 className="text-2xl font-bold text-slate-900">Need an excuse?</h1>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c[0].toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
      </div>

      <button
        onClick={fetchRandom}
        disabled={loading}
        className="w-full mb-6 py-4 rounded-xl bg-indigo-600 text-white font-semibold text-lg shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading ? 'Generating…' : '🎲 Generate Random Excuse'}
      </button>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 min-h-[180px] flex flex-col justify-between">
        {empty ? (
          <div className="text-center text-slate-500 py-8">
            <p className="text-lg mb-2">No excuses yet 🤷</p>
            <p className="text-sm">
              {category === 'all'
                ? 'Add your first excuse to get started.'
                : `No excuses in "${category}". Try another category or add one.`}
            </p>
          </div>
        ) : excuse ? (
          <>
            <p className="text-xl text-slate-800 leading-relaxed mb-4">"{excuse.text}"</p>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <CategoryTag category={excuse.category} />
                <Severity value={excuse.severity} />
                <span className="text-xs text-slate-400">used {excuse.timesUsed}×</span>
              </div>
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition"
              >
                📋 Copy to Clipboard
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-slate-400 py-8">Loading…</div>
        )}
      </div>
    </div>
  );
}
