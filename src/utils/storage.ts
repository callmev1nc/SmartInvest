/**
 * LocalStorage Helper Utility
 *
 * Provides a safe, typed interface for localStorage operations with
 * automatic error handling, JSON parsing/stringifying, and type safety.
 *
 * All localStorage operations should use this utility instead of direct
 * localStorage access to ensure consistent error handling.
 */

import { STORAGE_CONFIG } from '@/constants/config';

/**
 * Storage helper class for safe localStorage operations
 *
 * @example
 * ```ts
 * // Save data
 * StorageHelper.set('user', { name: 'John', age: 30 });
 *
 * // Retrieve data
 * const user = StorageHelper.get<User>('user', { name: '', age: 0 });
 *
 * // Remove data
 * StorageHelper.remove('user');
 *
 * // Clear all
 * StorageHelper.clear();
 * ```
 */
export class StorageHelper {
  /**
   * Retrieve data from localStorage with error handling
   *
   * @param key - Storage key
   * @param defaultValue - Default value if key doesn't exist or on error
   * @returns Parsed data from storage or default value
   *
   * @example
   * ```ts
   * const userData = StorageHelper.get<UserData>(
   *   STORAGE_CONFIG.KEYS.USER_DATA,
   *   { name: '', riskProfile: null }
   * );
   * ```
   */
  static get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);

      if (item === null) {
        return defaultValue;
      }

      // Parse JSON
      const parsed = JSON.parse(item) as T;

      // Validate parsed data
      if (parsed === null || parsed === undefined) {
        return defaultValue;
      }

      return parsed;
    } catch (error) {
      // Handle quota exceeded error
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error(`Storage quota exceeded for key "${key}".`, error);
        // Try to clear some space and retry
        try {
          StorageHelper.clearOldCache();
          return StorageHelper.get(key, defaultValue);
        } catch {
          return defaultValue;
        }
      }

      console.error(`Storage get error for key "${key}":`, error);
      return defaultValue;
    }
  }

  /**
   * Save data to localStorage with error handling
   *
   * @param key - Storage key
   * @param value - Value to store (will be JSON stringified)
   * @returns true if successful, false otherwise
   *
   * @example
   * ```ts
   * const success = StorageHelper.set<UserData>(
   *   STORAGE_CONFIG.KEYS.USER_DATA,
   *   { name: 'John', riskProfile: 'moderate' }
   * );
   * if (!success) {
   *   console.error('Failed to save user data');
   * }
   * ```
   */
  static set<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);

      if (serialized === undefined) {
        console.error(`Cannot store undefined value for key "${key}"`);
        return false;
      }

      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      // Handle quota exceeded error
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error(`Storage quota exceeded for key "${key}".`, error);

        // Try to free up space
        try {
          StorageHelper.clearOldCache();
          // Retry after clearing cache
          localStorage.setItem(key, JSON.stringify(value));
          return true;
        } catch (retryError) {
          console.error(`Failed to save "${key}" even after clearing cache.`, retryError);
          return false;
        }
      }

      console.error(`Storage set error for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Remove a specific item from localStorage
   *
   * @param key - Storage key to remove
   *
   * @example
   * ```ts
   * StorageHelper.remove(STORAGE_CONFIG.KEYS.USER_DATA);
   * ```
   */
  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Storage remove error for key "${key}":`, error);
    }
  }

  /**
   * Check if a key exists in localStorage
   *
   * @param key - Storage key to check
   * @returns true if key exists, false otherwise
   *
   * @example
   * ```ts
   * if (StorageHelper.has(STORAGE_CONFIG.KEYS.USER_DATA)) {
   *   const userData = StorageHelper.get('user_data', {});
   * }
   * ```
   */
  static has(key: string): boolean {
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error(`Storage has error for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Clear all items from localStorage
   *
   * Warning: This will remove all stored data
   *
   * @example
   * ```ts
   * StorageHelper.clear();
   * ```
   */
  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  }

  /**
   * Clear only application-specific keys (preserves other data)
   *
   * @example
   * ```ts
   * StorageHelper.clearAppData();
   * ```
   */
  static clearAppData(): void {
    try {
      Object.values(STORAGE_CONFIG.KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Storage clearAppData error:', error);
    }
  }

  /**
   * Get all keys from localStorage
   *
   * @returns Array of all storage keys
   */
  static getAllKeys(): string[] {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Storage getAllKeys error:', error);
      return [];
    }
  }

  /**
   * Get storage size in bytes (approximate)
   *
   * @returns Approximate size in bytes
   */
  static getStorageSize(): number {
    try {
      let total = 0;

      for (const key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
          total += localStorage[key].length + key.length;
        }
      }

      return total;
    } catch (error) {
      console.error('Storage getStorageSize error:', error);
      return 0;
    }
  }

  /**
   * Clear old cache data to free up space
   * Removes items older than CACHE_DURATION
   *
   * @private
   */
  private static clearOldCache(): void {
    try {
      const now = Date.now();
      const cacheKeys = [
        STORAGE_CONFIG.KEYS.TRANSLATION_CACHE,
        STORAGE_CONFIG.KEYS.DAILY_UPDATES_CACHE,
      ];

      cacheKeys.forEach(key => {
        const cached = this.get(key, null);

        if (cached && typeof cached === 'object' && 'timestamp' in cached) {
          const age = now - (cached as { timestamp: number }).timestamp;

          if (age > STORAGE_CONFIG.CACHE_DURATION) {
            this.remove(key);
          }
        }
      });
    } catch (error) {
      console.error('Storage clearOldCache error:', error);
    }
  }

  /**
   * Export all app data as JSON
   *
   * @returns JSON string of all app data
   */
  static exportData(): string {
    try {
      const data: Record<string, unknown> = {};

      Object.values(STORAGE_CONFIG.KEYS).forEach(key => {
        const value = localStorage.getItem(key);
        if (value !== null) {
          data[key] = JSON.parse(value);
        }
      });

      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Storage exportData error:', error);
      return '{}';
    }
  }

  /**
   * Import data from JSON
   *
   * @param jsonData - JSON string to import
   * @returns true if successful, false otherwise
   */
  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);

      Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
      });

      return true;
    } catch (error) {
      console.error('Storage importData error:', error);
      return false;
    }
  }
}

/**
 * Typed storage helpers for common data types
 */
export class TypedStorage {
  /**
   * Get/set strings
   */
  static getString(key: string, defaultValue: string = ''): string {
    return StorageHelper.get(key, defaultValue);
  }

  static setString(key: string, value: string): boolean {
    return StorageHelper.set(key, value);
  }

  /**
   * Get/set numbers
   */
  static getNumber(key: string, defaultValue: number = 0): number {
    return StorageHelper.get(key, defaultValue);
  }

  static setNumber(key: string, value: number): boolean {
    return StorageHelper.set(key, value);
  }

  /**
   * Get/set booleans
   */
  static getBoolean(key: string, defaultValue: boolean = false): boolean {
    return StorageHelper.get(key, defaultValue);
  }

  static setBoolean(key: string, value: boolean): boolean {
    return StorageHelper.set(key, value);
  }

  /**
   * Get/set objects
   */
  static getObject<T extends Record<string, unknown>>(
    key: string,
    defaultValue: T
  ): T {
    return StorageHelper.get(key, defaultValue);
  }

  static setObject<T extends Record<string, unknown>>(key: string, value: T): boolean {
    return StorageHelper.set(key, value);
  }

  /**
   * Get/set arrays
   */
  static getArray<T>(key: string, defaultValue: T[] = []): T[] {
    return StorageHelper.get(key, defaultValue);
  }

  static setArray<T>(key: string, value: T[]): boolean {
    return StorageHelper.set(key, value);
  }
}

export default StorageHelper;
