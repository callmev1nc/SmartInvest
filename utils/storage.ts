/**
 * Utility functions for local storage using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAT_HISTORY_KEY = 'chat_history';
const QUIZ_PROGRESS_KEY = 'quiz_progress';

export interface StorageItem<T = any> {
  key: string;
  data: T;
  timestamp: number;
}

/**
 * Generic function to save data to AsyncStorage
 */
export async function saveItem<T>(key: string, data: T): Promise<void> {
  try {
    const item: StorageItem<T> = {
      key,
      data,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error(`Failed to save item with key ${key}:`, error);
    throw error;
  }
}

/**
 * Generic function to retrieve data from AsyncStorage
 */
export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const itemJson = await AsyncStorage.getItem(key);
    if (!itemJson) return null;

    const item: StorageItem<T> = JSON.parse(itemJson);
    return item.data;
  } catch (error) {
    console.error(`Failed to get item with key ${key}:`, error);
    return null;
  }
}

/**
 * Generic function to remove item from AsyncStorage
 */
export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove item with key ${key}:`, error);
    throw error;
  }
}

/**
 * Clear all app data from AsyncStorage (useful for logout/debugging)
 */
export async function clearAllStorage(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Failed to clear storage:', error);
    throw error;
  }
}

/**
 * Chat history specific functions
 */
export async function saveChatHistory(messages: any[]): Promise<void> {
  // Only save last 50 messages to avoid storage bloat
  const messagesToSave = messages.slice(-50);
  await saveItem(CHAT_HISTORY_KEY, messagesToSave);
}

export async function getChatHistory(): Promise<any[]> {
  const history = await getItem<any[]>(CHAT_HISTORY_KEY);
  return history || [];
}

/**
 * Quiz progress specific functions
 */
export async function saveQuizProgress(progress: {
  currentQuestion: number;
  answers: Record<number, any>;
}): Promise<void> {
  await saveItem(QUIZ_PROGRESS_KEY, progress);
}

export async function getQuizProgress(): Promise<{
  currentQuestion: number;
  answers: Record<number, any>;
} | null> {
  return await getItem(QUIZ_PROGRESS_KEY);
}

export async function clearQuizProgress(): Promise<void> {
  await removeItem(QUIZ_PROGRESS_KEY);
}

/**
 * Get storage size (for debugging)
 */
export async function getStorageSize(): Promise<number> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    let totalSize = 0;

    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        totalSize += value.length;
      }
    }

    return totalSize;
  } catch (error) {
    console.error('Failed to calculate storage size:', error);
    return 0;
  }
}
