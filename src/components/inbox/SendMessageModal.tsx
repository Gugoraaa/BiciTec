import { useState } from 'react';
import api from '@/lib/api';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SendMessageModal({ isOpen, onClose }: SendMessageModalProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const t = useTranslations("Inbox.SendNewBox");
  const toastT = useTranslations("SendMessageModal");
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error(toastT('validationError'));
      return;
    }
    
    setIsSending(true);
    try {     
      await api.post('/messages/sendMessage', { title, body, sender:user?.id, type: "news" });
      toast.success(toastT('success'));
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error(toastT('error'));
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setBody('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">{t("title")}</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              {t("NewTitle")}
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("NewTitlePlaceholder")}
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="body" className="block text-sm font-medium text-gray-300 mb-2">
              {t("NewBody")}
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full h-40 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("NewBodyPlaceholder")}
              required
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
              disabled={isSending}
            >
              {t("Cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSending || !title.trim() || !body.trim()}
            >
              {isSending ? t('sending') : t('send')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
