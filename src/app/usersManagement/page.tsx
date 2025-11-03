'use client'
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { useTranslations } from "next-intl";
import api from '@/lib/api';
import { useAuth } from "@/contexts/AuthContext";
import PendingAppeals from "@/components/userManagement/PendingAppeals";
import IssueNewSanction from "@/components/userManagement/newSanction";
import ReviewUserAppeal from "@/components/userManagement/appealReviewModal";
import {UserManagement} from "@/types/userManagement";
import type {UserStatus} from "@/types/userManagement";
import UsersTable from "@/components/userManagement/UsersTable";
import { AppealApiResponse } from "@/types/userManagement";
import { formattedUsers } from "@/app/utils/usersManagement";

interface Appeal extends AppealApiResponse {
  who: string;
  text: string;
  when: string;
  userId: number; 
}


export default function UserSanctionsBiciTecSkin() {
  const [users, setUsers] = useState<UserManagement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("UserManagement");
  const [isNewSanctionOpen, setIsNewSanctionOpen] = useState(false);
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus>('All');
  const [selectedUserId, setSelectedUserId] = useState('');
  const { user } = useAuth();
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/user/getUsers');
        const users = formattedUsers(response.data);
        setUsers(users);
      } catch (err) {
        console.error(t('errorFetchingUsers'), err);
        setError(t('errorLoadingUsers'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);


  const openAppealModal = (appeal: AppealApiResponse | Appeal, appealerId: string | number) => {
    const userIdNum = typeof appealerId === 'string' ? parseInt(appealerId, 10) : appealerId;
    
    const formattedAppeal: Appeal = {
      ...appeal,
      who: 'who' in appeal ? appeal.who : `${appeal.nombre} ${appeal.apellido}`,
      text: 'text' in appeal ? appeal.text : appeal.mensaje,
      userId: userIdNum, 
      when: 'when' in appeal ? appeal.when : new Date(appeal.fecha).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setSelectedAppeal(formattedAppeal);
    setIsAppealModalOpen(true);
  };
  const closeAppealModal = () => {
    setSelectedAppeal(null);
    setIsAppealModalOpen(false);
  };

  return (
    <div className="min-h-screen w-full text-slate-100">
      
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">{t('title')}</h1>
        <button
          onClick={() => setIsNewSanctionOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-[color:var(--bt-blue,#2563eb)] hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-[color:var(--bt-blue,#2563eb)]/40"
        >
          <FaPlus className="w-4 h-4" /> {t('newSanctionButton')}
        </button>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 p-6">
        
        <UsersTable 
          users={users}
          isLoading={isLoading}
          error={error}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        
        <div className="lg:sticky lg:top-6">
          <PendingAppeals 
            onReview={(appealId, appealText, appealerId) => {
              openAppealModal({
                id: appealId,
                mensaje: appealText,
                fecha: new Date().toISOString(),
                nombre: '',
                apellido: ''
              }, String(appealerId));
            }}
          />
        </div>
      </main>
      
      
      {isNewSanctionOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto">
            <IssueNewSanction 
              onClose={() => setIsNewSanctionOpen(false)}
              users={users}
              onUserSelect={(userId) => setSelectedUserId(userId)}
              adminId={user?.id || "" }
            />
          </div>
        </div>
      )}

      
      {isAppealModalOpen && selectedAppeal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto">
            <ReviewUserAppeal 
              onClose={closeAppealModal} 
              appealId={selectedAppeal.id}
              appealText={selectedAppeal.text}
              userId={selectedAppeal.userId}
              adminId={user?.id || ""}
              onSuccess={() => window.location.reload()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
