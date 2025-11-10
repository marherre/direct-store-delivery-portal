import { Tenant } from '@/domain/entities/tenant.entity';

/**
 * Data Transfer Object for Tenant
 * Used for transferring tenant data between layers
 */
export interface TenantDTO {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Type guard to check if an object is a TenantDTO
 */
export function isTenantDTO(obj: any): obj is TenantDTO {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.is_active === 'boolean' &&
    obj.created_at instanceof Date &&
    obj.updated_at instanceof Date
  );
}

