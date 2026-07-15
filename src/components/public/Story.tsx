"use client";

import Image from "next/image";

interface StoryProps {
  config: {
    imagem_historia_1?: string;
    imagem_historia_2?: string;
    texto_historia?: string;
  };
}

export default function Story({ config }: StoryProps) {
  return (
    <section id="historia" className="py-20 bg-white">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Imagens */}
          <div className="relative h-[400px] md:h-[500px]">
            <Image
              src={config.imagem_historia_1 || "https://images.unsplash.com/photo-1522673607200-169d1b82a3ad?auto=format&fit=crop&q=80&w=800"}
              alt="História 1"
              fill
              className="object-cover rounded-none"
            />
          </div>

          {/* Texto */}
          <div className="space-y-6">
            <h2 className="font-serif text-3xl text-[#3b5336]">Nossa História</h2>
            <div className="prose prose-stone text-[#607d5b]">
              <p className="font-serif leading-relaxed">
                {config.texto_historia || "Conte um pouco sobre como vocês se conheceram e a trajetória até aqui..."}
              </p>
            </div>
            
            {config.imagem_historia_2 && (
              <div className="relative h-[200px] w-full">
                <Image
                  src={config.imagem_historia_2}
                  alt="História 2"
                  fill
                  className="object-cover rounded-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}