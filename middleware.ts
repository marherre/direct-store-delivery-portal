import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { env } from '@/infrastructure/config/env.config';
import { routing } from '@/shared/config/routing.config';

const intlMiddleware = createMiddleware(routing);

/**
 * Next.js Middleware for authentication and internationalization
 * Handles locale detection, routing, and authentication redirects
 */
export async function middleware(request: NextRequest) {
  // First, handle internationalization - this will redirect to /locale/path if needed
  const response = intlMiddleware(request);
  
  // Extract locale and path from the request
  const pathname = request.nextUrl.pathname;
  const locale = routing.locales.find(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  ) || routing.defaultLocale;
  
  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

  // Skip auth checks for API routes, static files, etc.
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return response;
  }

  // Handle authentication after locale is determined
  // Create Supabase client for server-side operations
  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: '', ...options });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthPage = pathWithoutLocale.startsWith('/login');
  const isAdminRoute = pathWithoutLocale.startsWith('/admin');
  const isDashboardRoute = pathWithoutLocale.startsWith('/dashboard');

  // If user is authenticated, get authentication info
  let isSuperAdmin = false;
  let tenantId: string | null = null;
  if (user) {
    const { data: authData, error: authError } = await supabase.rpc('user_authentication');
    if (!authError && authData) {
      isSuperAdmin = authData.is_super_admin === true;
      tenantId = authData.tenant_id || null;
    }
  }

  // Redirect to login if accessing protected page without authentication
  if ((isAdminRoute || isDashboardRoute) && !user) {
    const redirectUrl = new URL(`/${locale}/login`, request.url);
    redirectUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect based on admin status and tenant
  if (user) {
    // Super admin trying to access tenant dashboard -> redirect to admin
    if (isSuperAdmin && isDashboardRoute) {
      return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
    }

    // Tenant user trying to access admin routes -> redirect to dashboard
    if (!isSuperAdmin && isAdminRoute) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }

    // If not super admin and no tenant associated, don't allow access to dashboard
    if (!isSuperAdmin && !tenantId && isDashboardRoute) {
      const redirectUrl = new URL(`/${locale}/login`, request.url);
      redirectUrl.searchParams.set('error', 'no_tenant');
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Redirect to appropriate page if accessing auth page while authenticated
  if (isAuthPage && user) {
    if (isSuperAdmin) {
      return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
    } else if (tenantId) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }
    // If no tenant and not super admin, stay on login page (error will be shown)
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
