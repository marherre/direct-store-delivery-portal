import { z } from 'zod';

/**
 * Check if we're running on the server
 */
const isServer = typeof window === 'undefined';

/**
 * Base environment variables schema (available in both client and server)
 */
const baseEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL format'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

/**
 * Server-only environment variables schema
 * SUPABASE_SERVICE_ROLE_KEY should only be validated on the server
 */
const serverEnvSchema = baseEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Service role key is required'),
});

/**
 * Client environment variables schema
 * Only includes variables that are available in the browser
 */
const clientEnvSchema = baseEnvSchema;

export type EnvConfig = z.infer<typeof serverEnvSchema>;

/**
 * Validates and returns environment configuration
 * Only validates SUPABASE_SERVICE_ROLE_KEY on the server
 * @throws Error if required environment variables are missing or invalid
 */
function validateEnv(): EnvConfig {
  try {
    const baseEnv = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NODE_ENV: process.env.NODE_ENV,
    };

    // On the server, validate service role key
    if (isServer) {
      return serverEnvSchema.parse({
        ...baseEnv,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      });
    }

    // On the client, only validate public variables
    // Return a partial config (serviceRoleKey will be undefined on client)
    const clientEnv = clientEnvSchema.parse(baseEnv);
    return {
      ...clientEnv,
      SUPABASE_SERVICE_ROLE_KEY: '', // Placeholder, not used on client
    } as EnvConfig;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('\n');
      throw new Error(
        `Missing or invalid environment variables:\n${missingVars}\n\nPlease check your .env.local file.`
      );
    }
    throw error;
  }
}

/**
 * Validated environment configuration
 * This will throw an error at startup if environment variables are invalid
 */
export const env = validateEnv();

