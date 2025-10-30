"use client";

import { useState, useEffect, ChangeEvent } from "react";
import MessageItem from "@/components/inbox/messageItem";
import MessageModal from "@/components/inbox/messageBox";
import { MessageItemProps } from "@/types/inbox";
import { FaBan, FaNewspaper } from "react-icons/fa";
import { BsFillSendPlusFill } from "react-icons/bs";
import { useAuth } from "@/contexts/AuthContext";
import SendMessageModal from "@/components/inbox/SendMessageModal";
import { useTranslations } from "next-intl";
import api from "@/lib/api";

export default function MessagesPage() {
  const t = useTranslations("Inbox");
  const { isAdmin, user } = useAuth();
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const handleClose = () => {
    setIsMessageModalOpen(false);
  };

  const [messages, setMessages] = useState<MessageItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<{
    id: string | number;
    id_mensaje: number;
    remitente: string;
    titulo: string;
    cuerpo: string;
    fecha: string;
    tipo: string;
  } | null>(null);

  const [checkedMessages, setCheckedMessages] = useState<number[]>([]);
  const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
  type FilterType = 'all' | 'unread' | 'news' | 'notification';
  type SortType = 'newest' | 'oldest' | 'sender';
  
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('newest');

  const handleCheckAll = (e: ChangeEvent<HTMLInputElement>) => {
    setMessages(messages.map((msg) => ({ ...msg, checked: e.target.checked })));
  };

  const handleCheckMessage = (id: number) => {
    setCheckedMessages((prev) =>
      prev.includes(id) ? prev.filter((msgId) => msgId !== id) : [...prev, id]
    );
  };


  const openMessage = (message: MessageItemProps) => {
    setSelectedMessage({
      id: message.id,
      id_mensaje: message.id_mensaje,
      remitente: message.remitente,
      titulo: message.titulo,
      cuerpo: message.cuerpo,
      fecha: message.fecha,
      tipo: message.tipo,
    });
  };

  // Update message read status in the messages list
  const updateMessageReadStatus = (messageId: number) => {
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id_mensaje === messageId ? { ...msg, leido: true } : msg
      )
    );
  };

  const closeModal = () => {
    setSelectedMessage(null);
  };

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get("/messages/getMessages/" + user?.id);

      const messagesData = Array.isArray(data) ? data : [];

      interface MessageData {
        id: number;
        id_mensaje: number;
        remitente: string;
        titulo: string;
        cuerpo: string;
        fecha: string;
        tipo: string;
        leido: number;
      }

      const formattedMessages = messagesData.map((msg: MessageData) => ({
        id: msg.id,
        id_mensaje: msg.id_mensaje,
        remitente: msg.tipo === 'news' 
          ? 'BiciTec News' 
          : (msg.tipo === 'account_notification' || msg.tipo === 'warning')
            ? 'Bicitec Account Manager'
            : `Usuario ${msg.remitente}`,
        titulo: msg.titulo,
        cuerpo: msg.cuerpo,
        fecha: msg.fecha ? new Date(msg.fecha).toLocaleDateString() : "",
        icon:
          msg.tipo === "account_notification" ? (
            <FaBan className="text-red-500" />
          ) : (
            <FaNewspaper className="text-blue-500" />
          ),
        leido: msg.leido === 1,
        tipo: msg.tipo,
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error al cargar los mensajes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadMessages = async () => {
      await fetchMessages();
    };
    loadMessages();
  }, []);

  const allChecked = messages.length > 0 && messages.every((msg) => checkedMessages.includes(msg.id));

  return (
    <>
    
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">
            {t("title")}
          </h1>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as FilterType)}
                  className="bg-gray-800 border border-gray-700 rounded px-4 py-2 pr-8 appearance-none cursor-pointer"
                >
                  <option value="all">{t("show.AllMessages")}</option>
                  <option value="unread">{t("show.Unread")}</option>
                  <option value="news">{t("show.News")}</option>
                  <option value="notification">{t("show.AccountNotification")}</option>
                </select>
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortType)}
                  className="bg-gray-800 border border-gray-700 rounded px-4 py-2 pr-8 appearance-none cursor-pointer"
                >
                  <option value="newest">{t("sortBy.Newest")}</option>
                  <option value="oldest">{t("sortBy.Oldest")}</option>
                  <option value="sender">{t("sortBy.Sender")}</option>
                </select>
              </div>
              {isAdmin && (
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300"
                  onClick={() => setIsMessageModalOpen(true)}
                >
                  <span className="flex items-center gap-2">
                    <BsFillSendPlusFill /> {t("SendNew")}
                  </span>
                </button>
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 bg-gray-750 border-b border-gray-700">
              <div className="col-span-12 sm:col-span-4 md:col-span-3 font-medium">
                {t("columns.sender")}
              </div>
              <div className="col-span-8 sm:col-span-6 md:col-span-7 font-medium">
                {t("columns.subject")}
              </div>
              <div className="col-span-4 sm:col-span-2 text-right font-medium">
                {t("columns.timestamp")}
              </div>
            </div>

            {isLoading ? (
              <div className="p-4 text-center text-gray-400">
                Cargando mensajes...
              </div>
            ) : messages.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                No hay mensajes para mostrar
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {messages
              .filter(msg => {
                if (filter === 'all') return true;
                if (filter === 'unread') return !msg.leido;
                if (filter === 'news') return msg.tipo === 'news';
                if (filter === 'notification') return msg.tipo === 'account_notification';
                return true;
              })
              .sort((a, b) => {
                if (sortBy === 'newest') return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
                if (sortBy === 'oldest') return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
                if (sortBy === 'sender') return a.remitente.localeCompare(b.remitente);
                return 0;
              })
              .map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`grid grid-cols-12 gap-4 p-4 hover:bg-gray-750 transition-colors cursor-pointer relative ${!msg.leido ? 'bg-gray-900/50' : ''}`}
                    onClick={() => openMessage(msg)}
                  >
                    {!msg.leido && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r"></div>
                    )}
                    <div className="col-span-12 sm:col-span-4 md:col-span-3 flex items-center gap-3">
                      <span className={`${!msg.leido ? 'text-blue-400' : 'text-gray-500'}`}>{msg.icon}</span>
                      <span className={`truncate ${!msg.leido ? 'font-semibold text-white' : 'text-gray-400'}`}>
                        {msg.remitente}
                      </span>
                    </div>
                    <div className="col-span-8 sm:col-span-6 md:col-span-7">
                      <div className={`truncate ${!msg.leido ? 'font-semibold text-white' : 'text-gray-300'}`}>
                        {msg.titulo}
                      </div>
                      <div className={`text-sm truncate ${!msg.leido ? 'text-gray-300' : 'text-gray-500'}`}>
                        {msg.cuerpo.substring(0, 60)}{msg.cuerpo.length > 60 ? '...' : ''}
                      </div>
                    </div>
                    <div className={`col-span-4 sm:col-span-2 text-right text-sm ${!msg.leido ? 'text-blue-400 font-medium' : 'text-gray-500'}`}>
                      {msg.fecha}
                      {!msg.leido && (
                        <span className="ml-2 inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <MessageModal 
        message={selectedMessage} 
        onClose={() => {
          if (selectedMessage) {
            updateMessageReadStatus(selectedMessage.id_mensaje);
          }
          closeModal();
        }} 
      />
      <SendMessageModal isOpen={isMessageModalOpen} onClose={handleClose} />
    </>
  );
}
