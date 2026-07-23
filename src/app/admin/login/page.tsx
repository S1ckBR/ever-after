"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  AlertCircle,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

function obterDestinoSeguro(valor: string | null) {
  if (!valor) return "/admin";

  // Aceita somente rotas internas do painel.
  if (!valor.startsWith("/admin") || valor.startsWith("//")) {
    return "/admin";
  }

  // Evita retornar para a própria página de login.
  if (valor.startsWith("/admin/login")) {
    return "/admin";
  }

  return valor;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificandoSessao, setVerificandoSessao] = useState(true);
  const [mensagemErro, setMensagemErro] = useState("");

  const destino = useMemo(
    () => obterDestinoSeguro(searchParams.get("redirect")),
    [searchParams]
  );

  useEffect(() => {
    let componenteAtivo = true;

    async function verificarSessaoExistente() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!componenteAtivo) return;

        if (user) {
          router.replace(destino);
          return;
        }
      } catch (error) {
        console.error("Erro ao verificar sessão existente:", error);
      } finally {
        if (componenteAtivo) {
          setVerificandoSessao(false);
        }
      }
    }

    verificarSessaoExistente();

    return () => {
      componenteAtivo = false;
    };
  }, [destino, router]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (loading) return;

    setMensagemErro("");
    setLoading(true);

    try {
      const emailNormalizado = email.trim().toLowerCase();

      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: emailNormalizado,
          password,
        });

      if (loginError) {
        throw loginError;
      }

      // Confirma com o servidor do Supabase que o token recebido é válido.
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        await supabase.auth.signOut({ scope: "local" });
        throw new Error("Não foi possível validar a sessão.");
      }

      // Recarregamento completo para sincronizar o estado de autenticação.
      window.location.assign(destino);
    } catch (error) {
      console.error("Falha no login administrativo:", error);

      setMensagemErro(
        "Não foi possível entrar. Confira o e-mail e a senha e tente novamente."
      );
      setPassword("");
      setLoading(false);
    }
  };

  if (verificandoSessao) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f2ec]">
        <div className="text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#607d5b]" />
          <p className="mt-4 font-serif text-sm italic text-[#607d5b]">
            Verificando acesso...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f2ec] px-4 py-10">
      <div className="pointer-events-none absolute -left-24 -top-28 h-80 w-80 rounded-full bg-[#dce6d8]/75 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-[#eadfca]/70 blur-3xl" />

      <section className="relative z-10 w-full max-w-md overflow-hidden rounded-[30px] border border-[#ddd4c5] bg-[#fffdf9] shadow-[0_28px_80px_rgba(57,81,56,0.14)]">
        <div className="border-b border-[#ece5d9] px-7 pb-6 pt-8 text-center sm:px-9">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#cdd8c8] bg-[#e8eee5] text-[#395138]">
            <Lock className="h-6 w-6" />
          </div>

          <span className="mt-5 inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9b7a38]">
            <Sparkles className="h-3.5 w-3.5" />
            Tayná &amp; Kaique
          </span>

          <h1 className="mt-2 font-serif text-3xl text-[#395138]">
            Painel dos Noivos
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-[#6f796c]">
            Entre com a conta administrativa para gerenciar o site do
            casamento.
          </p>
        </div>

        <div className="px-7 py-7 sm:px-9">
          {mensagemErro && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{mensagemErro}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="admin-email"
                className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6d7c68]"
              >
                E-mail
              </label>

              <input
                id="admin-email"
                type="email"
                inputMode="email"
                autoComplete="username"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={loading}
                className="w-full rounded-xl border border-[#ddd5c7] bg-[#fffdf9] px-4 py-3.5 text-sm text-[#3f4f3c] outline-none transition-all placeholder:text-[#9ba397] focus:border-[#7d9476] focus:ring-4 focus:ring-[#dfe7da]/60 disabled:cursor-not-allowed disabled:opacity-70"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="admin-password"
                className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6d7c68]"
              >
                Senha
              </label>

              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={loading}
                className="w-full rounded-xl border border-[#ddd5c7] bg-[#fffdf9] px-4 py-3.5 text-sm text-[#3f4f3c] outline-none transition-all placeholder:text-[#9ba397] focus:border-[#7d9476] focus:ring-4 focus:ring-[#dfe7da]/60 disabled:cursor-not-allowed disabled:opacity-70"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-13 w-full items-center justify-center rounded-xl bg-[#395138] px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_12px_28px_rgba(57,81,56,0.2)] transition-colors hover:bg-[#4e694a] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validando acesso...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Entrar com segurança
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-[10px] leading-relaxed text-[#8a9387]">
            O acesso é restrito aos administradores do site.
          </p>
        </div>
      </section>
    </main>
  );
}

function LoginFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f2ec]">
      <div className="text-center">
        <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#607d5b]" />
        <p className="mt-4 font-serif text-sm italic text-[#607d5b]">
          Carregando acesso...
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}