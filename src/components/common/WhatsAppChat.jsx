import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { IoSend } from 'react-icons/io5';

const WHATSAPP_NUMBER = '250781089893';

const WhatsAppChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setMessage('');
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-[9999] flex flex-col items-end gap-3">
      {isOpen && (
        <div className="bg-surface-900 border border-surface-700 rounded-2xl shadow-2xl w-[calc(100vw-2rem)] sm:w-80 max-w-[380px] overflow-hidden animate-slide-up">
          <div className="bg-brand-600 px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FaWhatsapp className="text-white text-xl" />
              <span className="text-white font-semibold text-sm">WhatsApp</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1"
              aria-label="Close chat"
            >
              <IoMdClose className="text-lg" />
            </button>
          </div>

          <div className="p-4 bg-surface-900">
            <div className="bg-surface-800 rounded-lg p-3.5 mb-3">
              <p className="text-sm text-surface-200 leading-relaxed">
                👋 Hello! Welcome to <span className="text-brand-500 font-semibold">KICKS_SHOP</span>. How can we help you today?
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="border-t border-surface-700 p-3 flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-surface-800 text-sm text-surface-100 placeholder-surface-500 rounded-lg px-3 py-2.5 border border-surface-700 focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 transition-all outline-none"
            />
            <button
              type="submit"
              className="bg-brand-600 hover:bg-brand-500 text-white rounded-lg p-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[40px] min-h-[40px] flex items-center justify-center"
              disabled={!message.trim()}
              aria-label="Send message"
            >
              <IoSend className="text-lg" />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-brand-600 hover:bg-brand-500 text-white p-3.5 sm:p-4 rounded-full shadow-lg hover:shadow-glow transition-all duration-200 active:scale-95 min-w-[52px] min-h-[52px] flex items-center justify-center"
        aria-label={isOpen ? 'Close chat' : 'Open WhatsApp chat'}
      >
        {isOpen ? (
          <IoMdClose className="text-2xl sm:text-xl" />
        ) : (
          <FaWhatsapp className="text-2xl sm:text-xl" />
        )}
      </button>
    </div>
  );
};

export default WhatsAppChat;
