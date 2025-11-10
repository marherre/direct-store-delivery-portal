import { User } from '@/domain/entities/user.entity';
import type { User as SupabaseUser } from '@supabase/supabase-js';

/**
 * Mapper for transforming between Supabase User and Domain User entities
 */
export class UserMapper {
  /**
   * Transform Supabase user to domain User entity
   * @param supabaseUser - User from Supabase Auth
   * @returns Domain User entity
   */
  static fromSupabaseUser(supabaseUser: SupabaseUser): User {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email!,
      fullName: supabaseUser.user_metadata?.full_name,
      avatarUrl: supabaseUser.user_metadata?.avatar_url,
      createdAt: new Date(supabaseUser.created_at),
      updatedAt: new Date(supabaseUser.updated_at || supabaseUser.created_at),
    };
  }

  /**
   * Transform domain User entity to Supabase user metadata
   * @param user - Domain User entity
   * @returns Partial Supabase user metadata
   */
  static toSupabaseMetadata(user: Partial<User>): Record<string, any> {
    const metadata: Record<string, any> = {};

    if (user.fullName) {
      metadata.full_name = user.fullName;
    }

    if (user.avatarUrl) {
      metadata.avatar_url = user.avatarUrl;
    }

    return metadata;
  }
}

