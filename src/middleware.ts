import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Se estiver tentando acessar /admin (e não for a página de login)
  if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
    // Apenas proteja a rota. A verificação real será feita no cliente.
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};