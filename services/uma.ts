/**
 * Uma AI Service - Handles all interactions with Google Gemini AI
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { UMA_SYSTEM_PROMPT, UMA_CONFIG, getGreeting } from '@/constants/uma';
import type { RiskProfile } from '@/constants/investment';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface UmaResponse {
  message: string;
  isStreaming?: boolean;
}

/**
 * Initialize the Google AI client
 */
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }

  return new GoogleGenerativeAI(apiKey);
}

/**
 * Create a personalized prompt for Uma based on user context
 */
function createPersonalizedPrompt(
  userMessage: string,
  userName: string,
  riskProfile?: RiskProfile | null
): string {
  const profile = riskProfile ? riskProfile.toUpperCase() : 'Not assessed yet';

  return `${UMA_SYSTEM_PROMPT}

## Current User Context
- User's Name: ${userName}
- Risk Profile: ${profile}
- Previous Context: Recent conversation with user about investments

## User's Message
${userMessage}

Remember to:
1. Address ${userName} by name in your response
2. ${riskProfile ? `Tailor advice for a ${riskProfile} investor` : 'Encourage them to complete the risk assessment'}
3. Be friendly, educational, and include appropriate disclaimers
4. Keep responses concise but informative (2-3 paragraphs max)`;
}

/**
 * Send a message to Uma and get a response
 */
export async function chatWithUma(
  userMessage: string,
  userName: string,
  conversationHistory: ChatMessage[] = [],
  riskProfile?: RiskProfile | null
): Promise<UmaResponse> {
  try {
    const genAI = getAIClient();
    const model = genAI.getGenerativeModel({
      model: UMA_CONFIG.model,
      systemInstruction: UMA_SYSTEM_PROMPT,
    });

    // Create the personalized prompt
    const personalizedPrompt = createPersonalizedPrompt(
      userMessage,
      userName,
      riskProfile
    );

    // Add conversation context
    let fullPrompt = personalizedPrompt;

    if (conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-6);
      const history = recentHistory
        .map(msg => `${msg.role === 'assistant' ? 'Uma' : userName}: ${msg.content}`)
        .join('\n');
      fullPrompt += `\n\n## Recent Conversation\n${history}`;
    }

    // Generate response
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    return {
      message: text.trim(),
      isStreaming: false,
    };
  } catch (error) {
    console.error('Error chatting with Uma:', error);

    // Return a fallback error response
    return {
      message: `${getGreeting(userName)} I'm having trouble connecting right now. Please check your internet connection and try again. If the problem persists, please contact support.`,
      isStreaming: false,
    };
  }
}

/**
 * Send a message to Uma with streaming response (for real-time typing effect)
 */
export async function* chatWithUmaStream(
  userMessage: string,
  userName: string,
  conversationHistory: ChatMessage[] = [],
  riskProfile?: RiskProfile | null
): AsyncGenerator<string, void, unknown> {
  try {
    const genAI = getAIClient();
    const model = genAI.getGenerativeModel({
      model: UMA_CONFIG.model,
      systemInstruction: UMA_SYSTEM_PROMPT,
    });

    // Create the personalized prompt
    const personalizedPrompt = createPersonalizedPrompt(
      userMessage,
      userName,
      riskProfile
    );

    // Add conversation context
    let fullPrompt = personalizedPrompt;

    if (conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-6);
      const history = recentHistory
        .map(msg => `${msg.role === 'assistant' ? 'Uma' : userName}: ${msg.content}`)
        .join('\n');
      fullPrompt += `\n\n## Recent Conversation\n${history}`;
    }

    // Generate streaming response
    const result = await model.generateContentStream(fullPrompt);

    // Yield chunks as they arrive
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        yield chunkText;
      }
    }
  } catch (error) {
    console.error('Error streaming chat with Uma:', error);
    yield `${getGreeting(userName)} I'm having trouble connecting right now. Please try again.`;
  }
}

/**
 * Get a welcome message from Uma for first-time users
 */
export async function getUmaWelcomeMessage(userName: string): Promise<string> {
  try {
    const genAI = getAIClient();
    const model = genAI.getGenerativeModel({
      model: UMA_CONFIG.model,
      systemInstruction: UMA_SYSTEM_PROMPT,
    });

    const prompt = `
User's Name: ${userName}
Risk Profile: Not assessed yet
First-time user

Please provide a warm, welcoming message (2-3 sentences) introducing yourself as Uma and asking how you can help them with their investment journey. Address ${userName} by name.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error generating welcome message:', error);
    return `Hi ${userName}! I'm Uma, your personal AI investment advisor. I'm here to help you make smart investment decisions. What would you like to know?`;
  }
}

/**
 * Validate that the API key is configured
 */
export function validateUmaConfiguration(): { isValid: boolean; error?: string } {
  if (!process.env.GEMINI_API_KEY) {
    return {
      isValid: false,
      error: 'GEMINI_API_KEY is not set. Please add it to your .env file.',
    };
  }

  return { isValid: true };
}
