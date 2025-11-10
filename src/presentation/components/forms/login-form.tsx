'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { LoginDTO } from '@/application/dtos/auth.dto';
import { AuthService } from '@/application/services/auth.service';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { getLocalizedRoutes } from '@/shared/constants/routes.constants';
import { AuthenticationError, ValidationError } from '@/shared/utils/errors';
import { createLoginSchema } from '@/shared/utils/validation';
import { useAuth } from '@/presentation/providers/auth-provider';

export const LoginForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const t = useTranslations('auth');
  const tValidation = useTranslations('validation');
  const tErrors = useTranslations('errors');
  const routes = getLocalizedRoutes(locale);

  // Create schema with translations
  const loginSchema = createLoginSchema((key: string) => tValidation(key));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDTO>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur', // Validar solo cuando el campo pierde el foco
    reValidateMode: 'onBlur', // Revalidar solo cuando pierde el foco
  });

  const { refreshUser } = useAuth();

  const onSubmit = async (data: LoginDTO) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Login
      await AuthService.login(data);
      
      // 2. Refresh user state in context
      await refreshUser();
      
      // 3. Get user authentication info (is_super_admin and tenant_id)
      const authInfo = await AuthService.getUserAuthentication();
      
      // Debug: Print authInfo to console
      console.log('authInfo:', authInfo);
      
      if (!authInfo) {
        // Failed to get authentication info
        setIsLoading(false);
        setError(tErrors('unexpectedError'));
        return;
      }

      // 4. Check if user is super admin
      if (authInfo.is_super_admin) {
        // User is super admin -> redirect to admin routes
        router.push(routes.ADMIN);
        router.refresh();
        return;
      }

      // 5. Check if user has tenant associated
      if (!authInfo.tenant_id) {
        // User is not super admin and has no tenant -> show error, don't redirect
        setIsLoading(false);
        setError(tErrors('noTenant'));
        return;
      }

      // 6. User is tenant user with tenant -> redirect to tenant dashboard
      router.push(routes.DASHBOARD);
      router.refresh();
      // Don't reset isLoading here - let it stay true until navigation completes
      // The component will unmount when navigation happens, so isLoading will be cleaned up
    } catch (err) {
      // Only reset loading on error
      setIsLoading(false);
      if (err instanceof AuthenticationError || err instanceof ValidationError) {
        setError(err.message);
      } else {
        setError(tErrors('unexpectedError'));
      }
    }
  };

  // Handler para errores de validación del formulario
  const onError = (errors: any) => {
    // Mostrar el primer error encontrado
    const firstError = Object.values(errors)[0] as any;
    if (firstError?.message) {
      setError(firstError.message);
    }
  };

  return (
    <>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50/95 via-white/95 to-blue-100/95 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="text-center px-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 mb-6 shadow-2xl shadow-blue-500/50 relative">
              {/* Spinning ring */}
              <div className="absolute inset-0 rounded-3xl border-4 border-blue-300/30 border-t-blue-200 animate-spin"></div>
              {/* Cart icon */}
              <svg
                className="w-12 h-12 text-white relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
              {t('signingIn')}
            </p>
            <p className="text-sm text-gray-600 font-medium animate-pulse">
              {t('redirecting')}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        {error && (
          <div className="rounded-xl bg-red-50/80 backdrop-blur-sm border-2 border-red-200 p-4 shadow-sm">
            <p className="text-sm text-red-700 font-semibold">{error}</p>
          </div>
        )}

        <div className="space-y-5">
          <Input
            label={t('tenant')}
            type="text"
            placeholder={t('tenantPlaceholder')}
            {...register('tenant')}
            error={errors.tenant?.message}
            disabled={isLoading}
          />

          <Input
            label={t('email')}
            type="email"
            placeholder={t('emailPlaceholder')}
            {...register('email')}
            error={errors.email?.message}
            disabled={isLoading}
          />

          <Input
            label={t('password')}
            type="password"
            placeholder={t('passwordPlaceholder')}
            {...register('password')}
            error={errors.password?.message}
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          className="w-full mt-8"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {t('signIn')}
        </Button>
      </form>
    </>
  );
};

