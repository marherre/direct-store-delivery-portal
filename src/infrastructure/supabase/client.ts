import { SupabaseClientFactory } from './client-factory';

/**
 * Browser Supabase client
 * Uses @supabase/ssr for proper SSR support
 * @deprecated Consider using SupabaseClientFactory.createBrowserClient() for better control
 */
export const supabaseClient = SupabaseClientFactory.createBrowserClient();

