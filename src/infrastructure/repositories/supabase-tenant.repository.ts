import { TenantRepository } from '@/domain/repositories/tenant.repository';
import { Tenant } from '@/domain/entities/tenant.entity';
import { TenantMapper } from '@/application/mappers/tenant.mapper';
import { logger } from '@/shared/utils/logger';
import { createSupabaseServerClient } from '../supabase/server-client';

export class SupabaseTenantRepository implements TenantRepository {
  async getAllTenants(): Promise<Tenant[]> {
    logger.debug('Fetching all tenants from Supabase');

    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Failed to fetch tenants', new Error(error.message), {
        errorCode: error.code,
        errorDetails: error.details,
      });
      throw new Error(`Failed to fetch tenants: ${error.message}`);
    }

    if (!data || data.length === 0) {
      logger.info('No tenants found');
      return [];
    }

    const tenants = TenantMapper.fromSupabaseRows(data);
    logger.info('Successfully fetched tenants', { count: tenants.length });

    return tenants;
  }
}

