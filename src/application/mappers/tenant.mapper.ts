import { Tenant } from '@/domain/entities/tenant.entity';
import { TenantDTO } from '../dtos/tenant.dto';

/**
 * Mapper for transforming between Tenant entities and DTOs
 */
export class TenantMapper {
  /**
   * Transform Tenant entity to TenantDTO
   * @param tenant - Tenant entity from domain
   * @returns TenantDTO
   */
  static toDTO(tenant: Tenant): TenantDTO {
    return {
      id: tenant.id,
      name: tenant.name,
      email: tenant.email,
      is_active: tenant.is_active,
      created_at: tenant.created_at,
      updated_at: tenant.updated_at,
    };
  }

  /**
   * Transform TenantDTO to Tenant entity
   * @param dto - TenantDTO
   * @returns Tenant entity
   */
  static toEntity(dto: TenantDTO): Tenant {
    return {
      id: dto.id,
      name: dto.name,
      email: dto.email,
      is_active: dto.is_active,
      created_at: dto.created_at,
      updated_at: dto.updated_at,
    };
  }

  /**
   * Transform array of Tenant entities to TenantDTOs
   * @param tenants - Array of Tenant entities
   * @returns Array of TenantDTOs
   */
  static toDTOArray(tenants: Tenant[]): TenantDTO[] {
    return tenants.map((tenant) => this.toDTO(tenant));
  }

  /**
   * Transform array of TenantDTOs to Tenant entities
   * @param dtos - Array of TenantDTOs
   * @returns Array of Tenant entities
   */
  static toEntityArray(dtos: TenantDTO[]): Tenant[] {
    return dtos.map((dto) => this.toEntity(dto));
  }

  /**
   * Transform Supabase row to Tenant entity
   * @param row - Row from Supabase query
   * @returns Tenant entity
   */
  static fromSupabaseRow(row: any): Tenant {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      is_active: row.is_active ?? true,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at || row.created_at),
    };
  }

  /**
   * Transform array of Supabase rows to Tenant entities
   * @param rows - Array of rows from Supabase query
   * @returns Array of Tenant entities
   */
  static fromSupabaseRows(rows: any[]): Tenant[] {
    return rows.map((row) => this.fromSupabaseRow(row));
  }
}

