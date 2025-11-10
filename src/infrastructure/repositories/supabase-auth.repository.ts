import { AuthRepository, LoginCredentials, UserAuthentication } from '@/domain/repositories/auth.repository';
import { User, UserSession } from '@/domain/entities/user.entity';
import { AuthenticationError } from '@/shared/utils/errors';
import { supabaseClient } from '../supabase/client';
import { UserMapper } from '@/application/mappers/user.mapper';
import { logger } from '@/shared/utils/logger';

export class SupabaseAuthRepository implements AuthRepository {
  async login(credentials: LoginCredentials): Promise<UserSession> {
    logger.info('Attempting login', { email: credentials.email });

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error || !data.session || !data.user) {
      logger.error('Login failed', error ? new Error(error.message) : undefined, {
        email: credentials.email,
      });
      throw new AuthenticationError(error?.message || 'Login failed');
    }

    const user = UserMapper.fromSupabaseUser(data.user);

    logger.info('Login successful', { userId: user.id });

    return {
      user,
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: new Date(data.session.expires_at! * 1000),
    };
  }

  async logout(): Promise<void> {
    logger.info('Attempting logout');

    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      logger.error('Logout failed', new Error(error.message));
      throw new AuthenticationError(error.message);
    }

    logger.info('Logout successful');
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabaseClient.auth.getUser();

    if (error || !user) {
      if (error) {
        logger.debug('Failed to get current user', { error: error.message });
      }
      return null;
    }

    return UserMapper.fromSupabaseUser(user);
  }

  async refreshSession(refreshToken: string): Promise<UserSession> {
    logger.debug('Refreshing session');

    const { data, error } = await supabaseClient.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session || !data.user) {
      logger.error('Session refresh failed', error ? new Error(error.message) : undefined);
      throw new AuthenticationError(error?.message || 'Session refresh failed');
    }

    const user = UserMapper.fromSupabaseUser(data.user);

    return {
      user,
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: new Date(data.session.expires_at! * 1000),
    };
  }

  /**
   * Check if the current authenticated user is a super admin
   * Uses the check_user_is_admin() RPC function (wrapper in public schema)
   */
  async isUserAdmin(): Promise<boolean> {
    logger.debug('Checking if user is admin');

    const { data, error } = await supabaseClient.rpc('check_user_is_admin');

    if (error) {
      logger.error('Failed to check admin status', new Error(error.message));
      return false;
    }

    return data ?? false;
  }

  /**
   * Get user authentication information including super admin status and tenant_id
   * Uses the user_authentication() RPC function
   */
  async getUserAuthentication(): Promise<UserAuthentication | null> {
    logger.debug('Getting user authentication info');

    const { data, error } = await supabaseClient.rpc('user_authentication');

    if (error) {
      logger.error('Failed to get user authentication', new Error(error.message));
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      is_super_admin: data.is_super_admin === true,
      tenant_id: data.tenant_id || null,
      tenant_name: data.tenant_name || null,
    };
  }
}

