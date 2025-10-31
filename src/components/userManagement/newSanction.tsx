import React, { useState } from "react";
import { FaTimes, FaSearch, FaUser, FaSpinner } from "react-icons/fa";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface User {
  id: string;
  studentId: string;
  name: string;
  lastName: string;
  status: "ok" | "warning" | "banned";
  creationDate: string;
}

interface IssueNewSanctionProps {
  onClose: () => void;
  users: User[];
  onUserSelect: (userId: string) => void;
  adminId: string;
  onSanctionIssued?: () => void;
}

export default function IssueNewSanction({
  onClose,
  users,
  onUserSelect,
  adminId,
  onSanctionIssued,
}: IssueNewSanctionProps) {
  const [type, setType] = useState("Warning");
  const [reason, setReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredUsers = users.filter(
    (user) =>
      user.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    onUserSelect(user.id);
    setSearchTerm(`${user.name} ${user.lastName} (${user.studentId})`);
    setShowDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser) {
      toast.error("Por favor selecciona un usuario", {
        style: {
          background: "#1F2937",
          color: "#F3F4F6",
          border: "1px solid #374151",
          borderRadius: "0.5rem",
          padding: "0.75rem 1rem",
        },
      });
      return;
    }

    if (!reason.trim()) {
      toast.error("Por favor ingresa una razón para la sanción", {
        style: {
          background: "#1F2937",
          color: "#F3F4F6",
          border: "1px solid #374151",
          borderRadius: "0.5rem",
          padding: "0.75rem 1rem",
        },
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const sanctionData = {
        state: type.toLowerCase(),
        body: reason,
        adminId: adminId,
        type: "account_notification",
      };

      await api.patch(
        `/user/updateUserState/${selectedUser.id}`,
        sanctionData
      );

      toast.success(
        `Usuario ${type === "Warning" ? "advertido" : "baneado"} correctamente`,
        {
          style: {
            background: "#1F2937",
            color: "#F3F4F6",
            border: "1px solid #374151",
            borderRadius: "0.5rem",
            padding: "0.75rem 1rem",
          },
        }
      );
      
      if (onSanctionIssued) {
        onSanctionIssued();
      }
      onClose();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error applying sanction:", error);
      toast.error(
        "Error al aplicar la sanción. Por favor, inténtalo de nuevo.",
        {
          style: {
            background: "#1F2937",
            color: "#F3F4F6",
            border: "1px solid #374151",
            borderRadius: "0.5rem",
            padding: "0.75rem 1rem",
          },
        }
      );
    } finally {
      setIsSubmitting(false);
    } 
  };

  return (
    <form onSubmit={handleSubmit}>
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

        <label className="block text-sm text-slate-400 mb-1">Select User</label>
        <div className="mb-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 size-4 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
                if (selectedUser) {
                  setSelectedUser(null);
                  onUserSelect("");
                }
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search by name or ID..."
              className="w-full bg-gray-700 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[color:var(--bt-blue,#2563eb)]/40"
            />
          </div>
          {showDropdown && searchTerm && (
            <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-slate-700 rounded-lg shadow-lg max-h-60 overflow-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center p-3 hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleSelectUser(user)}
                  >
                    <div className="bg-gray-700 p-2 rounded-lg mr-3">
                      <FaUser className="text-slate-400" />
                    </div>
                    <div>
                      <div className="text-white">
                        {user.name} {user.lastName}
                      </div>
                      <div className="text-sm text-slate-400">
                        {user.studentId}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-slate-400">No users found</div>
              )}
            </div>
          )}
          {selectedUser && (
            <div className="mt-2 p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="bg-gray-600 p-2 rounded-lg mr-3">
                  <FaUser className="text-slate-300" />
                </div>
                <div>
                  <div className="text-white">
                    {selectedUser.name} {selectedUser.lastName}
                  </div>
                  <div className="text-sm text-slate-300">
                    {selectedUser.studentId}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <label className="block text-sm text-slate-400 mb-1">
          Type of Sanction
        </label>
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
            onClick={() => setType("Banned")}
            className={`flex-1 py-2 text-sm font-medium ${
              type === "Ban"
                ? "bg-[color:var(--bt-blue,#2563eb)] text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            Ban
          </button>
        </div>

        <label className="block text-sm text-slate-400 mb-1">
          Reason for Sanction
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g., Bike left outside designated area"
          rows={4}
          className="w-full bg-gray-700 border border-slate-800 rounded-xl p-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[color:var(--bt-blue,#2563eb)]/40 mb-4"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 rounded-xl bg-[color:var(--bt-blue,#2563eb)] text-white font-medium focus:outline-none focus:ring-2 focus:ring-[color:var(--bt-blue,#2563eb)]/40 flex items-center justify-center ${
            isSubmitting ? "opacity-75 cursor-not-allowed" : "hover:opacity-90"
          }`}
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Processing...
            </>
          ) : (
            "Submit Sanction"
          )}
        </button>
      </div>
    </form>
  );
}
