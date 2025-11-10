import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LogoutUseCase } from '../logout.use-case';
import type { AuthRepository } from '@/domain/repositories/auth.repository';
import { AuthenticationError } from '@/shared/utils/errors';

describe('LogoutUseCase', () => {
  let logoutUseCase: LogoutUseCase;
  let mockAuthRepository: {
    logout: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockAuthRepository = {
      logout: vi.fn(),
    };

    logoutUseCase = new LogoutUseCase(mockAuthRepository as unknown as AuthRepository);
  });

  it('should successfully logout', async () => {
    mockAuthRepository.logout.mockResolvedValue(undefined);

    await logoutUseCase.execute();

    expect(mockAuthRepository.logout).toHaveBeenCalledTimes(1);
  });

  it('should not throw error even if repository throws error', async () => {
    const authError = new AuthenticationError('Logout failed');
    mockAuthRepository.logout.mockRejectedValue(authError);

    // Logout should not throw - it should always succeed from user perspective
    await expect(logoutUseCase.execute()).resolves.toBeUndefined();

    expect(mockAuthRepository.logout).toHaveBeenCalledTimes(1);
  });
});

