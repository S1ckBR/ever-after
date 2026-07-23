"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  const [verificando, setVerificando] = useState(!isLoginPage);
  const [autorizado, setAutorizado] = useState(isLoginPage);

  useEffect(() => {
    if (isLoginPage) {
      setAutorizado(true);
      setVerificando(false);
      return;
    }

    let componenteAtivo = true;

    const redirecionarParaLogin = () => {
      if (!componenteAtivo) return;

      setAutorizado(false);
      setVerificando(true);

      const destino = encodeURIComponent(pathname || "/admin");
      router.replace(`/admin/login?redirect=${destino}`);
    };

    const verificarUsuario = async () => {
      setAutorizado(false);
      setVerificando(true);

      try {
        // getUser valida o usuário com o servidor do Supabase.
        // Não usamos getSession como prova de autorização.
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (!componenteAtivo) return;

        if (error || !user) {
          redirecionarParaLogin();
          return;
        }

        setAutorizado(true);
        setVerificando(false);
      } catch (error) {
        console.error("Erro ao validar acesso ao painel:", error);

        if (componenteAtivo) {
          redirecionarParaLogin();
        }
      }
    };

    verificarUsuario();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!componenteAtivo) return;

      if (event === "SIGNED_OUT" || !session?.user) {
        redirecionarParaLogin();
        return;
      }

      if (
        event === "SIGNED_IN" ||
        event === "TOKEN_REFRESHED" ||
        event === "USER_UPDATED"
      ) {
        setAutorizado(true);
        setVerificando(false);
      }
    });

    return () => {
      componenteAtivo = false;
      subscription.unsubscribe();
    };
  }, [isLoginPage, pathname, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (verificando || !autorizado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f2ec]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#d8cfbf] border-t-[#395138]" />
          <p className="mt-4 font-serif text-sm italic text-[#607d5b]">
            Verificando acesso ao painel...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}