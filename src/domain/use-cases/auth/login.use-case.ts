import { AuthRepository, LoginCredentials } from '../../repositories/auth.repository';
import { UserSession } from '../../entities/user.entity';
import { AuthenticationError } from '@/shared/utils/errors';
import { logger } from '@/shared/utils/logger';

/**
 * Use case for user login
 * Note: Input validation is handled by Zod in the presentation layer (DTOs)
 */
export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  /**
   * Execute login use case
   * @param credentials - User login credentials (already validated by DTO)
   * @returns User session with access token
   * @throws AuthenticationError if login fails or tenant validation fails
   */
  async execute(credentials: LoginCredentials): Promise<UserSession> {
    // Force console.log to ensure we see this in browser console
    console.log('🔵 [LoginUseCase] EXECUTING - Tenant validation enabled', {
      email: credentials.email,
      tenantProvided: !!credentials.tenant,
      tenantValue: credentials.tenant || '(empty/undefined)',
      tenantType: typeof credentials.tenant
    });
    
    logger.info('Executing login use case', { 
      email: credentials.email,
      tenantProvided: !!credentials.tenant,
      tenantValue: credentials.tenant || '(empty)'
    });

    try {
      // 1. Perform login with email and password
      const session = await this.authRepository.login({
        email: credentials.email,
        password: credentials.password,
      });
      
      logger.info('Login successful, validating tenant', { 
        userId: session.user.id,
        tenantProvided: !!credentials.tenant,
        tenantValue: credentials.tenant || '(empty)'
      });

      // 2. Get user authentication info (includes tenant_id and tenant_name)
      const authInfo = await this.authRepository.getUserAuthentication();
      
      console.log('🟢 [LoginUseCase] Auth info retrieved', {
        is_super_admin: authInfo?.is_super_admin,
        tenant_id: authInfo?.tenant_id || '(null)',
        tenant_name: authInfo?.tenant_name || '(null)'
      });
      
      logger.info('Auth info retrieved', {
        is_super_admin: authInfo?.is_super_admin,
        tenant_id: authInfo?.tenant_id || '(null)',
        tenant_name: authInfo?.tenant_name || '(null)'
      });
      
      if (!authInfo) {
        logger.error('Failed to get user authentication info after login');
        throw new AuthenticationError('Failed to retrieve user authentication information.');
      }

      // 3. Validate tenant name based on user's tenant assignment
      console.log('🟡 [LoginUseCase] Starting tenant validation', {
        is_super_admin: authInfo.is_super_admin,
        hasTenantId: !!authInfo.tenant_id,
        hasTenantName: !!authInfo.tenant_name,
        providedTenant: credentials.tenant || '(empty)'
      });
      
      if (authInfo.is_super_admin) {
        // Super admin: tenant name is optional, just log if provided
        logger.info('User is super admin, tenant validation skipped', { userId: session.user.id });
        if (credentials.tenant) {
          logger.info('Super admin login with tenant name provided (ignored)', { userId: session.user.id });
        }
      } else if (authInfo.tenant_id && authInfo.tenant_name) {
        // User has a tenant assigned: tenant name is REQUIRED and must match
        console.log('🔴 [LoginUseCase] User has tenant - VALIDATION REQUIRED', {
          userId: session.user.id,
          expectedTenant: authInfo.tenant_name,
          providedTenant: credentials.tenant || '(empty)',
          tenantIsEmpty: !credentials.tenant || credentials.tenant.trim() === ''
        });
        
        logger.info('User has tenant assigned, validating tenant name', {
          userId: session.user.id,
          expectedTenant: authInfo.tenant_name,
          providedTenant: credentials.tenant || '(empty)'
        });
        
        if (!credentials.tenant || credentials.tenant.trim() === '') {
          console.error('❌ [LoginUseCase] ERROR: Tenant name is required but not provided!');
          logger.warn('Tenant name is required but not provided', {
            userId: session.user.id,
            expectedTenant: authInfo.tenant_name,
          });
          throw new AuthenticationError('Tenant name is required. Please enter your tenant name.');
        }
        
        // Normalize both tenant names for comparison (case-insensitive, trim whitespace)
        const inputTenantName = credentials.tenant.trim().toLowerCase();
        const userTenantName = authInfo.tenant_name.trim().toLowerCase();
        
        logger.info('Comparing tenant names', {
          input: inputTenantName,
          expected: userTenantName,
          match: inputTenantName === userTenantName
        });
        
        if (inputTenantName !== userTenantName) {
          logger.warn('Tenant name mismatch', {
            input: inputTenantName,
            expected: userTenantName,
            userId: session.user.id,
          });
          throw new AuthenticationError('Invalid tenant name. Please check your tenant name and try again.');
        }
        
        logger.info('Tenant name validated successfully', { tenantName: userTenantName });
      } else if (credentials.tenant && credentials.tenant.trim() !== '') {
        // User provided tenant but has no tenant assigned
        logger.warn('User provided tenant but has no tenant assigned', { userId: session.user.id });
        throw new AuthenticationError('Your account is not associated with any tenant. Please contact your administrator.');
      } else {
        logger.info('User has no tenant assigned and no tenant provided - validation passed', { userId: session.user.id });
      }

      logger.info('Login use case completed successfully', { userId: session.user.id });
      return session;
    } catch (error) {
      // Re-throw AuthenticationError as-is
      if (error instanceof AuthenticationError) {
        throw error;
      }
      
      // Wrap unexpected errors
      logger.error('Unexpected error in login use case', error as Error);
      throw new AuthenticationError('Login failed. Please check your credentials.');
    }
  }
}

