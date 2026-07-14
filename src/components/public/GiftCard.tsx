"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

interface GiftCardProps {
  id: string;
  nome: string;
  descricao: string;
  valorTotal: number;
  totalCotas: number;
  cotasCompradas: number;
  imagemUrl: string;
  onPresentear: (id: string) => void;
}

export default function GiftCard({
  id,
  nome,
  descricao,
  valorTotal,
  totalCotas,
  cotasCompradas,
  imagemUrl,
  onPresentear,
}: GiftCardProps) {
  const valorCota = valorTotal / totalCotas;
  const progressoPorcentagem = (cotasCompradas / totalCotas) * 100;

  return (
    <Card className="rounded-none border-[#e1e9dc] bg-white shadow-sm overflow-hidden flex flex-col justify-between h-full transition-transform hover:scale-[1.01]">
      <div>
        {/* Imagem do Presente */}
        <div className="relative h-48 w-full bg-slate-50 border-b border-[#e1e9dc]">
          <Image
            src={imagemUrl}
            alt={nome}
            fill
            className="object-cover"
          />
        </div>

        <CardHeader className="p-5 pb-2">
          <CardTitle className="font-serif text-xl font-light text-[#3b5336] tracking-wide">
            {nome}
          </CardTitle>
          <p className="text-xs text-[#607d5b] font-serif italic line-clamp-2 mt-1">
            {descricao}
          </p>
        </CardHeader>

        <CardContent className="px-5 py-3 space-y-4">
          {/* Informações de Valores */}
          <div className="flex justify-between items-baseline">
            <span className="text-xs uppercase tracking-widest text-[#607d5b]">Valor total</span>
            <span className="text-lg font-serif font-light text-[#3b5336]">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valorTotal)}
            </span>
          </div>

          <div className="flex justify-between items-baseline border-t border-[#f4f6f3] pt-2">
            <span className="text-xs uppercase tracking-widest text-[#607d5b]">Valor da cota</span>
            <span className="text-sm font-sans font-medium text-[#607d5b]">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valorCota)}
            </span>
          </div>

          {/* Progresso de Cotas */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-[#607d5b]">
              <span>Progressão das cotas</span>
              <span className="font-medium">{cotasCompradas} de {totalCotas}</span>
            </div>
            {/* Barra de Progresso customizada verde Sage */}
            <div className="h-2 w-full bg-[#eef2ed] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#8fa883] transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(progressoPorcentagem, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </div>

      <CardFooter className="p-5 pt-0">
        <Button
          onClick={() => onPresentear(id)}
          className="w-full bg-[#3b5336] hover:bg-[#4e6b48] text-[#fdfcf9] rounded-none py-5 text-xs tracking-widest uppercase font-semibold flex items-center justify-center gap-2 cursor-pointer"
        >
          Presentear <Gift className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}