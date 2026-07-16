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

export default function Hero({ nomeNoiva, nomeNoivo, dataCasamento, imagemHero }: HeroProps) {
  const targetDate = dataCasamento || new Date().toISOString();
  const datePart = targetDate.includes('T') ? targetDate.split('T')[0] : targetDate;
  const [year, month, day] = datePart.split('-').map(Number);
  const meses = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];
  const dataFormatada = year && month && day ? `${day.toString().padStart(2, "0")} · ${meses[month - 1]} · ${year}` : "DATA A DEFINIR";

  const navLinks = [
    { label: "NOSSA HISTÓRIA", sub: "Tudo começou de um jeito que nunca imaginamos...", cta: "LER MAIS", icon: Heart, id: "historia" },
    { label: "CERIMÔNIA", sub: "21 de novembro de 2026 às 17h45", cta: "VER LOCAL", icon: Gem, id: "cerimonia" },
    { label: "RECEPÇÃO", sub: "21 de novembro de 2026 às 19h00", cta: "VER LOCAL", icon: Wine, id: "recepcao" },
    { label: "PRESENTES", sub: "Sua presença é nosso maior presente, mas se quiser...", cta: "VER PRESENTES", icon: Gift, id: "presentes" },
    { label: "MENSAGENS", sub: "Deixe aqui seu carinho para esse momento especial.", cta: "VER MENSAGENS", icon: Mail, id: "mensagens" },
  ];

  return (
    <section id="home" className="relative pt-12 pb-0 overflow-hidden bg-[#FDFCF9]">
      
      <div className="mx-auto max-w-6xl px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center mb-20">
          
          {/* Texto */}
          <div className="md:col-span-6 text-center md:text-left space-y-5">
            <span className="font-serif italic text-xl text-[#607d5b]">O nosso felizes para sempre está chegando!</span>
            <div className="flex justify-center md:justify-start gap-2">
              <div className="h-[1px] w-8 bg-[#a3b899]"/>
              <Heart className="h-3 w-3 text-[#a3b899] fill-[#a3b899]"/>
              <div className="h-[1px] w-8 bg-[#a3b899]"/>
            </div>
            <h2 className="font-serif text-5xl md:text-6xl text-[#3b5336] leading-tight">{nomeNoiva || "Noiva"} & {nomeNoivo || "Noivo"}</h2>
            <p className="font-serif text-lg tracking-[0.2em] text-[#607d5b] uppercase">{dataFormatada}</p>
            <Button onClick={() => document.getElementById("rsvp")?.scrollIntoView({behavior: "smooth"})} className="bg-[#8fa883] hover:bg-[#7a9470] text-white rounded-none px-8 py-6 text-xs uppercase tracking-widest shadow-md">
              Confirme sua Presença <Heart className="ml-2 h-3 w-3" />
            </Button>
          </div>

          {/* Imagem */}
          <div className="md:col-span-6 relative h-[450px] w-full">
            <Image src={imagemHero || "https://images.unsplash.com/photo-1519741497674-611481863552"} alt="Noivos" fill className="object-cover rounded-3xl" />
          </div>
        </div>

        {/* Countdown */}
        <div className="relative z-20 -mb-10">
          <div className="bg-white shadow-xl px-8 py-6 rounded-2xl border border-stone-100">
            <Countdown targetDate={targetDate} />
          </div>
        </div>
      </div>

      {/* Barra Verde Sage - Ajustada para maior legibilidade */}
      <div className="w-full bg-[#A3B899] mt-10 py-12">
        <div className="mx-auto max-w-7xl px-2 sm:px-4 grid grid-cols-2 md:grid-cols-5 gap-y-10">
          {navLinks.map((link, idx) => {
            const Icon = link.icon;
            return (
              <button 
                key={idx} 
                onClick={() => document.getElementById(link.id)?.scrollIntoView({behavior: "smooth"})} 
                className="flex flex-col items-center text-white border-r border-white/30 last:border-0 px-3 sm:px-6 hover:opacity-80 transition-opacity"
              >
                <Icon className="h-8 w-8 mb-4 drop-shadow-sm" />
                <span className="text-sm md:text-base tracking-widest font-extrabold mb-3 uppercase text-center drop-shadow-sm">{link.label}</span>
                <span className="text-xs md:text-sm font-semibold leading-relaxed text-center mb-5">{link.sub}</span>
                <span className="text-xs md:text-sm font-bold uppercase underline underline-offset-4 drop-shadow-sm">{link.cta}</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  );
}