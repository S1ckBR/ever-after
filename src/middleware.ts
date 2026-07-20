import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Deixa o AuthGuard do lado do cliente gerenciar a sessão com segurança
  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};