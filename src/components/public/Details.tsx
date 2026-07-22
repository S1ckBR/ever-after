"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Church,
  Clock,
  GlassWater,
  Heart,
  MapPin,
  Quote,
} from "lucide-react";

interface DetailsProps {
  config: {
    titulo_cerimonial?: string;
    subtitulo_cerimonial?: string;

    cerimonia_data?: string;
    cerimonia_hora?: string;
    cerimonia_local?: string;
    cerimonia_mapa_url?: string;
    imagem_cerimonia?: string;

    festa_data?: string;
    festa_hora?: string;
    festa_local?: string;
    festa_mapa_url?: string;
    imagem_recepcao?: string;
  };
}

const imagemCerimoniaPadrao =
  "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&q=85&w=1400";

const imagemRecepcaoPadrao =
  "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&q=85&w=1400";

function abrirMapa(url?: string) {
  window.open(
    url || "https://maps.google.com",
    "_blank",
    "noopener,noreferrer"
  );
}

export default function Details({ config }: DetailsProps) {
  return (
    <section
      id="cerimonia"
      className="relative overflow-hidden border-t border-[#dfe6d9] bg-[#f8f4ec] py-20 md:py-28"
    >
      {/* Fundo decorativo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(164,184,153,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(190,151,75,0.10),transparent_30%)]" />
        <div className="absolute left-1/2 top-0 h-px w-[84%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#b79149]/45 to-transparent" />
      </div>

      {/* Folhagem esquerda */}
      <svg
        aria-hidden="true"
        viewBox="0 0 280 420"
        className="pointer-events-none absolute -left-16 top-10 hidden h-[420px] w-[280px] text-[#72856a]/20 lg:block"
        fill="none"
      >
        <path
          d="M18 350C82 285 122 190 189 54"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M64 280C24 268 5 235 14 201C50 209 76 241 64 280Z"
          fill="currentColor"
        />
        <path
          d="M102 216C71 193 66 157 80 128C111 147 129 180 102 216Z"
          fill="currentColor"
        />
        <path
          d="M134 153C160 118 195 103 226 110C214 145 179 166 134 153Z"
          fill="currentColor"
        />
        <path
          d="M165 92C142 61 145 28 166 6C192 31 197 63 165 92Z"
          fill="currentColor"
        />
        <path
          d="M184 68C218 42 250 41 274 54"
          stroke="#b79149"
          strokeOpacity=".55"
          strokeWidth="1.5"
        />
      </svg>

      {/* Folhagem direita */}
      <svg
        aria-hidden="true"
        viewBox="0 0 280 420"
        className="pointer-events-none absolute -right-16 top-10 hidden h-[420px] w-[280px] -scale-x-100 text-[#72856a]/20 lg:block"
        fill="none"
      >
        <path
          d="M18 350C82 285 122 190 189 54"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M64 280C24 268 5 235 14 201C50 209 76 241 64 280Z"
          fill="currentColor"
        />
        <path
          d="M102 216C71 193 66 157 80 128C111 147 129 180 102 216Z"
          fill="currentColor"
        />
        <path
          d="M134 153C160 118 195 103 226 110C214 145 179 166 134 153Z"
          fill="currentColor"
        />
        <path
          d="M165 92C142 61 145 28 166 6C192 31 197 63 165 92Z"
          fill="currentColor"
        />
        <path
          d="M184 68C218 42 250 41 274 54"
          stroke="#b79149"
          strokeOpacity=".55"
          strokeWidth="1.5"
        />
      </svg>

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        {/* Cabeçalho */}
        <div className="mx-auto mb-14 max-w-4xl text-center md:mb-20">
          <span className="block text-xs font-semibold uppercase tracking-[0.34em] text-[#a27c36]">
            {config.titulo_cerimonial || "O Grande Dia"}
          </span>

          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#b89450]" />
            <Heart className="h-4 w-4 fill-[#b89450] text-[#b89450]" />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#b89450]" />
          </div>

          <h2 className="mt-5 font-serif text-4xl font-light leading-tight text-[#395138] sm:text-5xl md:text-6xl">
            {config.subtitulo_cerimonial ||
              "Onde nossos caminhos se tornarão um só"}
          </h2>

          <div className="mt-7 flex items-center justify-center gap-4 text-[#71866a]">
            <span className="h-px w-20 bg-[#9baa94]/65" />
            <Heart className="h-5 w-5 fill-[#b89450] text-[#b89450]" />
            <span className="h-px w-20 bg-[#9baa94]/65" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-9 lg:grid-cols-2 lg:gap-10">
          {/* Cerimônia */}
          <article className="group relative overflow-hidden rounded-[26px] border border-[#ddd3c1] bg-white/80 shadow-[0_18px_50px_rgba(75,83,69,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(75,83,69,0.16)]">
            <div className="relative h-[260px] overflow-hidden sm:h-[320px]">
              <Image
                src={config.imagem_cerimonia || imagemCerimoniaPadrao}
                alt="Local da cerimônia"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-transparent" />
            </div>

            <div className="absolute left-1/2 top-[260px] flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[6px] border-[#f8f4ec] bg-[#dfe7da] shadow-lg sm:top-[320px]">
              <Church className="h-10 w-10 stroke-[1.5] text-[#b48936]" />
            </div>

            <div className="px-6 pb-7 pt-16 sm:px-8 md:px-10">
              <div className="mb-7 flex items-center justify-center gap-3">
                <span className="text-[#99aa92]">❦</span>
                <h3 className="font-serif text-3xl uppercase tracking-[0.13em] text-[#395138]">
                  Cerimônia
                </h3>
                <span className="text-[#99aa92]">❦</span>
              </div>

              <div className="grid grid-cols-1 gap-6 border-y border-[#ded5c5] py-7 sm:grid-cols-3 sm:gap-0">
                <div className="flex gap-3 px-2 sm:border-r sm:border-dashed sm:border-[#c8a968] sm:px-4">
                  <Calendar className="mt-0.5 h-6 w-6 shrink-0 text-[#b48936]" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#395138]">
                      Data
                    </p>
                    <p className="mt-2 font-serif text-sm leading-relaxed text-[#515e4d]">
                      {config.cerimonia_data || "Data a confirmar"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 px-2 sm:border-r sm:border-dashed sm:border-[#c8a968] sm:px-4">
                  <Clock className="mt-0.5 h-6 w-6 shrink-0 text-[#b48936]" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#395138]">
                      Horário
                    </p>
                    <p className="mt-2 font-serif text-sm leading-relaxed text-[#515e4d]">
                      {config.cerimonia_hora || "Horário a confirmar"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 px-2 sm:px-4">
                  <MapPin className="mt-0.5 h-6 w-6 shrink-0 text-[#b48936]" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#395138]">
                      Local
                    </p>
                    <p className="mt-2 font-serif text-sm leading-relaxed text-[#515e4d]">
                      {config.cerimonia_local || "Local a confirmar"}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="mt-7 h-14 w-full rounded-md border-[#52674f] bg-transparent font-serif text-sm uppercase tracking-[0.16em] text-[#395138] transition-colors hover:bg-[#395138] hover:text-white"
                onClick={() => abrirMapa(config.cerimonia_mapa_url)}
              >
                <MapPin className="mr-2 h-5 w-5" />
                Abrir no Google Maps
              </Button>
            </div>
          </article>

          {/* Recepção */}
          <article
            id="recepcao"
            className="group relative overflow-hidden rounded-[26px] border border-[#ddd3c1] bg-white/80 shadow-[0_18px_50px_rgba(75,83,69,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(75,83,69,0.16)]"
          >
            <div className="relative h-[260px] overflow-hidden sm:h-[320px]">
              <Image
                src={config.imagem_recepcao || imagemRecepcaoPadrao}
                alt="Local da recepção"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-transparent" />
            </div>

            <div className="absolute left-1/2 top-[260px] flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[6px] border-[#f8f4ec] bg-[#dfe7da] shadow-lg sm:top-[320px]">
              <GlassWater className="h-10 w-10 stroke-[1.5] text-[#b48936]" />
            </div>

            <div className="px-6 pb-7 pt-16 sm:px-8 md:px-10">
              <div className="mb-7 flex items-center justify-center gap-3">
                <span className="text-[#99aa92]">❦</span>
                <h3 className="font-serif text-3xl uppercase tracking-[0.13em] text-[#395138]">
                  Recepção
                </h3>
                <span className="text-[#99aa92]">❦</span>
              </div>

              <div className="grid grid-cols-1 gap-6 border-y border-[#ded5c5] py-7 sm:grid-cols-3 sm:gap-0">
                <div className="flex gap-3 px-2 sm:border-r sm:border-dashed sm:border-[#c8a968] sm:px-4">
                  <Calendar className="mt-0.5 h-6 w-6 shrink-0 text-[#b48936]" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#395138]">
                      Data
                    </p>
                    <p className="mt-2 font-serif text-sm leading-relaxed text-[#515e4d]">
                      {config.festa_data || "Data a confirmar"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 px-2 sm:border-r sm:border-dashed sm:border-[#c8a968] sm:px-4">
                  <Clock className="mt-0.5 h-6 w-6 shrink-0 text-[#b48936]" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#395138]">
                      Horário
                    </p>
                    <p className="mt-2 font-serif text-sm leading-relaxed text-[#515e4d]">
                      {config.festa_hora || "Horário a confirmar"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 px-2 sm:px-4">
                  <MapPin className="mt-0.5 h-6 w-6 shrink-0 text-[#b48936]" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#395138]">
                      Local
                    </p>
                    <p className="mt-2 font-serif text-sm leading-relaxed text-[#515e4d]">
                      {config.festa_local || "Local a confirmar"}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="mt-7 h-14 w-full rounded-md border-[#52674f] bg-transparent font-serif text-sm uppercase tracking-[0.16em] text-[#395138] transition-colors hover:bg-[#395138] hover:text-white"
                onClick={() => abrirMapa(config.festa_mapa_url)}
              >
                <MapPin className="mr-2 h-5 w-5" />
                Abrir no Google Maps
              </Button>
            </div>
          </article>
        </div>

        {/* Frase final */}
        <div className="mx-auto mt-14 max-w-5xl text-center md:mt-18">
          <Quote className="mx-auto mb-4 h-7 w-7 text-[#b89450]" />
          <p className="font-serif text-lg italic leading-relaxed text-[#52624e] md:text-2xl">
            Estamos preparando cada detalhe com muito amor para viver esse dia
            inesquecível ao lado de vocês.
          </p>

          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#b89450]/70" />
            <Heart className="h-4 w-4 fill-[#b89450] text-[#b89450]" />
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#b89450]/70" />
          </div>
        </div>
      </div>
    </section>
  );
}
