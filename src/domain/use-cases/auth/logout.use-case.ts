import { AuthRepository } from '../../repositories/auth.repository';
import { logger } from '@/shared/utils/logger';

/**
 * Use case for user logout
 */
export class LogoutUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  /**
   * Execute logout use case
   * Logs errors but doesn't throw - logout should always succeed from user perspective
   */
  async execute(): Promise<void> {
    try {
      await this.authRepository.logout();
      logger.info('Logout use case completed successfully');
    } catch (error) {
      // Log error but don't throw - logout should always succeed from user perspective
      logger.error('Logout error (non-blocking)', error as Error);
    }
  }
}

