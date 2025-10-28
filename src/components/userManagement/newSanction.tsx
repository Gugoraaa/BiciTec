import React, { useState } from "react";
import { FaTimes, FaSearch } from "react-icons/fa";

interface IssueNewSanctionProps {
  onClose: () => void;
}

export default function IssueNewSanction({ onClose }: IssueNewSanctionProps) {
  const [type, setType] = useState("Warning");
  const [reason, setReason] = useState("");
  const [user, setUser] = useState("");

  return (
    
      <div className="bg-gray-800 border border-slate-800 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Issue New Sanction</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200"
          >
            <FaTimes />
          </button>
        </div>

        {/* Select User */}
        <label className="block text-sm text-slate-400 mb-1">Select User</label>
        <div className="relative mb-4">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 size-4" />
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Search by name or ID..."
            className="w-full bg-gray-700 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[color:var(--bt-blue,#2563eb)]/40 mb-2"
          />
        </div>

        {/* Type of Sanction */}
        <label className="block text-sm text-slate-400 mb-1">Type of Sanction</label>
        <div className="flex bg-gray-700 border border-slate-800 rounded-xl mb-4 overflow-hidden">
          <button
            onClick={() => setType("Warning")}
            className={`flex-1 py-2 text-sm font-medium ${
              type === "Warning"
                ? "bg-[color:var(--bt-blue,#2563eb)] text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            Warning
          </button>
          <button
            onClick={() => setType("Ban")}
            className={`flex-1 py-2 text-sm font-medium ${
              type === "Ban"
                ? "bg-[color:var(--bt-blue,#2563eb)] text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            Ban
          </button>
        </div>

        {/* Reason */}
        <label className="block text-sm text-slate-400 mb-1">Reason for Sanction</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g., Bike left outside designated area"
          rows={4}
          className="w-full bg-gray-700 border border-slate-800 rounded-xl p-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[color:var(--bt-blue,#2563eb)]/40 mb-4"
        />

        {/* Submit Button */}
        <button
          className="w-full py-2 rounded-xl bg-[color:var(--bt-blue,#2563eb)] text-white font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[color:var(--bt-blue,#2563eb)]/40"
        >
          Submit Sanction
        </button>
      </div>
    
  );
}
