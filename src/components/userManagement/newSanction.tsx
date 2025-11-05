import React, { useState } from "react";
import { FaTimes, FaSearch, FaUser, FaSpinner } from "react-icons/fa";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("NewSanction");
  const [type, setType] = useState("warning");
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
      toast.error(t('errors.selectUser'));
      return;
    }

    if (!reason.trim()) {
      toast.error(t('errors.enterReason'));
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
      toast.success(type === "warning" ? t('success.warning') : t('success.banned'));
      
      if (onSanctionIssued) {
        onSanctionIssued();
      }
      onClose();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error applying sanction:", error);
      toast.error(t('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-gray-800 border border-slate-800 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{t('title')}</h2>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
          >
            
            <FaTimes className="size-4" />
          </button>
        </div>

        {/* Select User */}
        <label className="block text-sm text-slate-400 mb-1">{t('selectUser')}</label>
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
              placeholder={t('searchPlaceholder')}
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
                        {t('userInfo.id')}: {user.studentId}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-slate-400">{t('noUsersFound')}</div>
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

        {/* Type of Sanction */}
        <label className="block text-sm text-slate-400 mb-1">
          {t('typeOfSanction')}
        </label>
        <div className="flex bg-gray-700 border border-slate-800 rounded-xl mb-4 overflow-hidden">
          <button
            type="button"
            onClick={() => setType("Warning")}
            className={`flex-1 py-2 text-sm font-medium ${
              type === "Warning"
                ? "bg-[color:var(--bt-blue,#2563eb)] text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            {t('warning')}
          </button>
          <button
            type="button"
            onClick={() => setType("banned")}
            className={`flex-1 py-2 text-sm font-medium ${
              type === "banned"
                ? "bg-[color:var(--bt-blue,#2563eb)] text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            {t('ban')}
          </button>
        </div>

        {/* Reason */}
        <label className="block text-sm text-slate-400 mb-1">
          {t('reasonLabel')}
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={t('reasonPlaceholder')}
          rows={4}
          className="w-full bg-gray-700 border border-slate-800 rounded-xl p-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[color:var(--bt-blue,#2563eb)]/40 mb-4"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 rounded-lg bg-[color:var(--bt-blue,#2563eb)] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <FaSpinner className="animate-spin" /> {t('submitting')}
            </span>
          ) : (
            t('submitButton')
          )}
        </button>
      </div>
    </form>
  );
}
