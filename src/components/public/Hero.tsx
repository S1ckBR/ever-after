"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Countdown from "./Countdown";

interface HeroProps {
  nomeNoiva?: string;
  nomeNoivo?: string;
  dataCasamento?: string;
}

export default function Hero({ 
  nomeNoiva = "Tayná", 
  nomeNoivo = "Kaique", 
  dataCasamento = "2026-11-21T18:00:00" 
}: HeroProps) {
  
  // Formata a exibição da data de forma elegante
  const dataFormatada = new Date(dataCasamento).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  return (
    <section id="home" className="relative py-12 md:py-20 overflow-hidden bg-[var(--color-secondary)]">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          {/* Coluna Esquerda: Texto */}
          <div className="md:col-span-5 text-center md:text-left flex flex-col justify-center space-y-6 md:pr-6">
            <span className="font-serif italic text-xl md:text-2xl text-[#607d5b] font-light">
              O nosso felizes para sempre está chegando!
            </span>
            
            <div className="flex justify-center md:justify-start">
              <Heart className="h-4 w-4 text-[#a3b899] fill-[#a3b899]" />
            </div>

            <h2 className="font-serif text-5xl md:text-6xl font-light tracking-wide text-[var(--color-primary)] leading-tight">
              {nomeNoiva} & {nomeNoivo}
            </h2>

            <p className="font-serif text-lg tracking-widest text-[#607d5b] uppercase font-light">
              {dataFormatada}
            </p>

            <div className="pt-2">
              <Button 
                style={{ backgroundColor: "var(--color-buttons)" }}
                className="hover:opacity-90 text-[#fdfcf9] rounded-none px-8 py-6 text-xs tracking-widest uppercase font-semibold flex items-center gap-2 shadow-md transition-all w-full md:w-auto justify-center cursor-pointer"
              >
                Confirme sua Presença <Heart className="h-3 w-3 fill-current" />
              </Button>
            </div>
          </div>

          {/* Coluna Direita: Imagem Principal */}
          <div className="md:col-span-7 relative h-[350px] md:h-[500px] w-full border border-[#e1e9dc] p-3 bg-white shadow-sm">
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200"
                alt="Noivos"
                fill
                priority
                className="object-cover grayscale-[15%] brightness-95"
              />
            </div>
          </div>

        </div>

        {/* Cronômetro */}
        <div className="mt-12 md:-mt-10 relative z-10">
          <Countdown targetDate={dataCasamento} />
        </div>

      </div>
    </section>
  );
}