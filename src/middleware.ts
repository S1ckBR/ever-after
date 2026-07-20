import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Verifica se o usuário está tentando acessar qualquer página dentro de /admin
  if (path.startsWith("/admin")) {
    // Procura pelo cookie de sessão do Supabase ou cookie de autenticação admin
    const supabaseToken = request.cookies.get("sb-access-token") || request.cookies.get("sb-refresh-token");
    const adminSession = request.cookies.get("admin_logged");

    // Se não houver nenhum indicativo de sessão/login, bloqueia e redireciona para a home
    if (!supabaseToken && !adminSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Configura o middleware para rodar apenas nas rotas /admin
export const config = {
  matcher: "/admin/:path*",
};