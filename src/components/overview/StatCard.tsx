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
      const current = Math.floor(progress * (endValue - startValue) + startValue);
      setDisplayValue(current);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);

  return (
    <div className="bg-[#1e293b] rounded-lg p-4 shadow-sm transition hover:shadow-md">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className={`mt-1 text-3xl font-semibold ${color}`}>
        {displayValue.toLocaleString()}
      </h2>
    </div>
  );
}
