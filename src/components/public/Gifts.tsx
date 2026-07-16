"use client";

import { useState } from "react";
import Image from "next/image";
import CheckoutModal from "./CheckoutModal";
import { Button } from "@/components/ui/button"; // Assumindo que você usa este componente

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
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Lado Esquerdo: Texto de Apoio */}
          <div className="md:col-span-4 flex flex-col justify-center space-y-6">
            <div className="space-y-3">
              <span className="text-[11px] tracking-[0.25em] uppercase text-[#607d5b] block font-semibold">
                Lista de Presentes
              </span>
              <div className="h-[1px] w-12 bg-[#a3b899]" />
              <h2 className="font-serif text-4xl font-light text-[#3b5336] leading-tight">
                Escolha um presente para nos ajudar a construir novas memórias!
              </h2>
              <p className="text-sm text-[#607d5b] font-serif italic leading-relaxed">
                Sua presença é o nosso maior presente, mas se desejar nos presentear, criamos uma lista de cotas para a nossa viagem e novos começos.
              </p>
            </div>
            
            <Button className="bg-[#8fa883] hover:bg-[#7a9470] text-white rounded-none w-fit px-8 py-6 uppercase tracking-widest text-xs">
              Ver todos os presentes
            </Button>
          </div>

          {/* Lado Direito: Grid de Cards */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {presentes.map((p) => {
              const valorCota = p.valor_total / p.total_cotas;
              const progressoCotas = (p.cotas_compradas / p.total_cotas) * 100;
              const esgotado = p.cotas_compradas >= p.total_cotas;

              return (
                <div 
                  key={p.id} 
                  className="bg-white border border-[#e1e9dc] p-4 flex flex-col transition-all duration-300 hover:shadow-lg"
                >
                  {/* Imagem */}
                  <div className="relative h-48 w-full overflow-hidden bg-[#f4f6f3] mb-4">
                    <Image
                      src={p.imagem_url}
                      alt={p.nome}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Detalhes */}
                  <div className="flex-1 space-y-2 mb-4">
                    <h3 className="font-serif text-lg text-[#3b5336]">{p.nome}</h3>
                    <p className="font-serif text-sm font-bold text-[#607d5b]">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valorCota)}
                    </p>
                    
                    {/* Barra de Progresso */}
                    <div className="pt-2">
                      <div className="text-[10px] text-[#607d5b] mb-1">
                        {p.cotas_compradas} de {p.total_cotas} cotas
                      </div>
                      <div className="h-1.5 w-full bg-[#eef2ed] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#8fa883]" 
                          style={{ width: `${Math.min(progressoCotas, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Botão */}
                  <button
                    disabled={esgotado}
                    onClick={() => setPresenteSelecionado(p)}
                    className={`w-full py-3 text-xs tracking-widest uppercase font-semibold transition-colors border border-[#3b5336] ${
                      esgotado
                        ? "bg-[#eef2ed] text-[#a3b899] border-transparent cursor-not-allowed"
                        : "bg-transparent text-[#3b5336] hover:bg-[#3b5336] hover:text-white"
                    }`}
                  >
                    {esgotado ? "Esgotado" : "Presentear"}
                  </button>
                </div>
              );
            })}
          </div>
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