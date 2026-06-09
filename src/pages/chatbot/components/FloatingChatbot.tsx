import { MessageCircle, X, Bot } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useChatbotContext } from '../../../contexts/ChatbotContext';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { useScrollToBottom } from '../hooks/useScrollToBottom';

export function FloatingChatbot() {
  const {
    isFloatingOpen,
    setFloatingOpen,
    messages,
    isLoading,
    sendMessage,
  } = useChatbotContext();

  const scrollRef = useScrollToBottom(messages);
  const location = useLocation();

  if (
    location.pathname === '/chatbot' ||
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/checkout'
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {isFloatingOpen && (
        <div
          className="
            mb-4
            flex
            h-[750px]
            max-h-[88vh]
            w-[430px]
            max-w-[95vw]
            flex-col
            overflow-hidden
            rounded-[28px]
            border
            border-gray-200
            bg-white
            shadow-[0_20px_80px_rgba(0,0,0,0.18)]
            animate-in
            fade-in
            zoom-in-95
            duration-200
          "
        >
          {/* Header */}
          <div className="border-b border-gray-100 bg-white px-5 py-4">
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-2xl
                    bg-green-600
                    text-white
                    shadow-sm
                  "
                >
                  <Bot size={20} />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    FreshMart AI
                  </h3>

                  <p className="text-sm text-gray-500">
                    Recipe Assistant
                  </p>
                </div>
              </div>

              <button
                onClick={() => setFloatingOpen(false)}
                className="
                  rounded-xl
                  p-2
                  text-gray-500
                  transition-colors
                  hover:bg-gray-100
                "
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="
              flex-1
              overflow-y-auto
              bg-[#fafafa]
            "
          >
            <MessageList
              messages={messages}
              isLoading={isLoading}
              scrollRef={scrollRef}
            />
          </div>

          {/* Input */}
          <div className="bg-[#fafafa]">
            <ChatInput
              onSend={sendMessage}
              disabled={isLoading}
            />
          </div>
        </div>
      )}

      {!isFloatingOpen && (
        <button
          onClick={() => setFloatingOpen(true)}
          className="
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-full
            bg-green-600
            text-white
            shadow-[0_10px_30px_rgba(22,163,74,0.35)]
            transition-all
            duration-200
            hover:scale-110
            hover:bg-green-700
            active:scale-95
          "
        >
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  );
}