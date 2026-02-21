/**
 * Input Sanitization Utilities
 *
 * Provides functions to sanitize user input and prevent XSS (Cross-Site Scripting)
 * and injection attacks. All user-generated content should be sanitized before
 * being rendered in the DOM or sent to external APIs.
 *
 * @see https://owasp.org/www-community/attacks/xss/
 */

/**
 * Sanitizes user input for safe rendering in the DOM.
 * Removes potentially dangerous HTML tags and characters.
 *
 * @param input - Raw user input string
 * @returns Sanitized string safe for DOM rendering
 *
 * @example
 * ```ts
 * const safe = sanitizeUserInput('<script>alert("xss")</script>');
 * // Returns: '&lt;script&gt;alert("xss")&lt;/script&gt;'
 * ```
 */
export function sanitizeUserInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Sanitizes prompts before sending to AI API.
 * Removes HTML tags and limits length to prevent token limit issues.
 *
 * @param prompt - Raw prompt string
 * @param maxLength - Maximum allowed length (default: 10000 characters)
 * @returns Sanitized prompt safe for API calls
 *
 * @example
 * ```ts
 * const safe = sanitizePrompt('Tell me about <b>stocks</b>', 1000);
 * // Returns: 'Tell me about stocks'
 * ```
 */
export function sanitizePrompt(prompt: string, maxLength: number = 10000): string {
  if (typeof prompt !== 'string') {
    return '';
  }

  // Remove HTML tags
  let sanitized = prompt.replace(/<[^>]*>/g, '');

  // Remove potentially dangerous patterns
  sanitized = sanitized
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers like onclick=

  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }

  return sanitized.trim();
}

/**
 * Sanitizes user name input.
 * Enforces basic naming conventions (letters, spaces, hyphens, apostrophes).
 *
 * @param name - Raw name input
 * @param maxLength - Maximum allowed length (default: 50 characters)
 * @returns Sanitized name or empty string if invalid
 *
 * @example
 * ```ts
 * const safe = sanitizeName('John<script>alert("xss")</script>');
 * // Returns: 'John'
 * ```
 */
export function sanitizeName(name: string, maxLength: number = 50): string {
  if (typeof name !== 'string') {
    return '';
  }

  // Remove HTML tags and special characters
  let sanitized = name.replace(/<[^>]*>/g, '');

  // Allow only letters, spaces, hyphens, apostrophes, and common name characters
  sanitized = sanitized.replace(/[^a-zA-Z\u00C0-\u00FF\u0100-\u017F\s\-']/g, '');

  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }

  return sanitized.trim();
}

/**
 * Validates and sanitizes email input.
 *
 * @param email - Raw email input
 * @returns Sanitized email or empty string if invalid
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') {
    return '';
  }

  const sanitized = email.trim().toLowerCase();

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(sanitized)) {
    return '';
  }

  return sanitized;
}

/**
 * Removes potentially dangerous URL schemes from input.
 *
 * @param input - Input string that may contain URLs
 * @returns String with dangerous URL schemes removed
 */
export function sanitizeURLSchemes(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/onload\s*=/gi, '')
    .replace(/onerror\s*=/gi, '');
}

/**
 * Escapes special characters for use in regular expressions.
 *
 * @param string - String to escape
 * @returns Escaped string safe for regex use
 */
export function escapeRegExp(string: string): string {
  if (typeof string !== 'string') {
    return '';
  }

  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Truncates text to a maximum length and adds ellipsis if needed.
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add when truncated (default: '...')
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (typeof text !== 'string') {
    return '';
  }

  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Sanitizes JSON input to prevent injection attacks.
 *
 * @param jsonString - Raw JSON string
 * @returns Parsed and validated object, or null if invalid
 */
export function sanitizeAndParseJSON<T>(jsonString: string): T | null {
  if (typeof jsonString !== 'string') {
    return null;
  }

  try {
    // Remove dangerous patterns
    const sanitized = jsonString
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');

    const parsed = JSON.parse(sanitized);

    // Basic validation: ensure it's an object or array
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed as T;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Comprehensive sanitization for chat messages.
 * Combines multiple sanitization functions for maximum security.
 *
 * @param message - Raw chat message
 * @returns Fully sanitized message safe for display and API calls
 */
export function sanitizeChatMessage(message: string): string {
  if (typeof message !== 'string') {
    return '';
  }

  let sanitized = message;

  // Remove HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, '');

  // Remove dangerous URL schemes
  sanitized = sanitizeURLSchemes(sanitized);

  // Sanitize for DOM rendering
  sanitized = sanitizeUserInput(sanitized);

  // Limit length (reasonable chat message size)
  const MAX_CHAT_LENGTH = 5000;
  if (sanitized.length > MAX_CHAT_LENGTH) {
    sanitized = truncateText(sanitized, MAX_CHAT_LENGTH);
  }

  return sanitized;
}
