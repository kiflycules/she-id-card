export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="border-b border-navy-100 bg-white px-8 py-5">
      <div className="text-xs font-bold uppercase tracking-[0.14em] text-amber-600">
        SHE ID Card
      </div>
      <h1 className="font-display text-xl font-extrabold text-navy-800">{title}</h1>
      {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
    </div>
  );
}
