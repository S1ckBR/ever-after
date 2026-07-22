"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, Gem, Wine, Gift, Mail } from "lucide-react";
import Countdown from "./Countdown";

interface HeroProps {
  nomeNoiva?: string;
  nomeNoivo?: string;
  dataCasamento?: string;
  imagemHero?: string;
}

export default function Hero({
  nomeNoiva,
  nomeNoivo,
  dataCasamento,
  imagemHero,
}: HeroProps) {
  const targetDate = dataCasamento || new Date().toISOString();

  const datePart = targetDate.includes("T")
    ? targetDate.split("T")[0]
    : targetDate;

  const [year, month, day] = datePart.split("-").map(Number);

  const meses = [
    "JANEIRO",
    "FEVEREIRO",
    "MARÇO",
    "ABRIL",
    "MAIO",
    "JUNHO",
    "JULHO",
    "AGOSTO",
    "SETEMBRO",
    "OUTUBRO",
    "NOVEMBRO",
    "DEZEMBRO",
  ];

  const dataFormatada =
    year && month && day
      ? `${day.toString().padStart(2, "0")} · ${
          meses[month - 1]
        } · ${year}`
      : "DATA A DEFINIR";

  const scrollToSection = (id: string) => {
    const exactTarget = document.getElementById(id);

    if (exactTarget) {
      exactTarget.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    // Compatibilidade caso a seção de recepção use outro ID semelhante.
    if (id === "recepcao") {
      const receptionTarget = document.querySelector<HTMLElement>(
        '[id*="recep" i], [data-section*="recep" i]'
      );

      receptionTarget?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const navLinks = [
    {
      label: "NOSSA HISTÓRIA",
      sub: "Tudo começou de um jeito que nunca imaginamos...",
      cta: "LER MAIS",
      icon: Heart,
      id: "historia",
    },
    {
      label: "CERIMÔNIA",
      sub: "21 de novembro de 2026 às 17h45",
      cta: "VER LOCAL",
      icon: Gem,
      id: "cerimonia",
    },
    {
      label: "RECEPÇÃO",
      sub: "21 de novembro de 2026 às 19h00",
      cta: "VER LOCAL",
      icon: Wine,
      id: "recepcao",
    },
    {
      label: "PRESENTES",
      sub: "Sua presença é nosso maior presente, mas se quiser...",
      cta: "VER PRESENTES",
      icon: Gift,
      id: "presentes",
    },
    {
      label: "MENSAGENS",
      sub: "Deixe aqui seu carinho para esse momento especial.",
      cta: "VER MENSAGENS",
      icon: Mail,
      id: "mensagens",
    },
  ];

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[#f6f3ec] pt-10 md:pt-14"
    >
      {/* Fundo decorativo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8f5ef_0%,#edf3ea_45%,#f7f4ed_100%)]" />

        <div className="absolute -left-32 -top-36 h-[420px] w-[420px] rounded-full bg-[#b9c9af]/25 blur-3xl" />

        <div className="absolute -right-28 top-20 h-[380px] w-[380px] rounded-full bg-[#d9c9a6]/20 blur-3xl" />

        <div className="absolute bottom-0 left-1/2 h-[260px] w-[620px] -translate-x-1/2 rounded-full bg-white/35 blur-3xl" />
      </div>

      {/* Folhagem decorativa esquerda */}
      <svg
        aria-hidden="true"
        viewBox="0 0 280 420"
        className="pointer-events-none absolute -left-16 top-10 hidden h-[420px] w-[280px] text-[#6f8768]/20 lg:block"
        fill="none"
      >
        <path
          d="M40 410C48 300 75 210 144 126C176 87 207 56 244 24"
          stroke="currentColor"
          strokeWidth="2"
        />

        <path
          d="M90 274C48 261 22 226 18 190C56 192 93 219 90 274Z"
          fill="currentColor"
        />

        <path
          d="M133 185C94 162 78 120 88 83C124 98 151 137 133 185Z"
          fill="currentColor"
        />

        <path
          d="M155 145C180 105 216 84 253 88C245 126 209 156 155 145Z"
          fill="currentColor"
        />

        <path
          d="M69 326C37 315 12 288 5 254C42 252 76 277 69 326Z"
          fill="currentColor"
        />
      </svg>

      {/* Folhagem decorativa direita */}
      <svg
        aria-hidden="true"
        viewBox="0 0 280 420"
        className="pointer-events-none absolute -right-16 top-24 hidden h-[420px] w-[280px] -scale-x-100 text-[#6f8768]/15 lg:block"
        fill="none"
      >
        <path
          d="M40 410C48 300 75 210 144 126C176 87 207 56 244 24"
          stroke="currentColor"
          strokeWidth="2"
        />

        <path
          d="M90 274C48 261 22 226 18 190C56 192 93 219 90 274Z"
          fill="currentColor"
        />

        <path
          d="M133 185C94 162 78 120 88 83C124 98 151 137 133 185Z"
          fill="currentColor"
        />

        <path
          d="M155 145C180 105 216 84 253 88C245 126 209 156 155 145Z"
          fill="currentColor"
        />

        <path
          d="M69 326C37 315 12 288 5 254C42 252 76 277 69 326Z"
          fill="currentColor"
        />
      </svg>

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid min-h-[620px] grid-cols-1 items-center gap-14 pb-24 md:grid-cols-12 md:gap-10 lg:gap-16">
          {/* Texto */}
          <div className="order-2 space-y-6 text-center md:order-1 md:col-span-6 md:text-left">
            <div className="space-y-3">
              <span className="block font-serif text-xl italic text-[#71836b] md:text-2xl">
                O nosso felizes para sempre está chegando!
              </span>

              <div className="flex items-center justify-center gap-3 md:justify-start">
                <div className="h-px w-12 bg-[#b59a69]" />

                <Heart className="h-4 w-4 fill-[#b59a69] text-[#b59a69]" />

                <div className="h-px w-12 bg-[#b59a69]" />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="font-serif text-5xl leading-[0.95] tracking-tight text-[#40513d] sm:text-6xl md:text-7xl lg:text-[82px]">
                {nomeNoiva || "Noiva"}
                <span className="mx-3 inline-block font-light italic text-[#b59a69]">
                  &
                </span>
                {nomeNoivo || "Noivo"}
              </h1>

              <p className="font-serif text-sm font-medium uppercase tracking-[0.28em] text-[#66745f] sm:text-base">
                {dataFormatada}
              </p>
            </div>

            <p className="mx-auto max-w-lg font-serif text-lg leading-relaxed text-[#65705f] md:mx-0 md:text-xl">
              Dois corações, uma nova história e um para sempre para
              compartilhar com quem faz parte da nossa caminhada.
            </p>

            <div className="flex flex-col items-center gap-5 pt-2 sm:flex-row sm:justify-center md:justify-start">
              <Button
                onClick={() =>
                  document
                    .getElementById("rsvp")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="group h-auto rounded-full border border-[#7d9474] bg-[#7d9474] px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_14px_30px_rgba(76,97,71,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#6d8464] hover:shadow-[0_18px_34px_rgba(76,97,71,0.26)]"
              >
                Confirme sua presença

                <Heart className="ml-2 h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" />
              </Button>

              <div className="flex items-center gap-3 text-[#8b7453]">
                <div className="h-px w-8 bg-[#c8b58f]" />

                <span className="font-serif text-sm italic">
                  Tayná & Kaique
                </span>

                <div className="h-px w-8 bg-[#c8b58f]" />
              </div>
            </div>
          </div>

          {/* Imagem */}
          <div className="order-1 md:order-2 md:col-span-6">
            <div className="relative mx-auto w-full max-w-[560px]">
              {/* Círculos decorativos */}
              <div className="absolute -inset-5 rounded-[42px] border border-[#cdbb94]/55" />

              <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full border border-[#b59a69]/40" />

              <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-[#a8ba9e]/25 blur-sm" />

              <div className="absolute left-6 top-6 z-20 rounded-full border border-white/60 bg-white/75 px-4 py-2 shadow-sm backdrop-blur">
                <span className="font-serif text-xs italic tracking-wide text-[#63705d]">
                  21 de novembro de 2026
                </span>
              </div>

              {/* Moldura da foto */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-[34px] border-[10px] border-white bg-white shadow-[0_30px_70px_rgba(68,82,64,0.23)]">
                <Image
                  src={
                    imagemHero ||
                    "https://images.unsplash.com/photo-1519741497674-611481863552"
                  }
                  alt="Noivos"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#394936]/20 via-transparent to-white/5" />

                <div className="pointer-events-none absolute inset-3 rounded-[24px] border border-white/50" />
              </div>

              {/* Selo decorativo */}
              <div className="absolute -bottom-7 right-5 z-20 flex h-24 w-24 flex-col items-center justify-center rounded-full border border-[#c5ad7e] bg-[#f7f3ea] text-center shadow-lg">
                <Heart className="mb-1 h-4 w-4 fill-[#8ca080] text-[#8ca080]" />

                <span className="font-serif text-[10px] uppercase leading-tight tracking-[0.16em] text-[#6c775f]">
                  Nosso
                  <br />
                  grande dia
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Countdown */}
        <div className="relative z-30 -mb-12">
          <div className="relative overflow-hidden rounded-[28px] border border-white/50 bg-[#829779] px-4 py-7 shadow-[0_24px_60px_rgba(57,73,54,0.28)] sm:px-8 md:px-10">
            {/* Efeitos decorativos do contador */}
            <div className="pointer-events-none absolute -left-16 -top-20 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

            <div className="pointer-events-none absolute -bottom-24 -right-16 h-56 w-56 rounded-full bg-[#d3bc8c]/15 blur-2xl" />

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_45%,rgba(255,255,255,0.04))]" />

            <div className="relative z-10">
              <div className="mb-5 flex items-center justify-center gap-3">
                <div className="h-px w-10 bg-white/40" />

                <Heart className="h-4 w-4 fill-[#e3cfaa] text-[#e3cfaa]" />

                <p className="font-serif text-sm uppercase tracking-[0.24em] text-white/90">
                  Contagem regressiva
                </p>

                <Heart className="h-4 w-4 fill-[#e3cfaa] text-[#e3cfaa]" />

                <div className="h-px w-10 bg-white/40" />
              </div>

              <div className="[&_p]:text-white [&_span]:text-white [&_*]:border-white/20">
                <Countdown targetDate={targetDate} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de navegação das seções */}
      <div className="relative mt-12 w-full overflow-hidden bg-[linear-gradient(135deg,#9eb292_0%,#879f7d_50%,#718969_100%)] pb-12 pt-24">
        {/* Textura decorativa */}
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute -left-24 top-4 h-72 w-72 rounded-full border border-white/15" />

          <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full border border-white/10" />

          <div className="absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-5 px-5 sm:grid-cols-2 sm:px-8 md:grid-cols-5 md:gap-0">
          {navLinks.map((link, idx) => {
            const Icon = link.icon;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToSection(link.id)}
                className="group relative flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-7 text-white shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.12] hover:shadow-xl md:rounded-none md:border-y-0 md:border-l-0 md:border-r md:bg-transparent md:shadow-none md:last:border-r-0"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-white/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/15">
                  <Icon className="h-6 w-6 text-[#f4e4c5] drop-shadow-sm" />
                </div>

                <span className="mb-3 text-center text-xs font-bold uppercase tracking-[0.17em] drop-shadow-sm sm:text-sm">
                  {link.label}
                </span>

                <span className="mb-5 max-w-[190px] text-center font-serif text-sm leading-relaxed text-white/85">
                  {link.sub}
                </span>

                <span className="relative text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f6e5c3]">
                  {link.cta}

                  <span className="absolute -bottom-2 left-1/2 h-px w-8 -translate-x-1/2 bg-[#e5cfa4] transition-all duration-300 group-hover:w-full" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
