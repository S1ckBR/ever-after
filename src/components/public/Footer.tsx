"use client";

import { MessageCircle, Link as LinkIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#A3B899] text-white py-16">
      <div className="mx-auto max-w-6xl px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        
        {/* Coluna 1: Logo/Data */}
        <div className="flex flex-col items-center md:items-start">
          <div className="border border-white/30 p-6 mb-4 w-fit">
             <span className="font-serif text-3xl tracking-widest">T | K</span>
          </div>
          <p className="font-serif text-sm tracking-[0.2em] uppercase">21 · NOVEMBRO · 2026</p>
        </div>

        {/* Coluna 2: Navegação */}
        <div className="flex flex-col items-center md:items-start space-y-3">
          <h4 className="font-serif text-sm tracking-[0.2em] uppercase mb-2">Navegação</h4>
          {["Home", "Nossa História", "Cerimônia & Festa", "Presentes", "Confirme sua Presença", "Mensagens"].map(link => (
            <a key={link} href="#" className="text-xs hover:opacity-80 transition-opacity uppercase tracking-wider">
              {link}
            </a>
          ))}
        </div>

        {/* Coluna 3: Compartilhar */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <h4 className="font-serif text-sm tracking-[0.2em] uppercase mb-2">Compartilhe este site</h4>
          <p className="text-xs max-w-[200px] leading-relaxed">Ajude a gente a compartilhar esse momento tão especial!</p>
          <div className="flex gap-4 pt-2">
            
            {/* Ícone do WhatsApp (MessageCircle do Lucide) */}
            <MessageCircle className="h-5 w-5 cursor-pointer hover:opacity-70" />
            
            {/* Ícone do Facebook (SVG Nativo) */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer hover:opacity-70">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>

            {/* Ícone do Instagram (SVG Nativo) */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer hover:opacity-70">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
            
            {/* Ícone de Link (LinkIcon do Lucide) */}
            <LinkIcon className="h-5 w-5 cursor-pointer hover:opacity-70" />
            
          </div>
        </div>
      </div>
      
      {/* Rodapé Final */}
      <div className="text-center mt-16 text-[10px] uppercase tracking-widest opacity-80 border-t border-white/10 pt-8">
        Desenvolvido pelo Kaique para o nosso grande dia!  
      </div>
    </footer>
  );
}