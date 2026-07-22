"use client";

import Image from "next/image";
import { Heart, Quote } from "lucide-react";

interface StoryProps {
  config: {
    imagem_historia_1?: string;
    imagem_historia_2?: string;
    texto_historia?: string;
  };
}

const imagemPadrao =
  "https://images.unsplash.com/photo-1522673607200-169d1b82a3ad?auto=format&fit=crop&q=80&w=1000";

export default function Story({ config }: StoryProps) {
  const textoHistoria =
    config.texto_historia ||
    "Conte um pouco sobre como vocês se conheceram e a trajetória até aqui...";

  return (
    <section
      id="historia"
      className="relative overflow-hidden bg-[#f7f2e9] py-20 md:py-28"
    >
      {/* Fundo e detalhes decorativos */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(193,207,185,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(213,191,146,0.16),transparent_30%)]" />
        <div className="absolute left-1/2 top-0 h-px w-[82%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#b99a5e]/45 to-transparent" />
      </div>

      {/* Folhagem esquerda */}
      <svg
        aria-hidden="true"
        viewBox="0 0 260 560"
        className="pointer-events-none absolute -left-20 top-28 hidden h-[560px] w-[260px] text-[#71876a]/20 lg:block"
        fill="none"
      >
        <path
          d="M40 540C58 405 105 280 211 80"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M77 410C30 393 9 351 18 311C60 320 91 357 77 410Z"
          fill="currentColor"
        />
        <path
          d="M112 316C72 288 64 244 81 208C118 230 139 270 112 316Z"
          fill="currentColor"
        />
        <path
          d="M143 238C169 195 208 176 244 184C231 225 192 252 143 238Z"
          fill="currentColor"
        />
        <path
          d="M170 163C141 126 143 82 168 51C199 81 208 124 170 163Z"
          fill="currentColor"
        />
      </svg>

      {/* Folhagem direita */}
      <svg
        aria-hidden="true"
        viewBox="0 0 260 560"
        className="pointer-events-none absolute -right-20 top-12 hidden h-[560px] w-[260px] -scale-x-100 text-[#71876a]/20 lg:block"
        fill="none"
      >
        <path
          d="M40 540C58 405 105 280 211 80"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M77 410C30 393 9 351 18 311C60 320 91 357 77 410Z"
          fill="currentColor"
        />
        <path
          d="M112 316C72 288 64 244 81 208C118 230 139 270 112 316Z"
          fill="currentColor"
        />
        <path
          d="M143 238C169 195 208 176 244 184C231 225 192 252 143 238Z"
          fill="currentColor"
        />
        <path
          d="M170 163C141 126 143 82 168 51C199 81 208 124 170 163Z"
          fill="currentColor"
        />
      </svg>

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        {/* Cabeçalho */}
        <div className="mx-auto mb-14 max-w-3xl text-center md:mb-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.34em] text-[#a27c36]">
            A nossa jornada
          </p>

          <h2 className="font-serif text-4xl text-[#395138] sm:text-5xl md:text-6xl">
            Nossa História
          </h2>

          <div className="mt-5 flex items-center justify-center gap-4">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#b89450]" />
            <Heart className="h-4 w-4 fill-[#b89450] text-[#b89450]" />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#b89450]" />
          </div>

          <p className="mt-6 font-serif text-lg italic text-[#667361] md:text-xl">
            Do “match” ao altar, uma história escrita com amor, parceria e
            muitas risadas.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[280px_minmax(0,1fr)_280px] lg:gap-10 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
          {/* Foto esquerda */}
          <aside className="order-2 flex justify-center lg:order-1 lg:block">
            <div className="sticky top-28 w-full max-w-[280px]">
              <div className="-rotate-3 bg-white p-3 pb-12 shadow-[0_20px_50px_rgba(78,86,72,0.18)] transition-transform duration-300 hover:rotate-0">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#e7e1d7]">
                  <Image
                    src={config.imagem_historia_1 || imagemPadrao}
                    alt="Momento especial da nossa história"
                    fill
                    sizes="(max-width: 1024px) 80vw, 280px"
                    className="object-cover"
                  />
                </div>

                <div className="absolute left-1/2 top-0 h-7 w-24 -translate-x-1/2 -translate-y-2 rotate-2 bg-[#dfcfad]/75 shadow-sm" />

                <p className="mt-5 text-center font-serif text-sm italic text-[#6b745f]">
                  Um capítulo especial da nossa história
                </p>
              </div>

              <div className="mx-auto mt-10 hidden w-36 text-[#7d9275]/45 lg:block">
                <svg viewBox="0 0 150 110" fill="none">
                  <path
                    d="M4 104C40 87 65 56 80 9"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M31 83C9 77 0 58 4 41C24 46 37 64 31 83Z"
                    fill="currentColor"
                  />
                  <path
                    d="M60 50C42 36 41 17 51 4C68 16 75 35 60 50Z"
                    fill="currentColor"
                  />
                  <path
                    d="M71 31C91 14 117 11 138 22C124 42 97 52 71 31Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
          </aside>

          {/* Texto completo e editável pelo painel */}
          <article className="order-1 lg:order-2">
            <div className="rounded-[30px] border border-[#d8cfbd]/70 bg-white/55 px-6 py-8 shadow-[0_25px_70px_rgba(85,92,78,0.08)] backdrop-blur-sm sm:px-9 md:px-12 md:py-12">
              <div className="mb-8 flex items-center gap-3">
                <Heart className="h-4 w-4 fill-[#b89450] text-[#b89450]" />
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#50624b]">
                  Do “Match” ao Altar
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-[#b89450]/70 to-transparent" />
              </div>

              <div className="prose prose-stone max-w-none">
                <p className="whitespace-pre-line text-justify font-serif text-[17px] leading-[1.95] text-[#4f5f4b] md:text-lg">
                  {textoHistoria}
                </p>
              </div>

              <div className="mt-10 flex items-center justify-center gap-3">
                <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#b89450]/70" />
                <Heart className="h-3.5 w-3.5 fill-[#b89450] text-[#b89450]" />
                <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#b89450]/70" />
              </div>
            </div>
          </article>

          {/* Foto direita — continua controlada pelo painel */}
          <aside className="order-3 flex justify-center lg:block">
            <div className="sticky top-28 w-full max-w-[280px]">
              {config.imagem_historia_2 ? (
                <div className="rotate-3 bg-white p-3 pb-12 shadow-[0_20px_50px_rgba(78,86,72,0.18)] transition-transform duration-300 hover:rotate-0">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#e7e1d7]">
                    <Image
                      src={config.imagem_historia_2}
                      alt="Outro momento especial da nossa história"
                      fill
                      sizes="(max-width: 1024px) 80vw, 280px"
                      className="object-cover"
                    />
                  </div>

                  <div className="absolute left-1/2 top-0 h-7 w-24 -translate-x-1/2 -translate-y-2 -rotate-2 bg-[#dfcfad]/75 shadow-sm" />

                  <p className="mt-5 text-center font-serif text-sm italic text-[#6b745f]">
                    Memórias que nos trouxeram até aqui
                  </p>
                </div>
              ) : (
                <div className="rounded-[28px] border border-dashed border-[#b9ae98] bg-white/35 p-8 text-center">
                  <Heart className="mx-auto mb-3 h-6 w-6 text-[#9cab94]" />
                  <p className="font-serif text-sm italic text-[#6b745f]">
                    A segunda foto aparecerá aqui quando for adicionada pelo
                    Painel dos Noivos.
                  </p>
                </div>
              )}

              <div className="mx-auto mt-10 hidden w-36 -scale-x-100 text-[#7d9275]/45 lg:block">
                <svg viewBox="0 0 150 110" fill="none">
                  <path
                    d="M4 104C40 87 65 56 80 9"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M31 83C9 77 0 58 4 41C24 46 37 64 31 83Z"
                    fill="currentColor"
                  />
                  <path
                    d="M60 50C42 36 41 17 51 4C68 16 75 35 60 50Z"
                    fill="currentColor"
                  />
                  <path
                    d="M71 31C91 14 117 11 138 22C124 42 97 52 71 31Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
          </aside>
        </div>

        {/* Citação final */}
        <div className="mx-auto mt-16 max-w-5xl rounded-[28px] border border-[#cfd7c9] bg-[#edf1e9]/75 px-6 py-9 text-center shadow-sm md:mt-20 md:px-12">
          <Quote className="mx-auto mb-4 h-8 w-8 text-[#b89450]" />

          <p className="font-serif text-xl italic leading-relaxed text-[#465944] md:text-2xl">
            “E assim seguimos escrevendo a nossa história, todos os dias, com
            amor, respeito, parceria e muitas risadas.”
          </p>

          <div className="mt-5 flex items-center justify-center gap-2">
            <div className="h-px w-10 bg-[#b89450]/55" />
            <Heart className="h-3.5 w-3.5 fill-[#b89450] text-[#b89450]" />
            <div className="h-px w-10 bg-[#b89450]/55" />
          </div>
        </div>
      </div>
    </section>
  );
}
