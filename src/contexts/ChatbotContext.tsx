import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

import { Message } from '../pages/chatbot/types';

import {
  ChatSession,
  getChatSessions,
  getChatSessionDetails,
  deleteChatSession,
} from '../api/chatbotApi';

import { fetchAIResponse } from '../pages/chatbot/services/chatbotService';

interface ChatbotContextType {
  messages: Message[];
  sessions: ChatSession[];
  currentSessionId: number | null;
  isLoading: boolean;

  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;

  loadSessions: () => Promise<void>;
  loadSessionMessages: (
    sessionId: number
  ) => Promise<void>;

  deleteSession: (
    sessionId: number
  ) => Promise<void>;

  isFloatingOpen: boolean;
  setFloatingOpen: (isOpen: boolean) => void;
}

const ChatbotContext = createContext<
  ChatbotContextType | undefined
>(undefined);

const DEFAULT_MESSAGE: Message = {
  id: '1',
  role: 'assistant',
  content:
    "Hello! I'm your AI cooking assistant. Tell me what ingredients you have, your dietary preferences, or what type of meal you're looking for, and I'll suggest the perfect recipes for you!",
  timestamp: new Date(),
};

export function ChatbotProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isFloatingOpen, setFloatingOpen] =
    useState(false);

  const [sessions, setSessions] = useState<
    ChatSession[]
  >([]);

  const [messages, setMessages] = useState<Message[]>(
    () => {
      const savedMessages =
        sessionStorage.getItem('chatMessages');

      if (savedMessages) {
        try {
          const parsed = JSON.parse(savedMessages);

          return parsed.map((msg: Message) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
        } catch {
          return [DEFAULT_MESSAGE];
        }
      }

      return [DEFAULT_MESSAGE];
    }
  );

  const [currentSessionId, setCurrentSessionId] =
    useState<number | null>(() => {
      const saved =
        sessionStorage.getItem('chatSessionId');

      return saved ? Number(saved) : null;
    });

  const [isLoading, setIsLoading] =
    useState(false);

  useEffect(() => {
    sessionStorage.setItem(
      'chatMessages',
      JSON.stringify(messages)
    );
  }, [messages]);

  useEffect(() => {
    if (currentSessionId !== null) {
      sessionStorage.setItem(
        'chatSessionId',
        currentSessionId.toString()
      );
    }
  }, [currentSessionId]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await getChatSessions();
      setSessions(data);
    } catch (error) {
      console.error(
        'Failed to load sessions',
        error
      );
    }
  };

  const loadSessionMessages = async (
    sessionId: number
  ) => {
    try {
      setIsLoading(true);

      const session =
        await getChatSessionDetails(sessionId);

      const mappedMessages: Message[] =
        session.messages.map(
          (message, index) => ({
            id: `${sessionId}-${index}`,
            role: message.role,
            content: message.content,
            timestamp: new Date(
              message.createdAt
            ),
          })
        );

      setMessages(mappedMessages);
      setCurrentSessionId(sessionId);
    } catch (error) {
      console.error(
        'Failed to load session',
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = async (
    sessionId: number
  ) => {
    try {
      await deleteChatSession(sessionId);

      setSessions((prev) =>
        prev.filter(
          (session) =>
            session.id !== sessionId
        )
      );

      if (
        currentSessionId === sessionId
      ) {
        clearChat();
      }
    } catch (error) {
      console.error(
        'Failed to delete session',
        error
      );
    }
  };

  const clearChat = () => {
    sessionStorage.removeItem(
      'chatMessages'
    );

    sessionStorage.removeItem(
      'chatSessionId'
    );

    setMessages([DEFAULT_MESSAGE]);

    setCurrentSessionId(null);
  };

  const sendMessage = async (
    content: string
  ) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setIsLoading(true);

    try {
      const response =
        await fetchAIResponse(
          content,
          currentSessionId ??
            undefined
        );

      if (response.sessionId) {
        setCurrentSessionId(
          response.sessionId
        );
      }

      const assistantMessage: Message = {
        id: (
          Date.now() + 1
        ).toString(),
        role: 'assistant',
        content: response.content,
        recipes: response.recipes,
        timestamp: new Date(),
      };

      setMessages((prev) => [
        ...prev,
        assistantMessage,
      ]);

      await loadSessions();
    } catch (error) {
      console.error(
        'Failed to send message',
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatbotContext.Provider
      value={{
        messages,
        sessions,
        currentSessionId,
        isLoading,

        sendMessage,
        clearChat,

        loadSessions,
        loadSessionMessages,
        deleteSession,

        isFloatingOpen,
        setFloatingOpen,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

export const useChatbotContext = () => {
  const context =
    useContext(ChatbotContext);

  if (!context) {
    throw new Error(
      'useChatbotContext must be used within ChatbotProvider'
    );
  }

  return context;
};