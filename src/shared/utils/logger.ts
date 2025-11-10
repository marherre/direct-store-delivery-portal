/**
 * Centralized logging utility
 * Provides structured logging with different levels
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Internal log method
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    };

    // In development: use console with colors
    if (this.isDevelopment) {
      const consoleMethod = console[level] || console.log;
      const prefix = `[${new Date().toLocaleTimeString()}] ${level.toUpperCase()}`;
      
      if (error) {
        consoleMethod(`${prefix}: ${message}`, context || '', error);
      } else {
        consoleMethod(`${prefix}: ${message}`, context || '');
      }
    }

    // In production: send to logging service
    // TODO: Integrate with logging service (Sentry, LogRocket, etc.)
    if (!this.isDevelopment && level === 'error') {
      // Example: Send to error tracking service
      // errorTrackingService.captureException(error, { extra: context });
    }
  }

  /**
   * Log debug messages (development only)
   */
  debug(message: string, context?: Record<string, any>): void {
    if (this.isDevelopment) {
      this.log('debug', message, context);
    }
  }

  /**
   * Log informational messages
   */
  info(message: string, context?: Record<string, any>): void {
    this.log('info', message, context);
  }

  /**
   * Log warning messages
   */
  warn(message: string, context?: Record<string, any>): void {
    this.log('warn', message, context);
  }

  /**
   * Log error messages
   */
  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log('error', message, context, error);
  }
}

export const logger = new Logger();

