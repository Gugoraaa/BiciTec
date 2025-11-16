"use client";
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
  setStatusFilter,
}: UsersTableProps) {
  const t = useTranslations("UsersTable");
  const tFilter = useTranslations("UsersTable.filterButtons");
  const tColumns = useTranslations("UsersTable.columns");

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.studentId
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getButtonClass = (status: UserStatus) => {
    const baseClass =
      "px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border text-sm sm:text-base transition-all duration-200";
    const isActive = statusFilter === status;

    if (isActive) {
      if (status === "banned") {
        return `${baseClass} bg-rose-500/10 text-rose-400 border-rose-500/20`;
      } else if (status === "warning") {
        return `${baseClass} bg-amber-500/10 text-amber-400 border-amber-500/20`;
      } else if (status === "ok") {
        return `${baseClass} bg-emerald-500/10 text-emerald-400 border-emerald-500/20`;
      }
      return `${baseClass} bg-blue-500/10 text-blue-400 border-blue-500/20`;
    }

    return `${baseClass} bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-700/50 hover:border-slate-600 hover:text-slate-200`;
  };

  return (
    <section className="w-full">
      {/* Filtros de búsqueda */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-xl p-3">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-950/60 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/30 text-slate-200 placeholder:text-slate-500 text-sm sm:text-base transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(["All", "ok", "warning", "banned"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={getButtonClass(status)}
            >
              {tFilter(status.toLowerCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="overflow-x-auto">
          <div className="min-w-[800px] sm:min-w-0">
            {/* Encabezados de la tabla */}
            <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs sm:text-sm text-slate-400 border-b border-slate-800 bg-slate-900/50 whitespace-nowrap">
              <div className="col-span-2 font-medium">{tColumns("userId")}</div>
              <div className="col-span-3 font-medium">{tColumns("name")}</div>
              <div className="col-span-3 font-medium">
                {tColumns("lastName")}
              </div>
              <div className="col-span-2 font-medium">{tColumns("status")}</div>
              <div className="col-span-2 font-medium text-right">
                {tColumns("creationDate")}
              </div>
            </div>

            {/* Cuerpo de la tabla */}
            <ul className="divide-y divide-slate-800 min-h-[200px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2">
                  <FaSpinner className="animate-spin text-blue-500 w-8 h-8" />
                  <span className="text-slate-400 text-sm">{t("loading")}</span>
                </div>
              ) : error ? (
                <li className="text-center py-8 text-rose-400 px-4">{error}</li>
              ) : filteredUsers.length === 0 ? (
                <li className="text-center py-8 text-slate-400 px-4">
                  {t("noUsers")}
                </li>
              ) : (
                filteredUsers.map((u) => (
                  <li
                    key={u.id}
                    className="grid grid-cols-12 gap-4 items-center px-4 py-3 hover:bg-slate-900/50 transition-colors whitespace-nowrap"
                  >
                    <div className="col-span-2">
                      <div
                        className="font-medium text-slate-100 text-sm sm:text-base truncate"
                        title={u.studentId}
                      >
                        {u.studentId}
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div
                        className="text-slate-300 text-sm sm:text-base truncate"
                        title={u.name}
                      >
                        {u.name}
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div
                        className="text-slate-300 text-sm sm:text-base truncate"
                        title={u.lastName}
                      >
                        {u.lastName}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <StatusPill status={u.status} />
                    </div>
                    <div className="col-span-2">
                      <div className="text-slate-400 text-xs sm:text-sm text-right">
                        {new Date(u.creado_en).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
