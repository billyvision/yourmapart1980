/**
 * Database Retry Utility
 * Handles transient network errors with exponential backoff
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffFactor: 2,
};

/**
 * Sleep for a specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if error is retryable
 */
function isRetryableError(error: unknown): boolean {
  if (!error) return false;

  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorCode = (error as any)?.code;

  // Network errors
  const networkErrors = [
    'EAI_AGAIN', // DNS lookup failed
    'ECONNREFUSED', // Connection refused
    'ECONNRESET', // Connection reset
    'ETIMEDOUT', // Connection timeout
    'ENOTFOUND', // DNS not found
    'ENETUNREACH', // Network unreachable
  ];

  // Check error code
  if (networkErrors.includes(errorCode)) {
    return true;
  }

  // Check error message
  const retryableMessages = [
    'getaddrinfo',
    'connect timeout',
    'connection timeout',
    'network error',
    'ECONNRESET',
    'socket hang up',
    'Client has encountered a connection error',
  ];

  return retryableMessages.some(msg =>
    errorMessage.toLowerCase().includes(msg.toLowerCase())
  );
}

/**
 * Retry a database query with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: unknown;
  let delay = opts.initialDelay;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on last attempt or non-retryable errors
      if (attempt === opts.maxRetries || !isRetryableError(error)) {
        throw error;
      }

      console.warn(
        `Database query failed (attempt ${attempt + 1}/${opts.maxRetries + 1}), retrying in ${delay}ms...`,
        error instanceof Error ? error.message : String(error)
      );

      // Wait with exponential backoff
      await sleep(delay);
      delay = Math.min(delay * opts.backoffFactor, opts.maxDelay);
    }
  }

  throw lastError;
}

/**
 * Execute database query with retry logic and timeout
 */
export async function queryWithRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions & { timeout?: number } = {}
): Promise<T> {
  const timeout = options.timeout || 30000; // 30 second default timeout

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Database query timeout after ${timeout}ms`));
    }, timeout);
  });

  return Promise.race([
    withRetry(fn, options),
    timeoutPromise,
  ]);
}
