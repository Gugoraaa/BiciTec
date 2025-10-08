export default function LoadingScreen() {
    return (
      <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-700 border-t-sky-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin mx-auto" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
          </div>
          <p className="text-slate-400 text-sm animate-pulse">Loading reports...</p>
        </div>
      </div>
    );
  }