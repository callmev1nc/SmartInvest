/**
 * Application Configuration Constants
 *
 * Centralized configuration for API, UI, rate limiting, and other
 * application-wide settings. This eliminates magic numbers and makes
 * the codebase easier to maintain.
 */

/**
 * API Configuration
 */
export const API_CONFIG = {
  /**
   * Google Gemini AI Model to use
   */
  MODEL: 'gemini-3-pro-preview' as const,

  /**
   * Rate limiting settings
   */
  RATE_LIMIT: {
    /**
     * Requests per minute limit (with 10% safety margin under the 25 RPM quota)
     */
    RPM: 24,

    /**
     * Requests per day limit (with 10% safety margin under the 250 RPD quota)
     */
    RPD: 240,
  } as const,

  /**
   * API timeout in milliseconds
   */
  TIMEOUT: 30000,

  /**
   * Maximum retry attempts for failed API calls
   */
  MAX_RETRIES: 3,
} as const;

/**
 * User Interface Configuration
 */
export const UI_CONFIG = {
  /**
   * Maximum number of chat messages to keep in memory
   * Prevents memory leaks during long sessions
   */
  MAX_MESSAGES: 100,

  /**
   * Maximum length for user name input
   */
  MAX_NAME_LENGTH: 50,

  /**
   * Minimum length for user name input
   */
  MIN_NAME_LENGTH: 2,

  /**
   * Translation cache size
   */
  TRANSLATION_CACHE_SIZE: 50,

  /**
   * Characters per translation batch
   */
  CHARS_PER_TRANSLATION_BATCH: 1000,

  /**
   * Maximum chat message length
   */
  MAX_CHAT_MESSAGE_LENGTH: 5000,

  /**
   * Maximum prompt length for AI API
   */
  MAX_PROMPT_LENGTH: 10000,
} as const;

/**
 * Storage Configuration
 */
export const STORAGE_CONFIG = {
  /**
   * LocalStorage keys
   */
  KEYS: {
    USER_DATA: 'smartinvest_user_data',
    THEME: 'smartinvest_theme',
    LANGUAGE: 'smartinvest_language',
    TRANSLATION_CACHE: 'smartinvest_translations',
    DAILY_UPDATES_CACHE: 'smartinvest_daily_updates',
    DAILY_UPDATES_DATE: 'smartinvest_daily_updates_date',
  } as const,

  /**
   * Cache duration in milliseconds (24 hours)
   */
  CACHE_DURATION: 24 * 60 * 60 * 1000,

  /**
   * Daily updates cache duration in milliseconds (1 hour)
   */
  DAILY_UPDATES_CACHE_DURATION: 60 * 60 * 1000,
} as const;

/**
 * Validation Configuration
 */
export const VALIDATION_CONFIG = {
  /**
   * Regular expressions for validation
   */
  PATTERNS: {
    /**
     * Email validation regex
     */
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

    /**
     * Name validation (letters, spaces, hyphens, apostrophes only)
     */
    NAME: /^[a-zA-Z\u00C0-\u00FF\u0100-\u017F\s\-']+$/,

    /**
     * URL validation
     */
    URL: /^https?:\/\/.+/,
  } as const,

  /**
   * Minimum and maximum lengths for various inputs
   */
  LENGTHS: {
    MESSAGE_MIN: 1,
    MESSAGE_MAX: 5000,
    NAME_MIN: 2,
    NAME_MAX: 50,
    QUIZ_ANSWERS_REQUIRED: 10,
  } as const,
} as const;

/**
 * Animation Configuration
 */
export const ANIMATION_CONFIG = {
  /**
   * Durations in milliseconds
   */
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  } as const,

  /**
   * Easing functions
   */
  EASING: {
    DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    IN_OUT: 'cubic-bezier(0.4, 0, 0.6, 1)',
    BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  } as const,
} as const;

/**
 * Breakpoints for responsive design
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

/**
 * Risk Level Configuration
 */
export const RISK_CONFIG = {
  /**
   * Risk level ranges (1-10 scale)
   */
  LEVELS: {
    CONSERVATIVE: { min: 1, max: 3 },
    MODERATE: { min: 4, max: 6 },
    AGGRESSIVE: { min: 7, max: 10 },
  } as const,

  /**
   * Color mappings for risk levels
   */
  COLORS: {
    LOW: '#10B981',      // Green
    MEDIUM: '#F59E0B',   // Yellow/Orange
    HIGH: '#EF4444',     // Red
  } as const,
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  API_KEY_MISSING: 'VITE_GEMINI_API_KEY is not set. Please add it to your .env file.',
  API_QUOTA_EXCEEDED: 'Daily API quota exceeded. Please try again tomorrow.',
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  INVALID_INPUT: 'Invalid input. Please try again.',
  SAVE_FAILED: 'Failed to save data. Please try again.',
} as const;

/**
 * Feature Flags
 * Enable/disable experimental or optional features
 */
export const FEATURES = {
  /**
   * Enable Google Search integration for AI
   */
  GOOGLE_SEARCH_ENABLED: true,

  /**
   * Enable translation caching
   */
  TRANSLATION_CACHE_ENABLED: true,

  /**
   * Enable daily updates caching
   */
  DAILY_UPDATES_CACHE_ENABLED: true,

  /**
   * Show debug information in development
   */
  get DEBUG_MODE(): boolean {
    return import.meta.env.DEV;
  },
} as const;

/**
 * Default values for user preferences
 */
export const DEFAULTS = {
  THEME: 'light' as const,
  LANGUAGE: 'en' as const,
  RISK_PROFILE: null,
} as const;
