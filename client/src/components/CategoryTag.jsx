const COLORS = {
  work: 'bg-blue-100 text-blue-700',
  school: 'bg-purple-100 text-purple-700',
  social: 'bg-pink-100 text-pink-700',
  family: 'bg-amber-100 text-amber-700',
  other: 'bg-slate-100 text-slate-700'
};

export default function CategoryTag({ category }) {
  const cls = COLORS[category] || COLORS.other;
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${cls}`}>
      {category}
    </span>
  );
}
