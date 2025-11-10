import { TenantRepository } from '@/domain/repositories/tenant.repository';
import { TenantDTO } from '../dtos/tenant.dto';
import { TenantMapper } from '../mappers/tenant.mapper';
import { SupabaseTenantRepository } from '@/infrastructure/repositories/supabase-tenant.repository';

/**
 * Tenant Service
 * Provides tenant operations
 */
export class TenantService {
  /**
   * Get all tenants
   * @returns Array of TenantDTOs
   */
  static async getAllTenants(): Promise<TenantDTO[]> {
    const tenantRepository: TenantRepository = new SupabaseTenantRepository();
    const tenants = await tenantRepository.getAllTenants();
    return TenantMapper.toDTOArray(tenants);
  }
}

