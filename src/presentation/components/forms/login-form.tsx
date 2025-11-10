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
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-3">
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
        className="w-full"
        isLoading={isLoading}
        disabled={isLoading}
      >
        {t('signIn')}
      </Button>
    </form>
  );
};

