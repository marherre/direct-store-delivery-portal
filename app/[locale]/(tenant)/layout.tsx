'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/presentation/providers/auth-provider';
import { Sidebar, MobileMenuButton } from '@/presentation/components/layout/sidebar';
import { SidebarProvider } from '@/presentation/components/layout/sidebar-context';

/**
 * Tenant Layout
 * Layout for tenant users (reuses existing dashboard layout)
 */
export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                {/* Left: Project Name */}
                <div className="flex items-center gap-4">
                  <MobileMenuButton />
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-blue-600">DSD</span>
                    <span className="text-xl font-semibold text-gray-700 hidden sm:inline">
                      {tCommon('adminPortal')}
                    </span>
                  </div>
                </div>

                {/* Right: Icons and User Profile */}
                {user && (
                  <div className="flex items-center gap-4">
                    {/* Notification Icon */}
                    <button
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
                      aria-label={tCommon('notifications')}
                    >
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                      {/* Notification badge */}
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* Messages Icon */}
                    <button
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
                      aria-label={tCommon('messages')}
                    >
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </button>

                    {/* User Profile with Dropdown */}
                    <div className="relative" ref={userMenuRef}>
                      <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                        aria-label={tCommon('userMenu')}
                      >
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-medium text-gray-900">
                            {user.email?.split('@')[0] || tCommon('user')}
                          </p>
                          <p className="text-xs text-gray-500">{tCommon('systemManager')}</p>
                        </div>
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {user.email?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center">
                            <svg
                              className={`w-3 h-3 text-gray-600 transition-transform ${
                                isUserMenuOpen ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>
                      </button>

                      {/* Dropdown Menu */}
                      {isUserMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">
                              {user.email}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {tCommon('systemManager')}
                            </p>
                          </div>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <svg
                              className="w-4 h-4 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            <span>{tCommon('signOut')}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

