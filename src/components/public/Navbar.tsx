"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e1e9dc] bg-[#fdfcf9]/80 backdrop-blur-md">
      <div className="mx-auto flex max-h-20 max-w-6xl items-center justify-between p-4 md:px-8">
        
        {/* Logotipo Iniciais */}
        <div className="flex items-center space-x-2">
          <div className="border border-[#3b5336] px-3 py-1 text-xl font-serif font-light tracking-widest text-[#3b5336]">
            T <span className="text-[#a3b899]">|</span> K
          </div>
        </div>

        {/* Links de Navegação - Desktop */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-medium uppercase tracking-widest text-[#607d5b]">
          <Link href="#home" className="hover:text-[#3b5336] transition-colors">Home</Link>
          <Link href="#historia" className="hover:text-[#3b5336] transition-colors">Nossa História</Link>
          <Link href="#cerimonia" className="hover:text-[#3b5336] transition-colors">Cerimônia & Festa</Link>
          <Link href="#presentes" className="hover:text-[#3b5336] transition-colors">Presentes</Link>
          <Link href="#rsvp" className="hover:text-[#3b5336] transition-colors">Confirme sua Presença</Link>
          <Link href="#mensagens" className="hover:text-[#3b5336] transition-colors">Mensagens</Link>
        </nav>

        {/* Botão Painel Administrativo */}
        <div>
          <Button 
            variant="outline" 
            className="border-[#3b5336] text-[#3b5336] hover:bg-[#3b5336] hover:text-[#fdfcf9] rounded-none uppercase text-[10px] tracking-widest px-4 font-semibold"
          >
            Painel dos Noivos
          </Button>
        </div>

      </div>
    </header>
  );
}