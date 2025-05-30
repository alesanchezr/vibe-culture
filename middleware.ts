import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set(name, value, options);
        },
        remove(name: string, options: any) {
          res.cookies.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  const { data: { session } } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // Define protected routes
  const protectedRoutes = ['/profile', '/submit-event'];

  // If the user is not logged in and is trying to access a protected route,
  // redirect them to the login page.
  if (!session && protectedRoutes.some(route => pathname.startsWith(route))) {
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('redirectedFrom', pathname); // Optional: pass redirect path
    return NextResponse.redirect(loginUrl);
  }
  
  // If the user is logged in and tries to access auth pages (login/signup),
  // redirect them to the home page (or dashboard/profile).
  if (session && (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/signup'))) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (the root path, if you want it unprotected for landing page)
     * - /events (public event listing)
     * - /events/:path* (public event detail)
     * - /api (API routes, if you have any public ones)
     */
    '/((?!_next/static|_next/image|favicon.ico|events$|events/.+|api/).*)',
    // Add / if you want the homepage to be checked by middleware too, 
    // for example to redirect logged-in users from a marketing homepage to their dashboard.
    // '/'
  ],
}; 