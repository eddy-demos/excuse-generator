export default function Severity({ value }) {
  return (
    <span className="text-sm" title={`Severity ${value}/5`}>
      {'🔥'.repeat(value)}
      <span className="text-slate-300">{'🔥'.repeat(5 - value)}</span>
    </span>
  );
}
