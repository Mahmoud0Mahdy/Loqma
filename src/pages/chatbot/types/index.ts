export interface ChatbotRecipe {
  id: number;
  title: string;
  imageUrl: string;
  difficultyLevel: string;
  prepTime: number;
  isSaved: boolean;
  servings: number;
  categoryName: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  recipes?: ChatbotRecipe[];
  timestamp: Date;
}

export interface AIResponse {
  content: string;
  recipes?: ChatbotRecipe[];
  sessionId?: number;
}