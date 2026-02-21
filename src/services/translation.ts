/**
 * Translation Service - Uses Google Gemini AI for dynamic translation
 * Features: Intelligent caching to minimize API calls
 */

import { GoogleGenAI } from '@google/genai';
import type { Language } from '@/contexts/LanguageContext';
import { API_CONFIG, ERROR_MESSAGES } from '@/constants/config';

const MODEL = API_CONFIG.MODEL;

/**
 * Translation Cache - Stores translated texts to avoid redundant API calls
 * Key format: "text|language"
 * Limited to 500 entries to prevent memory issues
 */
class TranslationCache {
  private cache = new Map<string, string>();
  private maxEntries = 500;

  set(key: string, value: string): void {
    // If cache is full, remove oldest entry (first entry)
    if (this.cache.size >= this.maxEntries) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  get(key: string): string | undefined {
    return this.cache.get(key);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}

// Global cache instance
const translationCache = new TranslationCache();

/**
 * AI Client Cache - Reuse the same client instance
 */
let aiClient: GoogleGenAI | null = null;

/**
 * Initialize the Google AI client (cached)
 */
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error(ERROR_MESSAGES.API_KEY_MISSING);
    }

    aiClient = new GoogleGenAI({ apiKey });
  }

  return aiClient;
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
 * Generate cache key from text and language
 */
function getCacheKey(text: string, language: Language): string {
  return `${text}|${language}`;
}

/**
 * Translate text using Gemini AI with caching
 */
export async function translateText(
  text: string,
  targetLanguage: Language
): Promise<string> {
  // Skip translation if target is English
  if (targetLanguage === 'en') {
    return text;
  }

  // Check cache first
  const cacheKey = getCacheKey(text, targetLanguage);
  const cached = translationCache.get(cacheKey);
  if (cached) {
    return cached;
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

    const translated = fullResponse.trim();

    // Cache the result
    translationCache.set(cacheKey, translated);

    return translated;
  } catch (error) {
    console.error('Translation error:', error);
    // Return original text if translation fails
    return text;
  }
}

/**
 * Translate multiple texts in batch with caching
 * Checks cache for each text before making API call
 */
export async function translateBatch(
  texts: string[],
  targetLanguage: Language
): Promise<string[]> {
  if (targetLanguage === 'en') {
    return texts;
  }

  // Check cache for each text
  const results: string[] = [];
  const uncachedIndices: number[] = [];
  const uncachedTexts: string[] = [];

  texts.forEach((text, index) => {
    const cacheKey = getCacheKey(text, targetLanguage);
    const cached = translationCache.get(cacheKey);

    if (cached !== undefined) {
      results[index] = cached;
    } else {
      uncachedIndices.push(index);
      uncachedTexts.push(text);
    }
  });

  // If all texts were cached, return immediately
  if (uncachedTexts.length === 0) {
    return results;
  }

  // Translate only the uncached texts
  try {
    const ai = getAIClient();
    const targetLangName = languageNames[targetLanguage];

    const prompt = `Translate the following texts to ${targetLangName}. Keep the meaning exactly the same. Do NOT translate proper names like "Uma" or "SmartInvest".

${uncachedTexts.map((text, i) => `Text ${i + 1}: ${text}`).join('\n\n')}

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

    // If parsing failed, return original texts for uncached items
    if (translations.length !== uncachedTexts.length) {
      uncachedIndices.forEach((index, i) => {
        results[index] = uncachedTexts[i];
      });
    } else {
      // Cache and assign the translations
      translations.forEach((translation, i) => {
        const index = uncachedIndices[i];
        const text = uncachedTexts[i];
        const cacheKey = getCacheKey(text, targetLanguage);

        translationCache.set(cacheKey, translation);
        results[index] = translation;
      });
    }

    return results;
  } catch (error) {
    console.error('Batch translation error:', error);
    // Return original texts for uncached items
    uncachedIndices.forEach((index, i) => {
      results[index] = uncachedTexts[i];
    });
    return results;
  }
}

/**
 * Clear the translation cache
 * Useful for freeing memory or forcing fresh translations
 */
export function clearTranslationCache(): void {
  translationCache.clear();
}

/**
 * Get cache statistics
 */
export function getTranslationCacheStats(): { size: number; maxEntries: number } {
  return {
    size: translationCache.size,
    maxEntries: 500,
  };
}
