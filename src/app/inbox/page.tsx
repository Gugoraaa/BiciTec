"use client";

import { useState, useEffect, ChangeEvent } from "react";
import MessageItem from "@/components/inbox/messageItem";
import MessageModal from "@/components/inbox/messageBox";
import { MessageItemProps } from "@/types/inbox";
import { IoIosWarning } from "react-icons/io";
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
  const [filter, setFilter] = useState("All Messages");
  const [sortBy, setSortBy] = useState("Newest");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<{
    remitente: string;
    titulo: string;
    cuerpo: string;
    fecha: string;
  } | null>(null);

  const [checkedMessages, setCheckedMessages] = useState<number[]>([]);

  const handleCheckAll = (e: ChangeEvent<HTMLInputElement>) => {
    setMessages(messages.map((msg) => ({ ...msg, checked: e.target.checked })));
  };

  const handleCheckMessage = (id: number) => {
    setCheckedMessages((prev) =>
      prev.includes(id) ? prev.filter((msgId) => msgId !== id) : [...prev, id]
    );
  };

  const markAllAsRead = () => {
    alert("All messages marked as read!");
  };

  const openMessage = (message: MessageItemProps) => {
    setSelectedMessage({
      remitente: message.remitente,
      titulo: message.titulo,
      cuerpo: message.cuerpo,
      fecha: message.fecha,
    });
  };

  const closeModal = () => {
    setSelectedMessage(null);
  };

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get("/messages/getMessages/" + user?.id);

      const messagesData = Array.isArray(data) ? data : [];

      const formattedMessages = messagesData.map((msg: any) => ({
        id: msg.id_mensaje,
        remitente: msg.tipo === 'news' 
          ? 'BiciTec News' 
          : (msg.tipo === 'account_notification' || msg.tipo === 'warning')
            ? 'Bicitec Account Manager'
            : `Usuario ${msg.remitente}`,
        titulo: msg.titulo,
        cuerpo: msg.cuerpo,
        fecha: msg.fecha ? new Date(msg.fecha).toLocaleDateString() : "",
        icon:
          msg.tipo === "warning" ? (
            <IoIosWarning className="text-yellow-500" />
          ) : msg.tipo === "account_notification" ? (
            <FaBan className="text-red-500" />
          ) : (
            <FaNewspaper className="text-blue-500" />
          ),
        leido: msg.leido === 1,
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error al cargar los mensajes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const allChecked =
    messages.length > 0 &&
    messages.every((msg) => checkedMessages.includes(msg.id));

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded px-4 py-2 pr-8 appearance-none cursor-pointer"
                >
                  <option>{t("show.AllMessages")}</option>
                  <option>{t("show.Unread")}</option>
                  <option>{t("show.News")}</option>
                  <option>{t("show.AccountNotification")}</option>
                </select>
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded px-4 py-2 pr-8 appearance-none cursor-pointer"
                >
                  <option>{t("sortBy.Newest")}</option>
                  <option>{t("sortBy.Oldest")}</option>
                  <option>{t("sortBy.Sender")}</option>
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
            <div className="flex items-center gap-4 p-4 bg-gray-750 border-b border-gray-700">
              <div className="min-w-[200px] font-medium">
                {t("columns.sender")}
              </div>
              <div className="flex-1 font-medium">{t("columns.subject")}</div>
              <div className="min-w-[120px] text-right font-medium">
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
              messages.map((msg) => (
                <MessageItem
                  id={msg.id}
                  key={msg.id}
                  remitente={msg.remitente}
                  titulo={msg.titulo}
                  cuerpo={msg.cuerpo}
                  fecha={msg.fecha}
                  icon={msg.icon}
                  onClick={() => openMessage(msg)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <MessageModal message={selectedMessage} onClose={closeModal} />
      <SendMessageModal isOpen={isMessageModalOpen} onClose={handleClose} />
    </>
  );
}
