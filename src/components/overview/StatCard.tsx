"use client";
import { useEffect, useState } from "react";

interface StatCardProps {
  title: string;
  value: number;
  color?: string;
}

export default function StatCard({
  title,
  value,
  color = "text-white",
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    const startValue = 0;
    const endValue = value;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / 500, 1);
      const current = Math.floor(
        progress * (endValue - startValue) + startValue
      );
      setDisplayValue(current);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);

  return (
    <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-6 shadow-lg border border-slate-600/50 transition-all duration-300 hover:shadow-2xl hover:border-slate-500 hover:-translate-y-1">
  <p className="text-gray-400 text-sm font-medium uppercase ">
    {title}
  </p>
  <h2 className={`mt-2 text-4xl font-bold ${color} drop-shadow-lg`}>
    {displayValue.toLocaleString()}
  </h2>
</div>
  );
}
