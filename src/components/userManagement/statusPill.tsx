import {FaCheckCircle, FaExclamationTriangle, FaBan} from "react-icons/fa";

export default function StatusPill({ status }: { status: "ok" | "warning" | "banned" }) {
  const cfg =
    status === "ok"
      ? { bg: "bg-emerald-500/10", dot: "bg-emerald-400", text: "text-emerald-300" }
      : status === "warning"
      ? { bg: "bg-yellow-500/10", dot: "bg-yellow-400", text: "text-yellow-300" }
      : { bg: "bg-rose-500/10", dot: "bg-rose-400", text: "text-rose-300" };
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${cfg.bg} ${cfg.text}`}>
      {status === 'ok' ? (
        <FaCheckCircle className="w-4 h-4" />
      ) : status === 'warning' ? (
        <FaExclamationTriangle className="w-4 h-4" />
      ) : (
        <FaBan className="w-4 h-4" />
      )}
      {status}
    </span>
  );
};