import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Get the current session
  const { data: { session } } = await supabase.auth.getSession();
  
  // Redirect root to dashboard or login
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL(session ? '/dashboard' : '/login', request.url));
  }

  // Protected routes check - updated with all protected routes
  const protectedRoutes = [
    '/dashboard',
    '/patients',
    '/appointments',
    '/admin',
    '/staff',
    '/tasks',
    '/billing',
    '/logbook',
    '/messages',
    '/products',
    '/settings',
    '/dictation',
    '/documents',
    '/equipment',
    '/suppliers',
    '/workflows',
    '/ai-summary',
    '/availability',
    '/clinical-notes',
    '/cqc-management',
    '/sample-patients',
    '/supplier-orders',
    '/patient-messages'
  ];
  
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(`${route}/`)
  );
  
  // Auth routes that should redirect to dashboard if logged in
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  const isAuthRoute = authRoutes.some(route => request.nextUrl.pathname === route);
  
  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Redirect to dashboard if accessing auth routes with active session
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};