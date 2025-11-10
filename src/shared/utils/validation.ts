import { z } from 'zod';

/**
 * Creates a login schema with translated error messages
 * @param t - Translation function from next-intl
 * @returns Zod schema for login validation
 */
export function createLoginSchema(t: (key: string) => string) {
  return z.object({
    tenant: z
      .string()
      .optional(),
    email: z
      .string()
      .min(1, t('emailRequired'))
      .email(t('emailInvalid')),
    password: z
      .string()
      .min(1, t('passwordRequired')),
  });
}

