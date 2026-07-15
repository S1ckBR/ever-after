"use client";

import { useState } from "react";
import Image from "next/image";
import CheckoutModal from "./CheckoutModal";

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

export default function Gifts({ presentesIniciais }: { presentesIniciais: Presente[] }) {
  const [presentes] = useState<Presente[]>(presentesIniciais);
  const [presenteSelecionado, setPresenteSelecionado] = useState<Presente | null>(null);

  return (
    <section id="presentes" className="py-20 bg-[#fdfcf9]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho da Seção */}
        <div className="text-center space-y-3 mb-16">
          <span className="text-[11px] tracking-[0.25em] uppercase text-[#607d5b] block font-semibold">
            Lista de Presentes
          </span>
          <h2 className="font-serif text-3xl font-light text-[#3b5336]">
            Contribua com nossa Lua de Mel
          </h2>
          <p className="max-w-md mx-auto text-xs text-[#607d5b] font-serif italic leading-relaxed">
            Sua presença é o nosso maior presente, mas se desejar nos presentear, criamos uma lista de cotas para a nossa viagem e novos começos.
          </p>
          <div className="h-[1px] w-16 bg-[#a3b899] mx-auto mt-4" />
        </div>

        {/* Grid de Presentes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {presentes.map((p) => {
            const valorCota = p.valor_total / p.total_cotas;
            const progressoCotas = (p.cotas_compradas / p.total_cotas) * 100;
            const esgotado = p.cotas_compradas >= p.total_cotas;

            return (
              <div 
                key={p.id} 
                className="group bg-white border border-[#e1e9dc] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-md"
              >
                {/* Imagem do Presente */}
                <div className="relative h-56 w-full overflow-hidden bg-[#f4f6f3]">
                  <Image
                    src={p.imagem_url}
                    alt={p.nome}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-4 right-4 text-[9px] uppercase tracking-wider bg-white/90 backdrop-blur-xs text-[#3b5336] px-2.5 py-1 font-semibold border border-[#e1e9dc]">
                    {p.categoria}
                  </span>
                </div>

                {/* Conteúdo Informativo */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl text-[#3b5336] font-light leading-snug">
                      {p.nome}
                    </h3>
                    <p className="text-xs text-[#607d5b] font-serif italic line-clamp-2 leading-relaxed">
                      {p.descricao}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    {/* Barra de Progresso das Cotas */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-[#607d5b]">
                        <span>Cotas compradas:</span>
                        <span className="font-semibold text-[#3b5336]">
                          {p.cotas_compradas} de {p.total_cotas}
                        </span>
                      </div>
                      <div className="h-1 w-full bg-[#eef2ed]">
                        <div 
                          className="h-full bg-[#8fa883] transition-all duration-500" 
                          style={{ width: `${Math.min(progressoCotas, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Preço Unitário da Cota */}
                    <div className="flex justify-between items-center text-xs text-[#607d5b] border-t border-[#f4f6f3] pt-3">
                      <span>Valor da Cota:</span>
                      <span className="font-serif text-sm font-bold text-[#3b5336]">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valorCota)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botão de Compra */}
                <div className="px-6 pb-6 pt-0">
                  <button
                    disabled={esgotado}
                    onClick={() => setPresenteSelecionado(p)}
                    className={`w-full rounded-none py-3.5 text-xs tracking-widest uppercase font-semibold cursor-pointer transition-colors ${
                      esgotado
                        ? "bg-[#eef2ed] text-[#a3b899] cursor-not-allowed"
                        : "bg-[#3b5336] hover:bg-[#4e6b48] text-white"
                    }`}
                  >
                    {esgotado ? "Cotas Esgotadas" : "Presentear"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Renderização Condicional do Modal de Checkout */}
      {presenteSelecionado && (
        <CheckoutModal
          presente={presenteSelecionado}
          onClose={() => setPresenteSelecionado(null)}
        />
      )}
    </section>
  );
}