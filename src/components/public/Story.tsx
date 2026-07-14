"use client";

import Image from "next/image";
import { Heart } from "lucide-react";

export default function Story() {
  return (
    <section id="historia" className="py-20 bg-[#fdfcf9] border-t border-[#e1e9dc]">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
          
          {/* Coluna Esquerda: Fotos Sobrepostas (Efeito colagem do protótipo) */}
          <div className="md:col-span-6 relative h-[450px] flex items-center justify-center">
            {/* Foto de Trás / Fundo */}
            <div className="absolute top-4 left-4 w-[65%] h-[75%] border border-[#e1e9dc] p-2 bg-white shadow-sm rotate-[-4deg] z-10">
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=600"
                  alt="Nossa História 1"
                  fill
                  className="object-cover grayscale-[10%]"
                />
              </div>
            </div>

            {/* Foto da Frente / Destaque */}
            <div className="absolute bottom-4 right-4 w-[65%] h-[75%] border border-[#e1e9dc] p-2 bg-white shadow-md rotate-[3deg] z-20">
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600"
                  alt="Nossa História 2"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Coluna Direita: Texto */}
          <div className="md:col-span-6 text-center md:text-left space-y-6">
            <span className="text-[11px] tracking-[0.25em] uppercase text-[#607d5b] block font-semibold">
              Nossa História
            </span>
            
            <div className="flex justify-center md:justify-start items-center space-x-2">
              <div className="h-[1px] w-12 bg-[#a3b899]" />
              <Heart className="h-3 w-3 text-[#a3b899] fill-[#a3b899]" />
              <div className="h-[1px] w-12 bg-[#a3b899]" />
            </div>

            <h2 className="font-serif text-3xl md:text-4xl font-light text-[#3b5336] leading-snug">
              De amigos, para namorados, <br />
              e hoje, para sempre.
            </h2>

            <div className="space-y-4 font-sans text-sm text-[#607d5b] leading-relaxed text-justify">
              <p>
                A vida tem um jeito lindo de conectar pessoas. Entre conversas despretensiosas, risadas compartilhadas e momentos simples do cotidiano, descobrimos que fomos feitos um para o outro.
              </p>
              <p>
                O que começou como uma linda amizade cresceu, amadureceu e se transformou no amor mais bonito que já sentimos. Agora, estamos prestes a escrever o nosso maior e mais importante capítulo: o nosso casamento!
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}