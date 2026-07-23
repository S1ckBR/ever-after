"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Heart,
  Loader2,
  MessageSquareHeart,
  Send,
  Sparkles,
  XCircle,
} from "lucide-react";

interface Mensagem {
  id: string;
  autor: string;
  mensagem: string;
  aprovado: boolean;
  created_at?: string | null;
}

interface Feedback {
  tipo: "sucesso" | "erro";
  mensagem: string;
}

export default function Mural() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [autor, setAutor] = useState("");
  const [texto, setTexto] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingMensagens, setLoadingMensagens] = useState(true);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const loadMensagens = useCallback(async () => {
    setLoadingMensagens(true);

    try {
      const { data, error } = await supabase
        .from("mensagens")
        .select("id, autor, mensagem, aprovado, created_at")
        .eq("aprovado", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setMensagens((data as Mensagem[]) ?? []);
    } catch (error) {
      const mensagemErro =
        error instanceof Error ? error.message : "Erro desconhecido";

      console.error("Erro ao carregar mural:", mensagemErro);
      setFeedback({
        tipo: "erro",
        mensagem:
          "Não foi possível carregar as mensagens agora. Tente novamente em instantes.",
      });
    } finally {
      setLoadingMensagens(false);
    }
  }, []);

  useEffect(() => {
    loadMensagens();
  }, [loadMensagens]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFeedback(null);

    const autorLimpo = autor.trim();
    const textoLimpo = texto.trim();

    if (!autorLimpo) {
      setFeedback({
        tipo: "erro",
        mensagem: "Por favor, informe o seu nome.",
      });
      return;
    }

    if (!textoLimpo) {
      setFeedback({
        tipo: "erro",
        mensagem: "Escreva uma mensagem antes de enviar.",
      });
      return;
    }

    setSending(true);

    try {
      const { error } = await supabase.from("mensagens").insert({
        autor: autorLimpo,
        mensagem: textoLimpo,
        aprovado: true,
      });

      if (error) throw error;

      setAutor("");
      setTexto("");

      setFeedback({
        tipo: "sucesso",
        mensagem: "Sua mensagem de carinho foi enviada com sucesso!",
      });

      await loadMensagens();
    } catch (error) {
      const mensagemErro =
        error instanceof Error ? error.message : "Erro desconhecido";

      console.error("Erro ao enviar mensagem:", mensagemErro);

      setFeedback({
        tipo: "erro",
        mensagem:
          "Não foi possível enviar sua mensagem. Tente novamente em instantes.",
      });
    } finally {
      setSending(false);
    }
  };

  const formatarData = (data?: string | null) => {
    if (!data) return null;

    const dataMensagem = new Date(data);

    if (Number.isNaN(dataMensagem.getTime())) return null;

    return dataMensagem.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const inputClassName =
    "w-full rounded-xl border border-[#ddd5c7] bg-[#fffdf9] px-4 py-3.5 text-sm text-[#3f4f3c] outline-none transition-all duration-300 placeholder:text-[#9ba397] focus:border-[#7d9476] focus:ring-4 focus:ring-[#dfe7da]/60";

  return (
    <section
      id="mensagens"
      className="relative overflow-hidden border-t border-[#e4dccd] bg-[#fffdf9] py-24 sm:py-28 lg:py-32"
    >
      {/* Fundos decorativos */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#dfe7da]/40 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-[#eadfca]/50 blur-3xl" />
      </div>

      {/* Ramos laterais */}
      <svg
        aria-hidden="true"
        viewBox="0 0 220 360"
        className="pointer-events-none absolute -left-12 top-20 hidden h-[360px] w-[220px] text-[#8da084]/20 lg:block"
        fill="none"
      >
        <path
          d="M22 338C61 274 87 215 91 146C94 98 78 53 51 19"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M77 232C49 215 29 188 18 158"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M89 182C119 157 134 126 139 91"
          stroke="currentColor"
          strokeWidth="2"
        />
        <ellipse
          cx="38"
          cy="190"
          rx="17"
          ry="7"
          transform="rotate(46 38 190)"
          fill="currentColor"
        />
        <ellipse
          cx="116"
          cy="137"
          rx="18"
          ry="7"
          transform="rotate(-47 116 137)"
          fill="currentColor"
        />
        <ellipse
          cx="74"
          cy="104"
          rx="18"
          ry="7"
          transform="rotate(63 74 104)"
          fill="currentColor"
        />
      </svg>

      <svg
        aria-hidden="true"
        viewBox="0 0 220 360"
        className="pointer-events-none absolute -right-12 bottom-12 hidden h-[360px] w-[220px] rotate-180 text-[#b89a5f]/17 lg:block"
        fill="none"
      >
        <path
          d="M22 338C61 274 87 215 91 146C94 98 78 53 51 19"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M77 232C49 215 29 188 18 158"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M89 182C119 157 134 126 139 91"
          stroke="currentColor"
          strokeWidth="2"
        />
        <ellipse
          cx="38"
          cy="190"
          rx="17"
          ry="7"
          transform="rotate(46 38 190)"
          fill="currentColor"
        />
        <ellipse
          cx="116"
          cy="137"
          rx="18"
          ry="7"
          transform="rotate(-47 116 137)"
          fill="currentColor"
        />
        <ellipse
          cx="74"
          cy="104"
          rx="18"
          ry="7"
          transform="rotate(63 74 104)"
          fill="currentColor"
        />
      </svg>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-16">
          <div className="mb-5 inline-flex items-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#b89450]/70" />
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#71806d]">
              <Sparkles className="h-3.5 w-3.5 text-[#b89450]" />
              Mural de recados
            </span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#b89450]/70" />
          </div>

          <h2 className="font-serif text-4xl font-normal leading-tight text-[#395138] sm:text-5xl lg:text-6xl">
            Palavras que ficam
            <span className="block italic text-[#6f8669]">
              guardadas para sempre
            </span>
          </h2>

          <div className="mx-auto my-6 flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-[#cdb98d]/70" />
            <Heart className="h-4 w-4 fill-[#b89450] text-[#b89450]" />
            <span className="h-px w-16 bg-[#cdb98d]/70" />
          </div>

          <p className="mx-auto max-w-2xl font-serif text-base italic leading-relaxed text-[#697365] sm:text-lg">
            Deixe um conselho, uma lembrança ou um desejo especial para a
            nossa nova vida a dois.
          </p>
        </div>

        {feedback && (
          <div
            role="alert"
            className={[
              "mx-auto mb-8 flex max-w-3xl items-start gap-3 rounded-2xl border px-5 py-4 text-sm shadow-sm",
              feedback.tipo === "sucesso"
                ? "border-[#b8c9b1] bg-[#f1f6ee] text-[#395138]"
                : "border-[#e0b9b9] bg-[#fff5f5] text-[#7a3636]",
            ].join(" ")}
          >
            {feedback.tipo === "sucesso" ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            ) : (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
            )}
            <p className="leading-relaxed">{feedback.mensagem}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-12">
          {/* Formulário */}
          <div>
            <form
              onSubmit={handleSubmit}
              className="rounded-[28px] border border-[#ddd3c1] bg-[#fffdf9]/95 p-6 shadow-[0_20px_65px_rgba(70,81,65,0.11)] backdrop-blur-sm sm:p-8"
            >
              <div className="mb-7 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#d8c89f] bg-[#f4ead5]">
                  <MessageSquareHeart className="h-6 w-6 text-[#8a6b30]" />
                </div>

                <h3 className="font-serif text-2xl text-[#395138]">
                  Escreva seu recado
                </h3>

                <p className="mt-2 font-serif text-sm italic leading-relaxed text-[#7a8376]">
                  Sua mensagem fará parte das lembranças deste dia.
                </p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="autor"
                    className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6d7c68]"
                  >
                    Seu nome
                  </label>

                  <input
                    id="autor"
                    type="text"
                    value={autor}
                    onChange={(event) => setAutor(event.target.value)}
                    className={inputClassName}
                    placeholder="Ex.: Família Silva"
                    autoComplete="name"
                    maxLength={80}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="mensagem"
                      className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6d7c68]"
                    >
                      Mensagem
                    </label>

                    <span className="text-[10px] text-[#929b8f]">
                      {texto.length}/500
                    </span>
                  </div>

                  <textarea
                    id="mensagem"
                    value={texto}
                    onChange={(event) => setTexto(event.target.value)}
                    rows={6}
                    className={`${inputClassName} resize-none leading-relaxed`}
                    placeholder="Deixe sua mensagem de carinho aqui..."
                    maxLength={500}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={sending}
                  className="h-14 w-full rounded-xl border border-[#395138] bg-[#395138] text-xs font-semibold uppercase tracking-[0.16em] text-[#fffdf9] shadow-[0_12px_28px_rgba(57,81,56,0.2)] transition-all duration-300 hover:bg-[#4e694a] hover:shadow-[0_16px_34px_rgba(57,81,56,0.28)] disabled:cursor-not-allowed disabled:opacity-65"
                >
                  {sending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando mensagem...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar mensagem
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Lista de mensagens */}
          <div>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a6b30]">
                  Mensagens recebidas
                </span>
                <h3 className="mt-1 font-serif text-2xl text-[#395138]">
                  Carinho compartilhado
                </h3>
              </div>

              {!loadingMensagens && mensagens.length > 0 && (
                <span className="rounded-full border border-[#ddd3c1] bg-[#faf7f1] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#71806d]">
                  {mensagens.length}{" "}
                  {mensagens.length === 1 ? "recado" : "recados"}
                </span>
              )}
            </div>

            {loadingMensagens ? (
              <div className="flex min-h-[320px] items-center justify-center rounded-[28px] border border-[#e3dccf] bg-[#faf8f3]/70">
                <div className="text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#71806d]" />
                  <p className="mt-3 font-serif text-sm italic text-[#768071]">
                    Carregando mensagens...
                  </p>
                </div>
              </div>
            ) : mensagens.length === 0 ? (
              <div className="flex min-h-[320px] items-center justify-center rounded-[28px] border border-dashed border-[#d9cdb8] bg-[#faf8f3]/70 px-8 text-center">
                <div>
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#e4eadf]">
                    <MessageSquareHeart className="h-7 w-7 text-[#6f8669]" />
                  </div>

                  <h3 className="font-serif text-2xl text-[#395138]">
                    O primeiro recado pode ser seu
                  </h3>

                  <p className="mt-3 font-serif text-sm italic leading-relaxed text-[#6c7568]">
                    Deixe uma mensagem especial para Tayná e Kaique.
                  </p>
                </div>
              </div>
            ) : (
              <div className="max-h-[610px] overflow-y-auto pr-1 sm:pr-2">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {mensagens.map((mensagem) => {
                    const dataFormatada = formatarData(
                      mensagem.created_at
                    );

                    return (
                      <article
                        key={mensagem.id}
                        className="group relative flex min-h-[210px] flex-col justify-between overflow-hidden rounded-[24px] border border-[#e2d9ca] bg-[#fffdf9] p-6 shadow-[0_12px_35px_rgba(70,81,65,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(70,81,65,0.12)]"
                      >
                        <div className="absolute -right-5 -top-5 text-[#dfe7da]/65">
                          <Heart className="h-20 w-20 fill-current" />
                        </div>

                        <div className="relative z-10">
                          <MessageSquareHeart className="mb-4 h-5 w-5 text-[#b89450]" />

                          <p className="font-serif text-sm italic leading-7 text-[#657061]">
                            “{mensagem.mensagem}”
                          </p>
                        </div>

                        <div className="relative z-10 mt-6 border-t border-[#eee7dc] pt-4">
                          <div className="flex items-end justify-between gap-3">
                            <span className="font-serif text-sm font-semibold text-[#395138]">
                              — {mensagem.autor}
                            </span>

                            {dataFormatada && (
                              <time className="text-[9px] uppercase tracking-[0.12em] text-[#949c90]">
                                {dataFormatada}
                              </time>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
