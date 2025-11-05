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
    <div className="min-h-screen w-full bg-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">{t('title')}</h1>
              <div className="h-1 w-12 sm:w-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-1"></div>
            </div>
            <button
              onClick={() => setIsNewSanctionOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 text-sm sm:text-base"
            >
              <FaPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {t('newSanctionButton')}
            </button>
          </div>
        </div>

      <main className="flex flex-col lg:flex-row gap-4 sm:gap-5 md:gap-6">
        <div className="flex-1 min-w-0">
          <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <UsersTable 
                users={users}
                isLoading={isLoading}
                error={error}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />
            </div>
          </div>
        </div>
        
        <div className="lg:w-96 lg:sticky lg:top-6 h-fit">
          <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 overflow-hidden">
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
        </div>
      </main>
      
      
      {isNewSanctionOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto">
            <IssueNewSanction 
              onClose={() => setIsNewSanctionOpen(false)}
              users={users}
              onUserSelect={(userId) => setSelectedUserId(userId)}
              adminId={user?.id || ""}
            />
          </div>
        </div>
      )}

      
      {isAppealModalOpen && selectedAppeal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 sm:p-4">
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
    </div>
  );
}
