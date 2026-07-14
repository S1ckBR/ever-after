"use client";

import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock } from "lucide-react";

interface DetailsProps {
  config: any;
}

export default function Details({ config }: DetailsProps) {
  return (
    <section id="cerimonia" className="py-20 bg-[#f7f9f5] border-t border-[#e1e9dc]">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        
        <div className="text-center space-y-3 mb-16">
          <span className="text-[11px] tracking-[0.25em] uppercase text-[#607d5b] block font-semibold">
            {config.titulo_cerimonial || "O Grande Dia"}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-light text-[var(--color-primary)]">
            {config.subtitulo_cerimonial || "Onde e Quando acontecerá"}
          </h2>
          <div className="h-[1px] w-16 bg-[#a3b899] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          
          {/* Box 1: Cerimônia */}
          <div className="bg-white border border-[#e1e9dc] p-8 md:p-12 text-center space-y-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <span className="font-serif italic text-2xl text-[var(--color-primary)] font-light block">
                Cerimônia
              </span>
              <div className="h-[1px] w-12 bg-[#e1e9dc] mx-auto" />
              
              <div className="space-y-3 text-sm text-[#607d5b] flex flex-col items-center">
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#a3b899]" />
                  {config.cerimonia_data}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#a3b899]" />
                  {config.cerimonia_hora}
                </p>
                <p className="flex items-center gap-2 text-center max-w-[280px]">
                  <MapPin className="h-4 w-4 text-[#a3b899] shrink-0" />
                  {config.cerimonia_local}
                </p>
              </div>
            </div>

            <Button 
              variant="outline"
              className="border-[#3b5336] text-[#3b5336] hover:bg-[#3b5336] hover:text-[#fdfcf9] rounded-none w-full uppercase text-xs tracking-widest py-5 cursor-pointer mt-6"
              onClick={() => window.open(config.cerimonia_mapa_url || "https://maps.google.com", "_blank")}
            >
              Ver Local no Mapa
            </Button>
          </div>

          {/* Box 2: Recepção / Festa */}
          <div className="bg-white border border-[#e1e9dc] p-8 md:p-12 text-center space-y-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <span className="font-serif italic text-2xl text-[var(--color-primary)] font-light block">
                Recepção & Festa
              </span>
              <div className="h-[1px] w-12 bg-[#e1e9dc] mx-auto" />
              
              <div className="space-y-3 text-sm text-[#607d5b] flex flex-col items-center">
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#a3b899]" />
                  {config.festa_data}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#a3b899]" />
                  {config.festa_hora}
                </p>
                <p className="flex items-center gap-2 text-center max-w-[280px]">
                  <MapPin className="h-4 w-4 text-[#a3b899] shrink-0" />
                  {config.festa_local}
                </p>
              </div>
            </div>

            <Button 
              variant="outline"
              className="border-[#3b5336] text-[#3b5336] hover:bg-[#3b5336] hover:text-[#fdfcf9] rounded-none w-full uppercase text-xs tracking-widest py-5 cursor-pointer mt-6"
              onClick={() => window.open(config.festa_mapa_url || "https://maps.google.com", "_blank")}
            >
              Ver Local no Mapa
            </Button>
          </div>

        </div>

      </div>
    </section>
  );
}