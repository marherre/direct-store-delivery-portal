import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LoginUseCase } from '../login.use-case';
import type { AuthRepository } from '@/domain/repositories/auth.repository';
import { AuthenticationError } from '@/shared/utils/errors';
import { UserSession } from '@/domain/entities/user.entity';

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let mockAuthRepository: {
    login: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockAuthRepository = {
      login: vi.fn(),
    };

    loginUseCase = new LoginUseCase(mockAuthRepository as unknown as AuthRepository);
  });

  it('should successfully login with valid credentials', async () => {
    const mockSession: UserSession = {
      user: {
        id: '123',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      expiresAt: new Date(Date.now() + 3600000),
    };

    mockAuthRepository.login.mockResolvedValue(mockSession);

    const result = await loginUseCase.execute({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result).toEqual(mockSession);
    expect(mockAuthRepository.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(mockAuthRepository.login).toHaveBeenCalledTimes(1);
  });

  it('should throw AuthenticationError when repository throws AuthenticationError', async () => {
    const authError = new AuthenticationError('Invalid credentials');
    mockAuthRepository.login.mockRejectedValue(authError);

    await expect(
      loginUseCase.execute({
        email: 'test@example.com',
        password: 'wrongpassword',
      })
    ).rejects.toThrow(AuthenticationError);

    expect(mockAuthRepository.login).toHaveBeenCalledTimes(1);
  });

  it('should wrap unexpected errors in AuthenticationError', async () => {
    const unexpectedError = new Error('Network error');
    mockAuthRepository.login.mockRejectedValue(unexpectedError);

    await expect(
      loginUseCase.execute({
        email: 'test@example.com',
        password: 'password123',
      })
    ).rejects.toThrow(AuthenticationError);

    expect(mockAuthRepository.login).toHaveBeenCalledTimes(1);
  });
});

