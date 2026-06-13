import { MessageCircle, X, Bot } from "lucide-react";
import { useLocation } from "react-router-dom";

import { useChatbotContext } from "../../../contexts/ChatbotContext";
import { useApp } from "../../../contexts/AppContext";

import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

import { useScrollToBottom } from "../hooks/useScrollToBottom";

import "./floating-chatbot.css";

export function FloatingChatbot() {
  const {
    isFloatingOpen,
    setFloatingOpen,
    messages,
    isLoading,
    sendMessage,
  } = useChatbotContext();

  const { state } = useApp();

  const scrollRef = useScrollToBottom(messages);

  const location = useLocation();

  const lastMessage = messages[messages.length - 1];

  const isWaitingForBot =
    isLoading || lastMessage?.role === "user";

  // Hide chatbot if user is not authenticated
  if (!state.isAuthenticated) {
    return null;
  }

  // Hide chatbot on dedicated pages
  if (
    location.pathname === "/chatbot" ||
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/checkout"
  ) {
    return null;
  }

  return (
    <div className="fcb-container">
      {isFloatingOpen && (
        <div className="fcb-window">
          {/* Chat header */}
          <div className="fcb-header">
            <div className="fcb-header-info">
              <div className="fcb-bot-icon">
                <Bot size={20} />
              </div>

              <div className="fcb-header-text">
                <h3>Loqma AI</h3>
                <p>Recipe Assistant</p>
              </div>
            </div>

            <button
              onClick={() => setFloatingOpen(false)}
              className="fcb-close-btn"
              title="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="fcb-messages"
          >
            <MessageList
              messages={messages}
              isLoading={isLoading}
              scrollRef={scrollRef}
            />
          </div>

          {/* Input */}
          <div className="fcb-input-area">
            <ChatInput
              onSend={sendMessage}
              disabled={isWaitingForBot}
              isFirstMessage={messages.length === 0}
            />
          </div>
        </div>
      )}

      {!isFloatingOpen && (
        <button
          onClick={() => setFloatingOpen(true)}
          className="fcb-fab"
          title="Open AI Assistant"
        >
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  );
}