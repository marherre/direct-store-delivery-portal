/**
 * Dependency Injection Setup
 * Registers all services and their dependencies
 */
import { container } from '@/shared/di/container';
import { SupabaseAuthRepository } from '../repositories/supabase-auth.repository';
import { LoginUseCase } from '@/domain/use-cases/auth/login.use-case';
import { LogoutUseCase } from '@/domain/use-cases/auth/logout.use-case';
import type { AuthRepository } from '@/domain/repositories/auth.repository';

// Register repositories
container.register<AuthRepository>('AuthRepository', () => {
  return new SupabaseAuthRepository();
});

// Register use cases (with dependencies)
container.register<LoginUseCase>('LoginUseCase', () => {
  const authRepository = container.resolve<AuthRepository>('AuthRepository');
  return new LoginUseCase(authRepository);
});

container.register<LogoutUseCase>('LogoutUseCase', () => {
  const authRepository = container.resolve<AuthRepository>('AuthRepository');
  return new LogoutUseCase(authRepository);
});

