import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useToast } from '../components/Toast';
import CategoryTag from '../components/CategoryTag';
import Severity from '../components/Severity';

export default function ManagePage() {
  const [excuses, setExcuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('createdAt');
  const [deletingId, setDeletingId] = useState(null);
  const showToast = useToast();
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.list({ sort });
      setExcuses(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this excuse?')) return;
    setDeletingId(id);
    try {
      await api.remove(id);
      setExcuses((cur) => cur.filter((e) => e.id !== id));
      showToast('Deleted');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <h1 className="text-2xl font-bold text-slate-900">Manage Excuses</h1>
        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="createdAt">Newest first</option>
            <option value="timesUsed">Most used</option>
          </select>
          <button
            onClick={() => navigate('/new')}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
          >
            + Add Excuse
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-slate-400 py-12">Loading…</div>
      ) : excuses.length === 0 ? (
        <div className="text-center text-slate-500 py-12 bg-white rounded-xl border border-slate-200">
          <p className="mb-4">No excuses yet.</p>
          <Link to="/new" className="text-indigo-600 hover:underline">Add your first one →</Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Excuse</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Severity</th>
                <th className="px-4 py-3 font-medium">Used</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {excuses.map((e) => (
                <tr key={e.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-slate-800 max-w-md">{e.text}</td>
                  <td className="px-4 py-3"><CategoryTag category={e.category} /></td>
                  <td className="px-4 py-3"><Severity value={e.severity} /></td>
                  <td className="px-4 py-3 text-slate-600">{e.timesUsed}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link
                      to={`/edit/${e.id}`}
                      className="text-indigo-600 hover:underline mr-3"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(e.id)}
                      disabled={deletingId === e.id}
                      className="text-red-600 hover:underline disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
