export default function Card({ children }: { children: React.ReactNode }) {
    return <div className="rounded-xl border border-slate-700/60 bg-slate-800/70 p-4 shadow-sm">{children}</div>;
  }