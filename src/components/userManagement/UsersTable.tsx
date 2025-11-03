'use client'
import { FaSearch, FaSpinner } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { UserManagement, UserStatus } from "@/types/userManagement";
import StatusPill from "./statusPill";

interface UsersTableProps {
  users: UserManagement[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: UserStatus;
  setStatusFilter: (status: UserStatus) => void;
}

export default function UsersTable({
  users,
  isLoading,
  error,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter
}: UsersTableProps) {
  const t = useTranslations("UsersTable");
  const tFilter = useTranslations("UsersTable.filterButtons");
  const tColumns = useTranslations("UsersTable.columns");
  
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.studentId.toLowerCase().includes(searchTerm.toLowerCase());
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
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-3">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            placeholder={t('searchPlaceholder')}
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
            {tFilter('all')}
          </button>
          <button 
            onClick={() => setStatusFilter('banned')} 
            className={getButtonClass('banned')}
          >
            {tFilter('banned')}
          </button>
          <button 
            onClick={() => setStatusFilter('warning')} 
            className={getButtonClass('warning')}
          >
            {tFilter('warning')}
          </button>
          <button 
            onClick={() => setStatusFilter('ok')} 
            className={getButtonClass('ok')}
          >
            {tFilter('ok')}
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] px-4 py-3 text-sm text-slate-400 border-b border-slate-800">
          <div>{tColumns('userId')}</div>
          <div>{tColumns('name')}</div>
          <div>{tColumns('lastName')}</div>
          <div>{tColumns('status')}</div>
          <div>{tColumns('creationDate')}</div>
        </div>
        <ul className="divide-y divide-slate-800 min-h-[200px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <FaSpinner className="animate-spin text-[color:var(--bt-blue,#2563eb)] w-8 h-8" />
              <span className="text-slate-400">{t('loading')}</span>
            </div>
          ) : error ? (
            <li className="text-center py-8 text-rose-400">{error}</li>
          ) : filteredUsers.length === 0 ? (
            <li className="text-center py-8 text-slate-400">{t('noUsers')}</li>
          ) : (
            filteredUsers.map((u) => (
              <li key={u.id} className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] items-center px-4 py-4 hover:bg-slate-900">
                <div className="font-medium text-slate-100">{u.studentId}</div>
                <div className="text-slate-300">{u.name}</div>
                <div className="text-slate-300">{u.lastName}</div>
                <div>
                  <StatusPill status={u.status} />
                </div>
                <div className="text-slate-300 text-sm">
                  {new Date(u.creationDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}
