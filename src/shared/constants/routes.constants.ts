export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  
  // Admin routes
  ADMIN: '/admin',
  ADMIN_TENANTS: '/admin/tenants',
  ADMIN_TENANTS_NEW: '/admin/tenants/new',
  
  // Tenant routes
  DASHBOARD: '/dashboard',
  
  LOGOUT: '/logout',
} as const;

/**
 * Helper function to generate routes with locale
 * @param locale - The locale string (e.g., 'en', 'es')
 * @returns Routes object with locale-prefixed paths
 */
export function getLocalizedRoutes(locale: string) {
  return {
    HOME: `/${locale}`,
    LOGIN: `/${locale}/login`,
    
    // Admin
    ADMIN: `/${locale}/admin`,
    ADMIN_TENANTS: `/${locale}/admin/tenants`,
    ADMIN_TENANTS_NEW: `/${locale}/admin/tenants/new`,
    
    // Tenant
    DASHBOARD: `/${locale}/dashboard`,
    
    LOGOUT: `/${locale}/logout`,
  } as const;
}

