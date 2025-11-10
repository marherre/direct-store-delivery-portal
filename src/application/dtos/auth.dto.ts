import { z } from 'zod';

// Base schema for type inference (without translations)
// For actual validation, use createLoginSchema from shared/utils/validation
export const loginSchemaBase = z.object({
  tenant: z
    .string()
    .optional(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export type LoginDTO = z.infer<typeof loginSchemaBase>;

// Legacy export for backward compatibility
// Note: This schema uses English messages. For translated messages,
// use createLoginSchema from shared/utils/validation in components
export const loginSchema = loginSchemaBase;

