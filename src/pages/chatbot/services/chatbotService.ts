import { sendChatMessage } from '../../../api/chatbotApi';

export const fetchAIResponse = async (
  userMessage: string,
  sessionId?: number
) => {
  const response = await sendChatMessage({
    message: userMessage,
    sessionId,
  });

  return {
    content: response.response_Text,
    recipes: response.recipes,
    sessionId: response.sessionId,
  };
};