/**
 * Rate Limiter Tests
 *
 * Tests for the API rate limiting functionality to ensure
 * we stay within quota limits.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RateLimiter } from '../rateLimiter';

describe('RateLimiter', () => {
  let rateLimiter: RateLimiter;

  beforeEach(() => {
    // Create a fresh rate limiter for each test
    // 60 requests per minute, 100 requests per day
    rateLimiter = new RateLimiter(60, 100);
  });

  describe('Requests Per Minute (RPM)', () => {
    it('should allow requests within RPM limit', async () => {
      const mockFn = vi.fn().mockResolvedValue('success');

      // Make 3 requests quickly
      await Promise.all([
        rateLimiter.execute(mockFn),
        rateLimiter.execute(mockFn),
        rateLimiter.execute(mockFn),
      ]);

      expect(mockFn).toHaveBeenCalledTimes(3);
    });

    it('should space out requests to respect RPM limit', async () => {
      const mockFn = vi.fn().mockResolvedValue('success');
      const startTime = Date.now();

      // Make requests that would exceed RPM without limiting
      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(rateLimiter.execute(mockFn));
      }

      await Promise.all(promises);

      const duration = Date.now() - startTime;

      // Should take at least: (requests - 1) * (60000 / RPM) * 1.1
      // For 5 requests at 60 RPM: (5 - 1) * (1000ms) * 1.1 = 4400ms minimum
      expect(duration).toBeGreaterThan(4000);
    });
  });

  describe('Requests Per Day (RPD)', () => {
    it('should track daily request count', async () => {
      const mockFn = vi.fn().mockResolvedValue('success');

      // Make some requests
      for (let i = 0; i < 5; i++) {
        await rateLimiter.execute(mockFn);
      }

      const usage = rateLimiter.getDailyUsage();
      expect(usage.used).toBe(5);
      expect(usage.limit).toBe(100);
      expect(usage.remaining).toBe(95);
    });

    it('should reject requests when daily limit is exceeded', async () => {
      const mockFn = vi.fn().mockResolvedValue('success');

      // Mock the daily limit check to simulate hitting the limit
      const checkLimitSpy = vi.spyOn(rateLimiter as any, 'checkDailyLimit');
      checkLimitSpy.mockReturnValue(true);

      const result = rateLimiter.execute(mockFn);

      await expect(result).rejects.toThrow('Daily API quota exceeded');
    });
  });

  describe('Daily Usage Tracking', () => {
    it('should return correct daily usage statistics', async () => {
      const mockFn = vi.fn().mockResolvedValue('success');

      await rateLimiter.execute(mockFn);
      await rateLimiter.execute(mockFn);

      const usage = rateLimiter.getDailyUsage();

      expect(usage).toMatchObject({
        used: 2,
        limit: 100,
        remaining: 98,
      });

      expect(usage.resetsAt).toBeInstanceOf(Date);
    });
  });

  describe('Queue Processing', () => {
    it('should process requests in order', async () => {
      const mockFn = vi.fn((index: number) => Promise.resolve(index));

      // Add multiple requests to queue
      const promises = [
        rateLimiter.execute(() => mockFn(1)),
        rateLimiter.execute(() => mockFn(2)),
        rateLimiter.execute(() => mockFn(3)),
      ];

      const settled = await Promise.all(promises);

      expect(settled).toEqual([1, 2, 3]);
    });

    it('should handle errors in requests gracefully', async () => {
      const errorFn = vi.fn().mockRejectedValue(new Error('API Error'));
      const successFn = vi.fn().mockResolvedValue('success');

      // First request fails, second succeeds
      const results = await Promise.allSettled([
        rateLimiter.execute(errorFn),
        rateLimiter.execute(successFn),
      ]);

      expect(results[0].status).toBe('rejected');
      expect(results[1].status).toBe('fulfilled');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid requests gracefully', async () => {
      const mockFn = vi.fn().mockResolvedValue('success');

      // Make many rapid requests
      const promises = Array.from({ length: 10 }, () =>
        rateLimiter.execute(mockFn)
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(10);
      expect(mockFn).toHaveBeenCalledTimes(10);
    });

    it('should handle empty queue', async () => {
      const mockFn = vi.fn().mockResolvedValue('success');

      // Process with empty queue should not throw
      await rateLimiter.execute(mockFn);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});
