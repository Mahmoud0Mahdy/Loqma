import axiosInstance from "./axiosInstance";

export interface ChatbotRequest {
  message: string;
  sessionId?: number;
}

export interface RecipeSuggestion {
  id: number;
  title: string;
  imageUrl: string;
  difficultyLevel: string;
  prepTime: number;
  isSaved: boolean;
  servings: number;
  categoryName: string;
}

export interface ChatbotResponse {
  response_Text: string;
  intent: string;
  intent_Confidence: number;
  recipes: RecipeSuggestion[];
  language_Detected: string;
  sessionId: number;
}

/* ===========================
   CHAT SESSION TYPES
=========================== */

export interface ChatSession {
  id: number;
  title: string;
  lastActive: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface ChatSessionDetails {
  id: number;
  title: string;
  messages: ChatMessage[];
}

/* ===========================
   SEND MESSAGE
=========================== */

export const sendChatMessage = async (
  data: ChatbotRequest
): Promise<ChatbotResponse> => {
  const response = await axiosInstance.post(
    "/chatbot",
    data
  );

  return response.data;
};

/* ===========================
   GET ALL SESSIONS
=========================== */

export const getChatSessions =
  async (): Promise<ChatSession[]> => {
    const response = await axiosInstance.get(
      "/chatbot/sessions"
    );

    return response.data;
  };

/* ===========================
   GET SESSION DETAILS
=========================== */

export const getChatSessionDetails =
  async (
    sessionId: number
  ): Promise<ChatSessionDetails> => {
    const response = await axiosInstance.get(
      `/chatbot/sessions/${sessionId}`
    );

    return response.data;
  };

/* ===========================
   DELETE SESSION
=========================== */

export const deleteChatSession =
  async (
    sessionId: number
  ): Promise<void> => {
    await axiosInstance.delete(
      `/chatbot/sessions/${sessionId}`
    );
  };