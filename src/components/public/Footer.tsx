"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  Heart,
  Link as LinkIcon,
  MessageCircle,
  Sparkles,
} from "lucide-react";

const linksNavegacao = [
  { label: "Início", href: "#home" },
  { label: "Nossa História", href: "#historia" },
  { label: "Cerimônia", href: "#cerimonia" },
  { label: "Recepção", href: "#recepcao" },
  { label: "Presentes", href: "#presentes" },
  { label: "Confirme sua Presença", href: "#rsvp" },
  { label: "Mensagens", href: "#mensagens" },
];

export default function Footer() {
  const [linkCopiado, setLinkCopiado] = useState(false);

  const obterUrlAtual = () =>
    typeof window !== "undefined" ? window.location.href : "";

  const compartilharWhatsApp = () => {
    const urlAtual = obterUrlAtual();
    const mensagem =
      "Tayná e Kaique vão se casar! Veja todos os detalhes do nosso grande dia:";

    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${mensagem} ${urlAtual}`)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const compartilharFacebook = () => {
    const urlAtual = obterUrlAtual();

    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        urlAtual
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const copiarLink = async () => {
    const urlAtual = obterUrlAtual();

    try {
      await navigator.clipboard.writeText(urlAtual);
      setLinkCopiado(true);

      window.setTimeout(() => {
        setLinkCopiado(false);
      }, 2200);
    } catch (error) {
      console.error("Não foi possível copiar o link:", error);
    }
  };

  const navegarParaSecao = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href === "#") return;

    const elemento = document.querySelector(href);

    if (!elemento) return;

    event.preventDefault();
    elemento.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <footer className="relative overflow-hidden bg-[#334a35] text-[#f8f4ec]">
      {/* Ornamentação de fundo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-[#91a88a]/10 blur-3xl" />
        <div className="absolute -right-28 bottom-0 h-96 w-96 rounded-full bg-[#b89450]/10 blur-3xl" />
      </div>

      <svg
        aria-hidden="true"
        viewBox="0 0 220 360"
        className="pointer-events-none absolute -left-14 top-6 hidden h-[330px] w-[210px] text-[#b8c8b1]/12 lg:block"
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
        className="pointer-events-none absolute -right-14 bottom-4 hidden h-[330px] w-[210px] rotate-180 text-[#d0b16e]/10 lg:block"
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

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-14 text-center md:grid-cols-3 md:text-left">
          {/* Monograma */}
          <div className="flex flex-col items-center md:items-start">
            <div className="relative mb-6 flex h-28 w-28 items-center justify-center rounded-full border border-[#d5bd84]/45 bg-white/[0.035] shadow-[0_18px_50px_rgba(0,0,0,0.12)] backdrop-blur-sm">
              <div className="absolute inset-2 rounded-full border border-white/10" />

              <span className="relative font-serif text-3xl tracking-[0.18em] text-[#f7ead0]">
                T <span className="text-[#d3b36b]">&amp;</span> K
              </span>
            </div>

            <span className="mb-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#d3b36b]">
              <Sparkles className="h-3.5 w-3.5" />
              Nosso grande dia
            </span>

            <p className="font-serif text-lg tracking-[0.16em] text-[#f4efe5]">
              21 · NOVEMBRO · 2026
            </p>

            <p className="mt-4 max-w-xs font-serif text-sm italic leading-relaxed text-[#d8e0d4]/80">
              Que este seja apenas o começo de uma vida inteira de histórias
              para contar.
            </p>
          </div>

          {/* Navegação */}
          <div className="flex flex-col items-center md:items-start">
            <div className="mb-6">
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#d3b36b]">
                Navegação
              </span>
              <h4 className="mt-2 font-serif text-2xl text-[#f4efe5]">
                Explore nosso site
              </h4>
            </div>

            <nav
              aria-label="Navegação do rodapé"
              className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2"
            >
              {linksNavegacao.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(event) => navegarParaSecao(event, link.href)}
                  className="group inline-flex items-center justify-center gap-2 text-xs uppercase tracking-[0.12em] text-[#d8e0d4]/80 transition-colors duration-300 hover:text-[#f7ead0] md:justify-start"
                >
                  <span className="h-px w-4 bg-[#d3b36b]/45 transition-all duration-300 group-hover:w-6 group-hover:bg-[#d3b36b]" />
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Compartilhamento */}
          <div className="flex flex-col items-center md:items-start">
            <div className="mb-6">
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#d3b36b]">
                Compartilhe
              </span>
              <h4 className="mt-2 font-serif text-2xl text-[#f4efe5]">
                Espalhe esse carinho
              </h4>
            </div>

            <p className="max-w-sm font-serif text-sm italic leading-relaxed text-[#d8e0d4]/80">
              Envie nosso site para familiares e amigos que também farão parte
              deste momento tão especial.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3 md:justify-start">
              <button
                type="button"
                onClick={compartilharWhatsApp}
                aria-label="Compartilhar no WhatsApp"
                title="Compartilhar no WhatsApp"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-[#eef2eb] transition-all duration-300 hover:-translate-y-1 hover:border-[#d3b36b]/55 hover:bg-[#d3b36b]/10 hover:text-[#f7ead0]"
              >
                <MessageCircle className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={compartilharFacebook}
                aria-label="Compartilhar no Facebook"
                title="Compartilhar no Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-[#eef2eb] transition-all duration-300 hover:-translate-y-1 hover:border-[#d3b36b]/55 hover:bg-[#d3b36b]/10 hover:text-[#f7ead0]"
              >
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={copiarLink}
                aria-label="Copiar link do site"
                title={linkCopiado ? "Link copiado" : "Copiar link"}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-[#eef2eb] transition-all duration-300 hover:-translate-y-1 hover:border-[#d3b36b]/55 hover:bg-[#d3b36b]/10 hover:text-[#f7ead0]"
              >
                {linkCopiado ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <LinkIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="mt-4 min-h-5">
              {linkCopiado && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#e7cf96]">
                  <Copy className="h-3.5 w-3.5" />
                  Link copiado
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Assinatura */}
        <div className="mt-16 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="font-serif text-xs italic text-[#d8e0d4]/65">
              Feito com carinho para celebrar o amor.
            </p>

            <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d8e0d4]/70">
              Desenvolvido por Kaique
              <Heart className="h-3.5 w-3.5 fill-[#d3b36b] text-[#d3b36b]" />
              para o nosso grande dia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
