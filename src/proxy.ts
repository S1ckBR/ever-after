import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function copiarCookies(
  origem: NextResponse,
  destino: NextResponse
) {
  origem.cookies.getAll().forEach(({ name, value, ...options }) => {
    destino.cookies.set(name, value, options);
  });

  return destino;
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const adminUserId = process.env.ADMIN_USER_ID;

  const pathname = request.nextUrl.pathname;
  const isLoginPage = pathname === "/admin/login";

  // Falha fechada: sem configuração, nenhuma rota administrativa é liberada.
  if (!supabaseUrl || !supabaseAnonKey || !adminUserId) {
    if (isLoginPage) {
      return response;
    }

    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("error", "admin_not_configured");

    return NextResponse.redirect(loginUrl);
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(
            ({ name, value, options }) => {
              response.cookies.set(name, value, options);
            }
          );
        },
      },
    }
  );

  // Valida a assinatura e as claims do token.
  const {
    data,
    error,
  } = await supabase.auth.getClaims();

  const authenticatedUserId = data?.claims?.sub;
  const isAdmin =
    !error &&
    Boolean(authenticatedUserId) &&
    authenticatedUserId === adminUserId;

  // Usuário administrativo já autenticado não precisa ver o login.
  if (isLoginPage) {
    if (isAdmin) {
      const adminUrl = new URL("/admin", request.url);
      return copiarCookies(
        response,
        NextResponse.redirect(adminUrl)
      );
    }

    return response;
  }

  // Bloqueia qualquer pessoa sem sessão válida ou com outro usuário.
  if (!isAdmin) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set(
      "redirect",
      `${pathname}${request.nextUrl.search}`
    );

    if (authenticatedUserId && authenticatedUserId !== adminUserId) {
      loginUrl.searchParams.set("error", "unauthorized");
    }

    return copiarCookies(
      response,
      NextResponse.redirect(loginUrl)
    );
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
