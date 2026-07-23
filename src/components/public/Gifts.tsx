"use client";

import { useState } from "react";
import { Gift, Heart, Sparkles } from "lucide-react";
import CheckoutModal from "./CheckoutModal";
import GiftCard from "./GiftCard";

interface Presente {
  id: string;
  nome: string;
  descricao: string;
  valor_total: number;
  total_cotas: number;
  cotas_compradas: number;
  imagem_url: string;
  categoria: string;
}

interface GiftsProps {
  presentesIniciais: Presente[];
}

export default function Gifts({ presentesIniciais }: GiftsProps) {
  const [presentes] = useState<Presente[]>(presentesIniciais);
  const [presenteSelecionado, setPresenteSelecionado] =
    useState<Presente | null>(null);

  const selecionarPresente = (presente: Presente) => {
    setPresenteSelecionado(presente);
  };

  return (
    <section
      id="presentes"
      className="relative overflow-hidden bg-[#f7f3eb] py-24 sm:py-28 lg:py-32"
    >
      {/* Brilhos decorativos */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-120px] top-24 h-72 w-72 rounded-full bg-[#dfe7da]/45 blur-3xl" />
        <div className="absolute bottom-10 right-[-120px] h-80 w-80 rounded-full bg-[#eadfca]/55 blur-3xl" />
      </div>

      {/* Ramos decorativos */}
      <svg
        aria-hidden="true"
        viewBox="0 0 220 360"
        className="pointer-events-none absolute -left-10 top-10 hidden h-[360px] w-[220px] text-[#8da084]/25 lg:block"
        fill="none"
      >
        <path
          d="M22 338C61 274 87 215 91 146C94 98 78 53 51 19"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M77 232C49 215 29 188 18 158" stroke="currentColor" strokeWidth="2" />
        <path d="M89 182C119 157 134 126 139 91" stroke="currentColor" strokeWidth="2" />
        <path d="M66 281C38 271 20 251 7 226" stroke="currentColor" strokeWidth="2" />
        <ellipse cx="38" cy="190" rx="17" ry="7" transform="rotate(46 38 190)" fill="currentColor" />
        <ellipse cx="116" cy="137" rx="18" ry="7" transform="rotate(-47 116 137)" fill="currentColor" />
        <ellipse cx="31" cy="255" rx="18" ry="7" transform="rotate(35 31 255)" fill="currentColor" />
        <ellipse cx="74" cy="104" rx="18" ry="7" transform="rotate(63 74 104)" fill="currentColor" />
      </svg>

      <svg
        aria-hidden="true"
        viewBox="0 0 220 360"
        className="pointer-events-none absolute -right-10 bottom-4 hidden h-[360px] w-[220px] rotate-180 text-[#b89a5f]/20 lg:block"
        fill="none"
      >
        <path
          d="M22 338C61 274 87 215 91 146C94 98 78 53 51 19"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M77 232C49 215 29 188 18 158" stroke="currentColor" strokeWidth="2" />
        <path d="M89 182C119 157 134 126 139 91" stroke="currentColor" strokeWidth="2" />
        <path d="M66 281C38 271 20 251 7 226" stroke="currentColor" strokeWidth="2" />
        <ellipse cx="38" cy="190" rx="17" ry="7" transform="rotate(46 38 190)" fill="currentColor" />
        <ellipse cx="116" cy="137" rx="18" ry="7" transform="rotate(-47 116 137)" fill="currentColor" />
        <ellipse cx="31" cy="255" rx="18" ry="7" transform="rotate(35 31 255)" fill="currentColor" />
        <ellipse cx="74" cy="104" rx="18" ry="7" transform="rotate(63 74 104)" fill="currentColor" />
      </svg>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-16">
          <div className="mb-5 inline-flex items-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#b89450]/70" />
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#71806d]">
              <Sparkles className="h-3.5 w-3.5 text-[#b89450]" />
              Lista de presentes
            </span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#b89450]/70" />
          </div>

          <h2 className="font-serif text-4xl font-normal leading-tight text-[#395138] sm:text-5xl lg:text-6xl">
            Um pedacinho dos nossos
            <span className="block italic text-[#6f8669]">novos começos</span>
          </h2>

          <div className="mx-auto my-6 flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-[#cdb98d]/70" />
            <Heart className="h-4 w-4 fill-[#b89450] text-[#b89450]" />
            <span className="h-px w-16 bg-[#cdb98d]/70" />
          </div>

          <p className="mx-auto max-w-2xl font-serif text-base italic leading-relaxed text-[#697365] sm:text-lg">
            Sua presença é o nosso maior presente. Mas, caso queira nos ajudar
            a construir essa nova fase, preparamos algumas ideias especiais —
            e um pouquinho divertidas — para celebrar com a gente.
          </p>
        </div>

        {/* Mensagem de carinho */}
        <div className="mx-auto mb-12 flex max-w-3xl items-start gap-4 rounded-2xl border border-[#dfd4bf] bg-[#fffdf9]/75 px-5 py-4 shadow-[0_10px_35px_rgba(70,81,65,0.06)] backdrop-blur-sm sm:items-center sm:px-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#dfe7da]">
            <Gift className="h-5 w-5 text-[#8a6b30]" />
          </div>
          <p className="font-serif text-sm leading-relaxed text-[#657061] sm:text-base">
            Cada cota representa um gesto de carinho e fará parte das memórias
            que levaremos para a nossa vida a dois.
          </p>
        </div>

        {/* Grid de presentes */}
        {presentes.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {presentes.map((presente) => (
              <GiftCard
                key={presente.id}
                id={presente.id}
                nome={presente.nome}
                descricao={presente.descricao}
                valorTotal={presente.valor_total}
                totalCotas={presente.total_cotas}
                cotasCompradas={presente.cotas_compradas}
                imagemUrl={presente.imagem_url}
                onPresentear={() => selecionarPresente(presente)}
              />
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-[#cdbf9f] bg-[#fffdf9]/70 px-6 py-16 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#e4eadf]">
              <Gift className="h-7 w-7 text-[#6f8669]" />
            </div>
            <h3 className="font-serif text-2xl text-[#395138]">
              Novos presentes em breve
            </h3>
            <p className="mt-3 font-serif text-sm italic leading-relaxed text-[#6c7568]">
              Estamos preparando nossa lista com muito carinho.
            </p>
          </div>
        )}

        {/* Encerramento */}
        <div className="mx-auto mt-16 max-w-2xl text-center">
          <p className="font-serif text-sm italic leading-relaxed text-[#778173] sm:text-base">
            Obrigado por fazer parte da nossa história.
          </p>
          <p className="mt-2 font-serif text-lg text-[#395138]">
            Com carinho, Tayná &amp; Kaique
          </p>
        </div>
      </div>

      {presenteSelecionado && (
        <CheckoutModal
          presente={presenteSelecionado}
          onClose={() => setPresenteSelecionado(null)}
        />
      )}
    </section>
  );
}
