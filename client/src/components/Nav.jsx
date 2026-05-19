import { Link, NavLink } from 'react-router-dom';

export default function Nav() {
  const linkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-md text-sm font-medium transition ${
      isActive ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-200'
    }`;

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-slate-900">
          🎲 Excuse Generator
        </Link>
        <nav className="flex items-center gap-2">
          <NavLink to="/" end className={linkClass}>Generate</NavLink>
          <NavLink to="/manage" className={linkClass}>Manage</NavLink>
        </nav>
      </div>
    </header>
  );
}
