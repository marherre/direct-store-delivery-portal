import { container } from '@/shared/di/container';
import { LoginDTO } from '../dtos/auth.dto';
import { UserSession } from '@/domain/entities/user.entity';
import type { LoginUseCase } from '@/domain/use-cases/auth/login.use-case';
import type { LogoutUseCase } from '@/domain/use-cases/auth/logout.use-case';
import type { AuthRepository, UserAuthentication } from '@/domain/repositories/auth.repository';

// Ensure DI is set up (this will be called once)
import '@/infrastructure/di/setup';

/**
 * Authentication Service
 * Provides authentication operations using dependency injection
 */
export class AuthService {
  /**
   * Login with email, password, and optional tenant name
   * @param credentials - User login credentials including optional tenant name
   * @returns User session
   */
  static async login(credentials: LoginDTO): Promise<UserSession> {
    console.log('[AuthService.login] Called with:', {
      email: credentials.email,
      tenant: credentials.tenant || '(empty/undefined)',
      hasTenant: !!credentials.tenant,
    });
    
    const loginUseCase = container.resolve<LoginUseCase>('LoginUseCase');
    
    const loginCredentials = {
      email: credentials.email,
      password: credentials.password,
      tenant: credentials.tenant,
    };
    
    console.log('[AuthService.login] Calling LoginUseCase.execute with:', {
      email: loginCredentials.email,
      tenant: loginCredentials.tenant || '(empty/undefined)',
      hasTenant: !!loginCredentials.tenant,
    });
    
    // Map LoginDTO to LoginCredentials (tenant is optional in DTO)
    return loginUseCase.execute(loginCredentials);
  }

  /**
   * Logout current user
   */
  static async logout(): Promise<void> {
    const logoutUseCase = container.resolve<LogoutUseCase>('LogoutUseCase');
    return logoutUseCase.execute();
  }

  /**
   * Get current authenticated user
   * @returns Current user or null if not authenticated
   */
  static async getCurrentUser() {
    const authRepository = container.resolve<AuthRepository>('AuthRepository');
    return authRepository.getCurrentUser();
  }

  /**
   * Check if the current user is a super admin
   * @returns true if user is admin, false otherwise
   */
  static async isUserAdmin(): Promise<boolean> {
    const authRepository = container.resolve<AuthRepository>('AuthRepository');
    return authRepository.isUserAdmin();
  }

  /**
   * Get user authentication information including super admin status and tenant_id
   * @returns User authentication info or null if not available
   */
  static async getUserAuthentication(): Promise<UserAuthentication | null> {
    const authRepository = container.resolve<AuthRepository>('AuthRepository');
    return authRepository.getUserAuthentication();
  }
}

