"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e1e9dc] bg-[#fdfcf9]/80 backdrop-blur-md">
      <div className="mx-auto flex max-h-20 max-w-6xl items-center justify-between p-4 md:px-8">
        
        <div className="flex items-center space-x-2">
          <div className="border border-[#3b5336] px-3 py-1 text-xl font-serif font-light tracking-widest text-[#3b5336]">
            T <span className="text-[#a3b899]">|</span> K
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-xs font-medium uppercase tracking-widest text-[#607d5b]">
          <Link href="#home" className="hover:text-[#3b5336] transition-colors">Home</Link>
          <Link href="#historia" className="hover:text-[#3b5336] transition-colors">Nossa História</Link>
          <Link href="#cerimonia" className="hover:text-[#3b5336] transition-colors">Cerimônia & Recepção</Link>
          <Link href="#presentes" className="hover:text-[#3b5336] transition-colors">Presentes</Link>
          <Link href="#rsvp" className="hover:text-[#3b5336] transition-colors">Confirme sua Presença</Link>
          <Link href="#mensagens" className="hover:text-[#3b5336] transition-colors">Mensagens</Link>
        </nav>

        {/* Botão sem asChild para evitar erros */}
        <Link 
          href="/admin/configuracoes" 
          className="bg-[#3b5336] hover:bg-[#4e6b48] text-[#fdfcf9] px-4 py-2 rounded-none uppercase text-[10px] tracking-widest font-semibold transition-colors"
        >
          Painel dos Noivos
        </Link>

      </div>
    </header>
  );
}