/**
 * Translation Service - Uses Google Gemini AI for dynamic translation
 */

import { GoogleGenAI } from '@google/genai';
import type { Language } from '@/contexts/LanguageContext';

const MODEL = 'gemini-3-pro-preview';

/**
 * Initialize the Google AI client
 */
function getAIClient() {
  const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
  }

  return new GoogleGenAI({
    apiKey,
  });
}

/**
 * Language names for the AI
 */
const languageNames: Record<Language, string> = {
  en: 'English',
  zh: 'Simplified Chinese',
  vi: 'Vietnamese',
};

/**
 * Translate text using Gemini AI
 */
export async function translateText(
  text: string,
  targetLanguage: Language
): Promise<string> {
  // Skip translation if target is English
  if (targetLanguage === 'en') {
    return text;
  }

  try {
    const ai = getAIClient();
    const targetLangName = languageNames[targetLanguage];

    const prompt = `Translate the following text to ${targetLangName}. Keep the meaning exactly the same, and maintain any formatting like bullet points, numbered lists, and structure. Do NOT translate or change:
- Proper names (like "Uma", "SmartInvest")
- Currency symbols (like "$100")
- Percentages (like "8%")
- Time periods (like "5+ years")
- Disclaimer emoji "⚠️"

Text to translate:
${text}

IMPORTANT: Return ONLY the translated text, no additional explanation or commentary.`;

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
      contents,
    });

    let fullResponse = '';
    for await (const chunk of response) {
      fullResponse += chunk.text;
    }

    return fullResponse.trim();
  } catch (error) {
    console.error('Translation error:', error);
    // Return original text if translation fails
    return text;
  }
}

/**
 * Translate multiple texts in batch
 */
export async function translateBatch(
  texts: string[],
  targetLanguage: Language
): Promise<string[]> {
  if (targetLanguage === 'en') {
    return texts;
  }

  try {
    const ai = getAIClient();
    const targetLangName = languageNames[targetLanguage];

    const prompt = `Translate the following texts to ${targetLangName}. Keep the meaning exactly the same. Do NOT translate proper names like "Uma" or "SmartInvest".

${texts.map((text, i) => `Text ${i + 1}: ${text}`).join('\n\n')}

Return the translations in the same format:
Translation 1: [translated text]
Translation 2: [translated text]
etc.`;

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
      contents,
    });

    let fullResponse = '';
    for await (const chunk of response) {
      fullResponse += chunk.text;
    }

    // Parse the response
    const translations: string[] = [];
    const lines = fullResponse.split('\n');
    for (const line of lines) {
      const match = line.match(/^Translation \d+:\s*(.+)$/i);
      if (match) {
        translations.push(match[1].trim());
      }
    }

    // If parsing failed, return original texts
    if (translations.length !== texts.length) {
      return texts;
    }

    return translations;
  } catch (error) {
    console.error('Batch translation error:', error);
    return texts;
  }
}
