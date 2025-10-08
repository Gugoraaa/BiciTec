export default function SkeletonCard() {
    return (
      <div className="rounded-xl border border-slate-700/60 bg-slate-800/70 p-4 shadow-sm animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-5 w-20 bg-slate-700 rounded"></div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-16 bg-slate-700 rounded-full"></div>
            <div className="h-6 w-16 bg-slate-700 rounded-lg"></div>
          </div>
        </div>
        <div className="mt-2 h-4 w-3/4 bg-slate-700 rounded"></div>
        <div className="mt-4 h-3 w-24 bg-slate-700 rounded"></div>
      </div>
    );
  }