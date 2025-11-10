'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@/domain/entities/user.entity';
import { AuthService } from '@/application/services/auth.service';
import { logger } from '@/shared/utils/logger';
import { useRouter, useParams } from 'next/navigation';
import { getLocalizedRoutes } from '@/shared/constants/routes.constants';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Component
 * Provides authentication state and methods to all child components
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const checkUser = useCallback(async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        logger.debug('User authenticated', { userId: currentUser.id });
      } else {
        logger.debug('No user authenticated');
      }
    } catch (error) {
      logger.error('Failed to check user', error as Error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
      setUser(null);
      const routes = getLocalizedRoutes(locale);
      router.push(routes.LOGIN);
      router.refresh();
    } catch (error) {
      logger.error('Logout error in provider', error as Error);
      // Even if logout fails, clear local state
      setUser(null);
      const routes = getLocalizedRoutes(locale);
      router.push(routes.LOGIN);
    }
  }, [router, locale]);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
    refreshUser: checkUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access authentication context
 * @throws Error if used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

