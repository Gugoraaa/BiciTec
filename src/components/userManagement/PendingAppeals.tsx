"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { FaSpinner } from "react-icons/fa";
import api from "@/lib/api";
import { Appeal, AppealApiResponse } from "@/types/userManagement";

interface PendingAppealsProps {
  onReview: (appealId: number, appealText: string, appealerId: number) => void;
  className?: string;
}

export default function PendingAppeals({
  onReview,
  className = "",
}: PendingAppealsProps) {
  const { user } = useAuth();
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppeals = async () => {
      if (!user) return;

      try {
        const response = await api.get("/user/getAppeals");
        const data = response.data;
        
        
        const formattedAppeals = data.map((appeal: AppealApiResponse) => {
          // Safely extract the user ID from various possible properties
          const userId = appeal.userId || appeal.usuarioId || appeal.user?.id || 0;
          
          // Create a properly typed appeal object
          const formattedAppeal: Appeal = {
            id: appeal.id,
            mensaje: appeal.mensaje,
            fecha: appeal.fecha,
            nombre: appeal.nombre,
            apellido: appeal.apellido,
            userId: userId,
            type: appeal.type || "Appeal",
            who: `${appeal.nombre || ''} ${appeal.apellido || ''}`.trim() || 'Usuario desconocido',
            text: appeal.mensaje || '',
            when: new Date(appeal.fecha).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          };
          
          return formattedAppeal;
        });
        setAppeals(formattedAppeals);
      } catch (err) {
        console.error("Error fetching appeals:", err);
        setError("Failed to load appeals. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppeals();
  }, [user]);

  if (!user) return null;

  return (
    <aside
      className={`h-fit bg-slate-900/60 border border-slate-800 rounded-2xl p-4 lg:sticky lg:top-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Pending Appeals</h2>
        <span className="inline-flex items-center justify-center size-6 rounded-full text-xs font-medium bg-[color:var(--bt-blue,#2563eb)]/20 text-[color:var(--bt-blue,#2563eb)]">
          {appeals.length}
        </span>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <FaSpinner className="animate-spin text-blue-500 text-xl" />
          </div>
        ) : error ? (
          <div className="text-red-400 text-center p-4">{error}</div>
        ) : appeals.length > 0 ? (
          appeals.map((appeal) => (
            <div
              key={appeal.id}
              className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium text-slate-100">{appeal.who}</div>
                  <div className="text-slate-400 text-sm">{appeal.type}</div>
                </div>
                <div className="text-xs text-slate-500">{appeal.when}</div>
              </div>
              <blockquote className="relative pl-3 mt-3 text-sm text-slate-300 border-l-2 border-[color:var(--bt-blue,#2563eb)]">
                {appeal.text}
              </blockquote>
              <button
                onClick={() => onReview(appeal.id, appeal.text, appeal.userId)}
                className="mt-4 w-full rounded-xl bg-[color:var(--bt-blue,#2563eb)] py-2 text-sm font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[color:var(--bt-blue,#2563eb)]/40 transition-opacity"
              >
                Review
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-slate-400">
            No pending appeals
          </div>
        )}
      </div>
    </aside>
  );
}
