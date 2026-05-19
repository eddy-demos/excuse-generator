import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, CATEGORIES } from '../lib/api';
import { useToast } from '../components/Toast';

const MAX_LEN = 500;

export default function ExcuseForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const showToast = useToast();

  const [text, setText] = useState('');
  const [category, setCategory] = useState('work');
  const [severity, setSeverity] = useState(3);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const data = await api.get(id);
        setText(data.text);
        setCategory(data.category);
        setSeverity(data.severity);
      } catch (err) {
        showToast(err.message, 'error');
        navigate('/manage');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit, navigate, showToast]);

  const validate = () => {
    const errs = {};
    const trimmed = text.trim();
    if (trimmed.length < 1) errs.text = 'Excuse text is required';
    else if (trimmed.length > MAX_LEN) errs.text = `Max ${MAX_LEN} characters`;
    if (!CATEGORIES.includes(category)) errs.category = 'Invalid category';
    if (!Number.isInteger(severity) || severity < 1 || severity > 5) {
      errs.severity = 'Severity must be 1–5';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = { text: text.trim(), category, severity };
      if (isEdit) {
        await api.update(id, payload);
        showToast('Updated');
      } else {
        await api.create(payload);
        showToast('Created');
      }
      navigate('/manage');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center text-slate-400 py-12">Loading…</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        {isEdit ? 'Edit Excuse' : 'New Excuse'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Excuse text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={MAX_LEN}
            rows={4}
            placeholder="My toaster filed a workplace complaint..."
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-red-600">{errors.text || ''}</span>
            <span className="text-xs text-slate-400">{text.length}/{MAX_LEN}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c[0].toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
          {errors.category && <span className="text-xs text-red-600 mt-1 block">{errors.category}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Severity: <span className="font-normal">{'🔥'.repeat(severity)} ({severity}/5)</span>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={severity}
            onChange={(e) => setSeverity(parseInt(e.target.value, 10))}
            className="w-full accent-indigo-600"
          />
          {errors.severity && <span className="text-xs text-red-600 mt-1 block">{errors.severity}</span>}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => navigate('/manage')}
            disabled={submitting}
            className="px-4 py-2 rounded-md border border-slate-300 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitting ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
