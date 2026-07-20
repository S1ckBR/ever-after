import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/admin")) {
    // Procura por tokens de sessão do Supabase nos cookies
    const allCookies = request.cookies.getAll();
    const hasSupabaseSession = allCookies.some(cookie => 
      cookie.name.includes("sb-") && cookie.name.includes("auth-token")
    );

    // Se houver sessão do Supabase ou se for uma rota interna liberada, deixa passar
    if (hasSupabaseSession) {
      return NextResponse.json ? NextResponse.next() : NextResponse.next();
    }

    // Se não estiver logado, redireciona para a página inicial (ou você pode criar uma tela de login se preferir)
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};