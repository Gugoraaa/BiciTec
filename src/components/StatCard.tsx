'use client'

export default function StatCard({ title, value, color = "text-white" }: { title: string; value: number; color?: string }) {
    return (
      <div className="bg-[#1e293b] rounded-lg p-4 shadow-sm ">
        <p className="text-gray-400 text-sm">{title}</p>
        <h2 className={`mt-1 text-3xl font-semibold ${color}`}>{value}</h2>
      </div>
    );
  }
  