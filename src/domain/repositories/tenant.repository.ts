import { Tenant } from '../entities/tenant.entity';

export interface TenantRepository {
  /**
   * Get all tenants from the database
   * @returns Array of Tenant entities
   * @throws Error if the operation fails
   */
  getAllTenants(): Promise<Tenant[]>;
}

