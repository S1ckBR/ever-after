"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Gift, Heart, Sparkles } from "lucide-react";

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

const formatarMoeda = (valor: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);

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
  const totalCotasSeguro = Math.max(totalCotas, 1);
  const cotasCompradasSeguras = Math.min(
    Math.max(cotasCompradas, 0),
    totalCotasSeguro
  );

  const valorCota = valorTotal / totalCotasSeguro;
  const progressoPorcentagem =
    (cotasCompradasSeguras / totalCotasSeguro) * 100;
  const cotasRestantes = Math.max(
    totalCotasSeguro - cotasCompradasSeguras,
    0
  );
  const presenteConcluido = cotasRestantes === 0;

  return (
    <Card
      className={[
        "group relative flex h-full flex-col overflow-hidden rounded-[26px]",
        "border border-[#ddd3c1] bg-[#fffdf9]",
        "shadow-[0_16px_45px_rgba(70,81,65,0.10)]",
        "transition-all duration-500",
        "hover:-translate-y-2 hover:shadow-[0_26px_65px_rgba(70,81,65,0.18)]",
        presenteConcluido ? "ring-1 ring-[#b89450]/45" : "",
      ].join(" ")}
    >
      {/* Imagem completa, sem cortes */}
      <div className="relative h-60 w-full overflow-hidden bg-[#eeeae1] sm:h-64">
        {/* Fundo suave criado com a própria imagem para evitar faixas vazias */}
        <Image
          src={imagemUrl}
          alt=""
          fill
          aria-hidden="true"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="scale-110 object-cover opacity-20 blur-2xl"
        />

        <div className="absolute inset-0 bg-[#f7f3eb]/35" />

        {/* Imagem principal enquadrada por inteiro */}
        <Image
          src={imagemUrl}
          alt={nome}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-contain p-1.5 transition-transform duration-700 group-hover:scale-[1.015] sm:p-2"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

        {/* Selo de cotas */}
        <div
          className={[
            "absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full",
            "border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.13em]",
            "shadow-[0_8px_22px_rgba(0,0,0,0.14)] backdrop-blur-md",
            presenteConcluido
              ? "border-[#d9bb79]/70 bg-[#f7e9c8]/95 text-[#7b5b20]"
              : "border-white/65 bg-white/90 text-[#3f573d]",
          ].join(" ")}
        >
          {presenteConcluido ? (
            <>
              <Heart className="h-3.5 w-3.5 fill-[#b48936] text-[#b48936]" />
              Presente completo
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5 text-[#b48936]" />
              Restam {cotasRestantes}{" "}
              {cotasRestantes === 1 ? "cota" : "cotas"}
            </>
          )}
        </div>

        {/* Ornamento inferior */}
        <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 translate-y-1/2 items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#fffdf9] bg-[#dfe7da] shadow-md">
            {presenteConcluido ? (
              <Check className="h-6 w-6 text-[#a27c36]" />
            ) : (
              <Gift className="h-6 w-6 text-[#a27c36]" />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-7">
        <CardHeader className="px-6 pb-3 pt-4 text-center">
          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#b89450]/65" />
            <Heart className="h-3.5 w-3.5 fill-[#b89450] text-[#b89450]" />
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#b89450]/65" />
          </div>

          <CardTitle className="font-serif text-2xl font-normal leading-snug tracking-wide text-[#395138]">
            {nome}
          </CardTitle>

          <p className="mt-3 line-clamp-3 min-h-[66px] font-serif text-sm italic leading-relaxed text-[#687163]">
            {descricao}
          </p>
        </CardHeader>

        <CardContent className="flex-1 space-y-5 px-6 py-4">
          <div className="rounded-2xl border border-[#e7dfd0] bg-[#f8f4ec]/75 px-4 py-4">
            <div className="flex items-end justify-between gap-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#71806d]">
                Valor total
              </span>
              <span className="font-serif text-xl text-[#395138]">
                {formatarMoeda(valorTotal)}
              </span>
            </div>

            <div className="my-3 h-px bg-gradient-to-r from-transparent via-[#d8c7a5] to-transparent" />

            <div className="flex items-end justify-between gap-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#71806d]">
                Valor da cota
              </span>
              <span className="font-serif text-base font-semibold text-[#a27c36]">
                {formatarMoeda(valorCota)}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 text-xs text-[#60705c]">
              <span className="font-serif italic">Progresso do presente</span>
              <span className="font-semibold">
                {cotasCompradasSeguras} de {totalCotasSeguro} cotas
              </span>
            </div>

            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[#e8ede5]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#91a88a] via-[#789470] to-[#b89450] transition-all duration-700"
                style={{
                  width: `${Math.min(
                    Math.max(progressoPorcentagem, 0),
                    100
                  )}%`,
                }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,.45)_45%,transparent_70%)] opacity-50" />
            </div>

            <p className="text-right text-[11px] font-medium text-[#7d8978]">
              {Math.round(progressoPorcentagem)}% alcançado
            </p>
          </div>
        </CardContent>

        <CardFooter className="px-6 pb-6 pt-2">
          <Button
            type="button"
            disabled={presenteConcluido}
            onClick={() => onPresentear(id)}
            className={[
              "h-14 w-full rounded-xl border text-xs font-semibold uppercase tracking-[0.16em]",
              "transition-all duration-300",
              presenteConcluido
                ? "cursor-not-allowed border-[#d8c28d] bg-[#f1e6ca] text-[#7d632a] opacity-100"
                : "border-[#395138] bg-[#395138] text-[#fffdf9] shadow-[0_10px_24px_rgba(57,81,56,0.18)] hover:bg-[#4e694a] hover:shadow-[0_14px_30px_rgba(57,81,56,0.25)]",
            ].join(" ")}
          >
            {presenteConcluido ? (
              <>
                <Heart className="mr-2 h-4 w-4 fill-current" />
                Presente concluído
              </>
            ) : (
              <>
                <Gift className="mr-2 h-4 w-4" />
                Quero presentear
              </>
            )}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}