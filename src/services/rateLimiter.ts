/**
 * Rate Limiter for API requests
 * Ensures we don't exceed the API quota (24 RPM and 240 RPD max for safety)
 */

interface PendingRequest {
  resolve: (value: any) => void;
  reject: (reason: any) => void;
  fn: () => Promise<any>;
}

export class RateLimiter {
  private minInterval: number; // milliseconds between requests
  private maxRequestsPerDay: number;
  private lastRequestTime: number = 0;
  private queue: PendingRequest[] = [];
  private processing = false;

  // Daily tracking
  private dailyRequestCount: number = 0;
  private dailyResetTime: number;

  /**
   * Create a rate limiter
   * @param requestsPerMinute Maximum requests per minute
   * @param requestsPerDay Maximum requests per day
   */
  constructor(requestsPerMinute: number, requestsPerDay: number) {
    // Convert to milliseconds between requests, add 10% safety margin
    this.minInterval = (60000 / requestsPerMinute) * 1.1;
    this.maxRequestsPerDay = requestsPerDay;

    // Reset daily counter at midnight
    this.calculateNextReset();
  }

  /**
   * Calculate the next midnight reset time
   */
  private calculateNextReset() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    this.dailyResetTime = tomorrow.getTime();
  }

  /**
   * Check if daily limit has been exceeded
   */
  private checkDailyLimit(): boolean {
    const now = Date.now();

    // Reset counter if we've passed the reset time
    if (now >= this.dailyResetTime) {
      this.dailyRequestCount = 0;
      this.calculateNextReset();
    }

    return this.dailyRequestCount >= this.maxRequestsPerDay;
  }

  /**
   * Execute a function with rate limiting
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ resolve, reject, fn });
      this.processQueue();
    });
  }

  /**
   * Process the queued requests
   */
  private async processQueue() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      // Check daily limit
      if (this.checkDailyLimit()) {
        // Reject all remaining requests for today
        while (this.queue.length > 0) {
          const request = this.queue.shift()!;
          request.reject(new Error('Daily API quota exceeded. Please try again tomorrow.'));
        }
        this.processing = false;
        return;
      }

      const request = this.queue.shift()!;

      // Wait until we can make the next request
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;

      if (timeSinceLastRequest < this.minInterval) {
        const waitTime = this.minInterval - timeSinceLastRequest;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }

      this.lastRequestTime = Date.now();
      this.dailyRequestCount++;

      try {
        const result = await request.fn();
        request.resolve(result);
      } catch (error) {
        request.reject(error);
      }
    }

    this.processing = false;
  }

  /**
   * Get current daily usage
   */
  getDailyUsage(): { used: number; limit: number; remaining: number; resetsAt: Date } {
    const now = Date.now();
    if (now >= this.dailyResetTime) {
      this.dailyRequestCount = 0;
      this.calculateNextReset();
    }

    return {
      used: this.dailyRequestCount,
      limit: this.maxRequestsPerDay,
      remaining: this.maxRequestsPerDay - this.dailyRequestCount,
      resetsAt: new Date(this.dailyResetTime),
    };
  }
}

/**
 * Global rate limiter instance for Google AI API
 * Set to 24 RPM (under the 25 RPM limit)
 * Set to 240 RPD (under the 250 RPD limit)
 */
export const googleAIRateLimiter = new RateLimiter(24, 240);
