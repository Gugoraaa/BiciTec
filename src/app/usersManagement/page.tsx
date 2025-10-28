'use client'
import React, { useState } from "react";
import { FaSearch, FaPlus, FaEllipsisV, FaExclamationTriangle, FaEnvelope, FaBan, FaCheckCircle } from "react-icons/fa";
import dynamic from 'next/dynamic';

const IssueNewSanction = dynamic(() => import('@/components/userManagement/newSanction'), {
  ssr: false,
});

const ReviewUserAppeal = dynamic(() => import('@/components/userManagement/appealModal'), {
  ssr: false,
});



const users = [
  {
    userId: "A01743885",
    name: "Olivia ",
    lastName: "Chen",
    status: "Banned" as const,
    creationDate: "2023-10-25",
  },
  {
    userId: "A01743886",
    name: "Liam Rodriguez",
    lastName: "Rodriguez",
    status: "Warned" as const,
    creationDate: "2023-10-26",
  },
  {
    userId: "A01743887",
    name: "Ava",
    lastName: "Nguyen",
    status: "Active" as const,
    creationDate: "2023-10-27",
  },
  {
    userId: "A01743888",
    name: "Noah",
    lastName: "Patel",
    status: "Active" as const,
    creationDate: "2023-10-28",
  },
];

const appeals = [
  {
    who: "John Doe",
    when: "2h ago",
    type: "Appeal for 7-day ban",
    text:
      "I believe the ban was a misunderstanding. I was having trouble with the app's GPS and parked the bike...",
  },
  {
    who: "Jane Smith",
    when: "1 day ago",
    type: "Appeal for warning",
    text:
      "The bike was returned late due to a flat tire which was out of my control. I have photo evidence.",
  },
];

const StatusPill: React.FC<{ status: "Active" | "Warned" | "Banned" }> = ({ status }) => {
  const cfg =
    status === "Active"
      ? { bg: "bg-emerald-500/10", dot: "bg-emerald-400", text: "text-emerald-300" }
      : status === "Warned"
      ? { bg: "bg-yellow-500/10", dot: "bg-yellow-400", text: "text-yellow-300" }
      : { bg: "bg-rose-500/10", dot: "bg-rose-400", text: "text-rose-300" };
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${cfg.bg} ${cfg.text}`}>
      {status === 'Active' ? (
        <FaCheckCircle className="w-4 h-4" />
      ) : status === 'Warned' ? (
        <FaExclamationTriangle className="w-4 h-4" />
      ) : (
        <FaBan className="w-4 h-4" />
      )}
      {status}
    </span>
  );
};

type UserStatus = 'All' | 'Active' | 'Warned' | 'Banned';

export default function UserSanctionsBiciTecSkin() {
  const [isNewSanctionOpen, setIsNewSanctionOpen] = useState(false);
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus>('All');

  const openNewSanction = () => setIsNewSanctionOpen(true);
  const closeNewSanction = () => setIsNewSanctionOpen(false);
  const openAppealModal = () => setIsAppealModalOpen(true);
  const closeAppealModal = () => setIsAppealModalOpen(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const getButtonClass = (status: UserStatus) => {
    const baseClass = 'px-4 py-2 rounded-xl border transition-colors';
    const isActive = statusFilter === status;
    
    if (isActive) {
      return `${baseClass} bg-[color:var(--bt-blue,#2563eb)]/20 text-[color:var(--bt-blue,#2563eb)] border-[color:var(--bt-blue,#2563eb)]/30`;
    }
    return `${baseClass} bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-300`;
  };
  return (
    <div className="min-h-screen w-full text-slate-100">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">User Sanctions Management</h1>
        <button
          onClick={openNewSanction}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-[color:var(--bt-blue,#2563eb)] hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-[color:var(--bt-blue,#2563eb)]/40"
        >
          <FaPlus className="w-4 h-4" /> New Sanction
        </button>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 p-6">
        {/* Left column */}
        <section>
          {/* Filters bar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-3">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                placeholder="Search by student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/60 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-[color:var(--bt-blue,#2563eb)]/40 placeholder:text-slate-500 text-slate-200"
              />
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setStatusFilter('All')} 
                className={getButtonClass('All')}
              >
                All
              </button>
              <button 
                onClick={() => setStatusFilter('Banned')} 
                className={getButtonClass('Banned')}
              >
                Banned
              </button>
              <button 
                onClick={() => setStatusFilter('Warned')} 
                className={getButtonClass('Warned')}
              >
                Warned
              </button>
              <button 
                onClick={() => setStatusFilter('Active')} 
                className={getButtonClass('Active')}
              >
                Active
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
            <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] px-4 py-3 text-sm text-slate-400 border-b border-slate-800">
              
              <div>User ID</div>
              <div>Name</div>
              <div>Last Name</div>
              <div>Status</div>
              <div>Creation Date</div>
            </div>
            <ul className="divide-y divide-slate-800">
              {filteredUsers.length === 0 ? (
                <li key="no-results" className="text-center py-4 text-slate-400">No users found</li>
              ) : (
                filteredUsers.map((u) => (
                <li key={u.userId} className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] items-center px-4 py-4 hover:bg-slate-900">
                  <div className="font-medium text-slate-100">{u.userId}</div>
                  <div className="text-slate-300">{u.name}</div>
                  <div className="text-slate-300">{u.lastName}</div>
                  <div>
                    <StatusPill status={u.status} />
                  </div>
                  <div className="text-slate-300 text-sm">{u.creationDate}</div>
                </li>
                ))
              )}
            </ul>
          </div>
        </section>

        {/* Right rail: Pending Appeals */}
        <aside className="h-fit bg-slate-900/60 border border-slate-800 rounded-2xl p-4 lg:sticky lg:top-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Pending Appeals</h2>
            <span className="inline-flex items-center justify-center size-6 rounded-full text-xs font-medium bg-[color:var(--bt-blue,#2563eb)]/20 text-[color:var(--bt-blue,#2563eb)]">
              {appeals.length}
            </span>
          </div>

          <div className="space-y-4">
            {appeals.map((a, i) => (
              <div key={i} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium text-slate-100">{a.who}</div>
                    <div className="text-slate-400 text-sm">{a.type}</div>
                  </div>
                  <div className="text-xs text-slate-500">{a.when}</div>
                </div>
                <blockquote className="relative pl-3 mt-3 text-sm text-slate-300 border-l-2 border-[color:var(--bt-blue,#2563eb)]">
                  {a.text}
                </blockquote>
                <button 
                  onClick={openAppealModal}
                  className="mt-4 w-full rounded-xl bg-[color:var(--bt-blue,#2563eb)] py-2 text-sm font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[color:var(--bt-blue,#2563eb)]/40"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        </aside>
      </main>
      
      {/* New Sanction Modal */}
      {isNewSanctionOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="relative bg-slate-900/90 border border-slate-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <button 
              onClick={closeNewSanction}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-200"
            >
             
            </button>
            <IssueNewSanction onClose={closeNewSanction} />
          </div>
        </div>
      )}

      {/* Appeal Modal */}
      {isAppealModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto">
            <ReviewUserAppeal onClose={closeAppealModal} />
          </div>
        </div>
      )}
    </div>
  );
}
