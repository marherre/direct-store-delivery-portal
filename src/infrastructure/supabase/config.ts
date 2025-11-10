import { env } from '../config/env.config';

/**
 * Check if we're running on the server
 */
const isServer = typeof window === 'undefined';

/**
 * Supabase configuration
 * Uses validated environment variables
 * serviceRoleKey is only available on the server
 */
export const supabaseConfig = {
  url: env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  // Only include serviceRoleKey on the server
  ...(isServer ? { serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY } : {}),
} as const;

