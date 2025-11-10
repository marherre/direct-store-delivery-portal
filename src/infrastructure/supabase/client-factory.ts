import { createBrowserClient } from '@supabase/ssr';
import { supabaseConfig } from './config';

/**
 * Factory for creating Supabase clients
 * Provides different client types for different use cases
 */
export class SupabaseClientFactory {
  /**
   * Create a browser client for client-side operations
   * Uses @supabase/ssr for proper cookie handling
   */
  static createBrowserClient() {
    return createBrowserClient(
      supabaseConfig.url,
      supabaseConfig.anonKey
    );
  }

  /**
   * Create a server client (for use in server components/API routes)
   * Note: This should be created per-request using createServerClient from @supabase/ssr
   * This is kept for backward compatibility
   */
  static createClient() {
    // For backward compatibility, return browser client
    // In server components, use createServerClient from @supabase/ssr directly
    return this.createBrowserClient();
  }
}

