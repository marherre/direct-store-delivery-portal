/**
 * Dependency Injection Container
 * Simple container for managing service dependencies
 */
export class DIContainer {
  private services = new Map<string, any>();
  private factories = new Map<string, () => any>();

  /**
   * Register a service factory
   * @param key - Unique identifier for the service
   * @param factory - Factory function that creates the service instance
   */
  register<T>(key: string, factory: () => T): void {
    this.factories.set(key, factory);
  }

  /**
   * Resolve a service by key
   * @param key - Unique identifier for the service
   * @returns The service instance (singleton)
   */
  resolve<T>(key: string): T {
    // Return existing instance if available
    if (this.services.has(key)) {
      return this.services.get(key);
    }

    // Create new instance using factory
    const factory = this.factories.get(key);
    if (!factory) {
      throw new Error(`Service ${key} not found. Make sure it's registered.`);
    }

    const instance = factory();
    this.services.set(key, instance);
    return instance;
  }

  /**
   * Clear all registered services (useful for testing)
   */
  clear(): void {
    this.services.clear();
    this.factories.clear();
  }

  /**
   * Check if a service is registered
   * @param key - Unique identifier for the service
   */
  has(key: string): boolean {
    return this.factories.has(key);
  }
}

// Singleton instance
export const container = new DIContainer();

