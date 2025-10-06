'use client'
import { useEffect, useState } from 'react';

export default function StationCapacityCard({
  title = "Station Capacity",
  data = [
    { name: "Station A", value: 90 },
    { name: "Station B", value: 82 },
    { name: "Station C", value: 75 },
    { name: "Station D", value: 60 },
    { name: "Station E", value: 55 },
  ],
}) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Start animation after a brief delay
    const startDelay = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    const duration = 1200;
    let start: number | null = null;
    let rafId: number;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const newProgress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - newProgress, 3);
      setProgress(eased);
      
      if (newProgress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      clearTimeout(startDelay);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="w-full h-full rounded-2xl bg-[#1e293b] p-5 text-slate-200 shadow-lg flex flex-col">
      <h3 
        className={`text-lg font-semibold tracking-tight mb-4 transition-all duration-700 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
      >
        {title}
      </h3>
      <ul className="space-y-3 flex-1 overflow-y-auto pr-2 -mt-1">
        {data.map((item, index) => {
          const animatedValue = Math.round(item.value * progress);
          const delay = index * 100;
          
          return (
            <li 
              key={item.name}
              className={`transition-all duration-700`}
              style={{ 
                transitionDelay: `${delay}ms`,
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateX(0)' : 'translateX(-20px)'
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-300">{item.name}</span>
                <span className="text-sm font-medium text-slate-200 tabular-nums">
                  {animatedValue}%
                </span>
              </div>
              <div
                className="h-2 w-full rounded-full bg-slate-700/70 overflow-hidden"
                aria-hidden="true"
              >
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 relative overflow-hidden"
                  style={{ width: `${animatedValue}%` }}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={animatedValue}
                  aria-label={`${item.name} capacity`}
                >
                  {/* Shimmer effect */}
                  <div 
                    className="absolute inset-0 -translate-x-full animate-[shimmer_2s_ease-in-out_infinite]"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      animationDelay: `${delay + 300}ms`
                    }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </div>
  );
}