/**
 * Uma AI Service - Handles all interactions with Google Gemini AI
 */

import { GoogleGenAI } from '@google/genai';
import { UMA_SYSTEM_PROMPT, getGreeting } from '@/constants/uma';
import type { RiskProfile } from '@/constants/investment';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date | string;
}

export interface UmaResponse {
  message: string;
}

const MODEL = 'gemini-3-pro-preview';

/**
 * Initialize the Google AI client
 */
function getAIClient() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
  }

  return new GoogleGenAI({
    apiKey,
  });
}

/**
 * Get the tools configuration with Google Search
 */
function getTools() {
  return [
    {
      googleSearch: {},
    },
  ];
}

/**
 * Get the configuration with thinking and tools
 */
function getConfig() {
  return {
    thinkingConfig: {
      thinkingLevel: 'HIGH',
    },
    tools: getTools(),
  };
}

/**
 * Create a personalized prompt for Uma based on user context
 */
function createPersonalizedPrompt(
  userMessage: string,
  userName: string,
  riskProfile?: RiskProfile | null,
  conversationHistory: ChatMessage[] = []
): string {
  const profile = riskProfile ? riskProfile.toUpperCase() : 'Not assessed yet';

  let prompt = `${UMA_SYSTEM_PROMPT}

## Current User Context
- User's Name: ${userName}
- Risk Profile: ${profile}

## User's Message
${userMessage}

Remember to:
1. Address ${userName} by name in your response
2. ${riskProfile ? `Tailor advice for a ${riskProfile} investor` : 'Encourage them to complete the risk assessment'}
3. Be friendly, educational, and include appropriate disclaimers
4. Keep responses concise but informative (2-3 paragraphs max)`;

  // Add conversation context
  if (conversationHistory.length > 0) {
    const recentHistory = conversationHistory.slice(-6);
    const history = recentHistory
      .map(msg => `${msg.role === 'assistant' ? 'Uma' : userName}: ${msg.content}`)
      .join('\n');
    prompt += `\n\n## Recent Conversation\n${history}`;
  }

  return prompt;
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
    const ai = getAIClient();
    const config = getConfig();
    const prompt = createPersonalizedPrompt(
      userMessage,
      userName,
      riskProfile,
      conversationHistory
    );

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ];

    const response = await ai.models.generateContentStream({
      model: MODEL,
      config,
      contents,
    });

    let fullResponse = '';
    for await (const chunk of response) {
      fullResponse += chunk.text;
    }

    return {
      message: fullResponse.trim(),
    };
  } catch (error) {
    console.error('Error chatting with Uma:', error);

    // Return a fallback error response
    return {
      message: `${getGreeting(userName)} I'm having trouble connecting right now. Please check your internet connection and try again. If the problem persists, please contact support.`,
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
    const ai = getAIClient();
    const config = getConfig();
    const prompt = createPersonalizedPrompt(
      userMessage,
      userName,
      riskProfile,
      conversationHistory
    );

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ];

    const response = await ai.models.generateContentStream({
      model: MODEL,
      config,
      contents,
    });

    // Yield chunks as they arrive
    for await (const chunk of response) {
      if (chunk.text) {
        yield chunk.text;
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
    const ai = getAIClient();
    const config = getConfig();

    const prompt = `User's Name: ${userName}
Risk Profile: Not assessed yet
First-time user

Please provide a warm, welcoming message (2-3 sentences) introducing yourself as Uma and asking how you can help them with their investment journey. Address ${userName} by name.`;

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ];

    const result = await ai.models.generateContentStream({
      model: MODEL,
      config,
      contents,
    });

    let fullResponse = '';
    for await (const chunk of result) {
      fullResponse += chunk.text;
    }

    return fullResponse.trim();
  } catch (error) {
    console.error('Error generating welcome message:', error);
    return `Hi ${userName}! I'm Uma, your personal AI investment advisor. I'm here to help you make smart investment decisions. What would you like to know?`;
  }
}

/**
 * Validate that the API key is configured
 */
export function validateUmaConfiguration(): { isValid: boolean; error?: string } {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    return {
      isValid: false,
      error: 'VITE_GEMINI_API_KEY is not set. Please add it to your .env file.',
    };
  }

  return { isValid: true };
}
