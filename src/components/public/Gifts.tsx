"use client";

import GiftCard from "./GiftCard";

interface GiftsProps {
  presentesIniciais: any[];
}

export default function Gifts({ presentesIniciais }: GiftsProps) {
  const handlePresentear = (id: string) => {
    alert(`Você selecionou o presente ID ${id}. Integrando checkout com o Mercado Pago e PIX!`);
  };

  return (
    <section id="presentes" className="py-20 bg-[#fdfcf9] border-t border-[#e1e9dc]">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        
        {/* Cabeçalho da Seção */}
        <div className="text-center space-y-3 mb-16">
          <span className="text-[11px] tracking-[0.25em] uppercase text-[#607d5b] block font-semibold">
            Lista de Presentes
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-light text-[var(--color-primary)]">
            Escolha um presente para nos ajudar a construir novas memórias!
          </h2>
          <div className="h-[1px] w-16 bg-[#a3b899] mx-auto mt-4" />
        </div>

        {/* Grid de Presentes */}
        {presentesIniciais.length === 0 ? (
          <p className="text-center text-sm text-[#607d5b] font-serif italic">Nenhum presente cadastrado ainda.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {presentesIniciais.map((presente) => (
              <GiftCard
                key={presente.id}
                id={presente.id}
                nome={presente.nome}
                descricao={presente.descricao}
                valorTotal={Number(presente.valor_total)}
                totalCotas={presente.total_cotas}
                cotasCompradas={presente.cotas_compradas}
                imagemUrl={presente.imagem_url}
                onPresentear={handlePresentear}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}