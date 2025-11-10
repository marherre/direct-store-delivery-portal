'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getLocalizedRoutes } from '@/shared/constants/routes.constants';
import { useParams } from 'next/navigation';
import { useSidebar } from '../layout/sidebar-context';
import clsx from 'clsx';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: string | number;
}

/**
 * Admin Sidebar Component
 * Sidebar specifically for super admin users
 */
export function AdminSidebar() {
  const { isMobileOpen, setIsMobileOpen, toggleMobileMenu, isCollapsed, toggleCollapse } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const t = useTranslations('navigation');
  const tCommon = useTranslations('common');
  const routes = getLocalizedRoutes(locale);

  // Admin menu items configuration
  const menuItems: MenuItem[] = [
    {
      id: 'home',
      label: t('home') || 'Home',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      path: routes.ADMIN,
    },
    {
      id: 'tenants',
      label: t('tenants') || 'Tenants',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      path: routes.ADMIN_TENANTS,
    },
  ];

  const isActive = (path: string) => {
    if (!pathname) return false;
    
    // Exact match - highest priority
    if (pathname === path) {
      return true;
    }
    
    // Check if pathname is a subpath of this menu item
    if (pathname.startsWith(path + '/')) {
      // Check if any other menu item has a more specific match
      // (longer path that also matches the current pathname)
      const hasMoreSpecificMatch = menuItems.some(
        (item) => 
          item.path !== path && 
          item.path.length > path.length &&
          pathname.startsWith(item.path)
      );
      // Only return true if no more specific match exists
      return !hasMoreSpecificMatch;
    }
    
    return false;
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
 * Mobile Menu Button Component for Admin
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

