// Route protection middleware — redirects unauthenticated users away from /chat

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // If user is not logged in and trying to access /chat, redirect to login
  if (!user && request.nextUrl.pathname.startsWith("/chat")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If user is logged in and trying to access login page, redirect to chat
  if (user && request.nextUrl.pathname.startsWith("/auth/login")) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/chat/:path*", "/auth/login"],
};