'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/presentation/providers/auth-provider';
import { getLocalizedRoutes } from '@/shared/constants/routes.constants';
import { useParams } from 'next/navigation';
import { useSidebar } from './sidebar-context';
import clsx from 'clsx';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: string | number;
}

/**
 * Sidebar Component
 * Minimalist SaaS-style sidebar with icon-only navigation
 */
export function Sidebar() {
  const { isMobileOpen, setIsMobileOpen, toggleMobileMenu, isCollapsed, toggleCollapse } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const t = useTranslations('navigation');
  const tCommon = useTranslations('common');
  const routes = getLocalizedRoutes(locale);

  // Menu items configuration
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: t('dashboard'),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      path: routes.DASHBOARD,
    },
    {
      id: 'users',
      label: t('users'),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      path: `${routes.DASHBOARD}/users`,
    },
    {
      id: 'settings',
      label: t('settings'),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      path: `${routes.DASHBOARD}/settings`,
    },
    {
      id: 'reports',
      label: t('reports'),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      path: `${routes.DASHBOARD}/reports`,
    },
    {
      id: 'analytics',
      label: t('analytics'),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      path: `${routes.DASHBOARD}/analytics`,
    },
  ];

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed left-0 top-0 z-50 h-screen bg-orange-500 text-white transition-all duration-300 ease-in-out',
          'lg:relative lg:z-auto',
          isCollapsed ? 'w-16' : 'w-56',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header with Hamburger Icon */}
        <div className="flex items-center justify-center h-14 border-b border-orange-600/30">
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-lg hover:bg-orange-600/50 transition-colors"
            aria-label={tCommon('toggleSidebar')}
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden absolute top-3 right-3 p-2 rounded-lg hover:bg-orange-600/50 transition-colors"
            aria-label={tCommon('closeMenu')}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={clsx(
                    'w-full flex items-center gap-2.5 rounded-lg transition-all duration-200',
                    isCollapsed ? 'justify-center p-2.5' : 'px-2.5 py-2',
                    'hover:bg-orange-600/50',
                    active
                      ? 'bg-blue-400 text-white shadow-sm'
                      : 'text-white/90 hover:text-white'
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="flex-1 text-left text-sm font-medium truncate">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}

/**
 * Mobile Menu Button Component
 * Displays hamburger button for mobile devices
 */
export function MobileMenuButton() {
  const { toggleMobileMenu, isMobileOpen } = useSidebar();
  const tCommon = useTranslations('common');

  return (
    <button
      onClick={toggleMobileMenu}
      className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
      aria-label={tCommon('openMenu')}
    >
      {isMobileOpen ? (
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ) : (
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      )}
    </button>
  );
}

