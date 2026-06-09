import "./chatbot.css";

import { ChatHeader } from "./components/ChatHeader";
import { MessageList } from "./components/MessageList";
import { ChatInput } from "./components/ChatInput";
import { SuggestedPrompts } from "./components/SuggestedPrompts";
import { ChatSidebar } from "./components/ChatSidebar";
import { useScrollToBottom } from "./hooks/useScrollToBottom";
import { useChatbotContext } from "../../contexts/ChatbotContext";

export function ChatbotPage() {
  const { messages, isLoading, sendMessage } = useChatbotContext();

  const scrollRef = useScrollToBottom(messages);

  return (
    <div className="chatbot-page bg-white">
      <div className="chatbot-layout flex">

        {/* Sidebar */}
        <ChatSidebar />

        {/* Chat Area */}
        <main className="flex flex-1 flex-col overflow-hidden bg-[#fafafa]">

          {/* Header */}
          <ChatHeader />

          {/* Messages */}
          <div className="chatbot-messages">
            <MessageList
              messages={messages}
              isLoading={isLoading}
              scrollRef={scrollRef}
            />
          </div>

          {/* Suggested Prompts */}
          {messages.length <= 1 && (
            <div
              className="
                shrink-0
                bg-[#fafafa]
                px-6
                pt-3
                relative
                -top-20
              "
            >
              <SuggestedPrompts
                onSelect={sendMessage}
                disabled={isLoading}
              />
            </div>
          )}

          {/* Input */}
          <div
            className="
              chatbot-input-wrapper
              shrink-0
              bg-[#fafafa]
              px-6
              pt-4
            "
          >
            <ChatInput
              onSend={sendMessage}
              disabled={isLoading}
            />
          </div>

        </main>

      </div>
    </div>
  );
}

export default ChatbotPage;