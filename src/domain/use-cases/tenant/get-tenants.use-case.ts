import { TenantRepository } from '../../repositories/tenant.repository';
import { Tenant } from '../../entities/tenant.entity';
import { logger } from '@/shared/utils/logger';

/**
 * Use case for getting all tenants
 */
export class GetTenantsUseCase {
  constructor(private readonly tenantRepository: TenantRepository) {}

  /**
   * Execute get tenants use case
   * @returns Array of Tenant entities
   * @throws Error if the operation fails
   */
  async execute(): Promise<Tenant[]> {
    logger.info('Executing get tenants use case');

    try {
      const tenants = await this.tenantRepository.getAllTenants();
      logger.info('Get tenants use case completed successfully', {
        count: tenants.length,
      });
      return tenants;
    } catch (error) {
      logger.error('Error in get tenants use case', error as Error);
      throw error;
    }
  }
}

