"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Gift,
  Heart,
  Loader2,
  MessageSquareHeart,
  RefreshCw,
  Settings,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";

interface Presente {
  id?: string;
  nome: string;
  valor_total: number | string;
  total_cotas: number | string;
  cotas_compradas: number | string;
}

interface RegistroRsvp {
  status?: string | null;
  quantidade_adultos?: number | string | null;
  quantidade_criancas?: number | string | null;

  // Compatibilidade com registros antigos
  confirmado?: boolean | null;
  acompanhantes?: number | string | null;
  criancas?: number | string | null;
}

interface DashboardStats {
  totalArrecadado: number;
  totalPresentes: number;
  respostasRsvp: number;
  confirmados: number;
  recusaram: number;
  totalAdultos: number;
  totalCriancas: number;
  mensagensAprovadas: number;
  totalCotas: number;
  cotasCompradas: number;
}

interface ResumoPresente {
  id: string;
  nome: string;
  valorArrecadado: number;
  cotasCompradas: number;
  totalCotas: number;
  progresso: number;
}

const estadoInicial: DashboardStats = {
  totalArrecadado: 0,
  totalPresentes: 0,
  respostasRsvp: 0,
  confirmados: 0,
  recusaram: 0,
  totalAdultos: 0,
  totalCriancas: 0,
  mensagensAprovadas: 0,
  totalCotas: 0,
  cotasCompradas: 0,
};

const formatarMoeda = (valor: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);

const numeroSeguro = (valor: unknown) => {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : 0;
};

const estaConfirmado = (registro: RegistroRsvp) => {
  if (registro.status) {
    return registro.status === "confirmado";
  }

  return registro.confirmado === true;
};

const obterAdultos = (registro: RegistroRsvp) => {
  if (!estaConfirmado(registro)) return 0;

  if (registro.quantidade_adultos != null) {
    return numeroSeguro(registro.quantidade_adultos);
  }

  return 1 + numeroSeguro(registro.acompanhantes);
};

const obterCriancas = (registro: RegistroRsvp) => {
  if (!estaConfirmado(registro)) return 0;

  return numeroSeguro(
    registro.quantidade_criancas ?? registro.criancas ?? 0
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>(estadoInicial);
  const [resumoPresentes, setResumoPresentes] = useState<ResumoPresente[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setErro(null);

    try {
      const [
        resultadoPresentes,
        resultadoRsvp,
        resultadoMensagens,
      ] = await Promise.all([
        supabase
          .from("presentes")
          .select("id, nome, valor_total, total_cotas, cotas_compradas"),
        supabase.from("rsvp").select("*"),
        supabase
          .from("mensagens")
          .select("id", { count: "exact", head: true })
          .eq("aprovado", true),
      ]);

      if (resultadoPresentes.error) throw resultadoPresentes.error;
      if (resultadoRsvp.error) throw resultadoRsvp.error;

      const presentes = (resultadoPresentes.data as Presente[]) ?? [];
      const registrosRsvp =
        (resultadoRsvp.data as RegistroRsvp[]) ?? [];

      let totalArrecadado = 0;
      let totalCotas = 0;
      let cotasCompradas = 0;

      const presentesFormatados = presentes.map((presente, index) => {
        const valorTotal = numeroSeguro(presente.valor_total);
        const quantidadeTotalCotas = Math.max(
          numeroSeguro(presente.total_cotas),
          1
        );
        const quantidadeCotasCompradas = Math.min(
          Math.max(numeroSeguro(presente.cotas_compradas), 0),
          quantidadeTotalCotas
        );

        const valorCota = valorTotal / quantidadeTotalCotas;
        const valorArrecadado =
          valorCota * quantidadeCotasCompradas;
        const progresso =
          (quantidadeCotasCompradas / quantidadeTotalCotas) * 100;

        totalArrecadado += valorArrecadado;
        totalCotas += quantidadeTotalCotas;
        cotasCompradas += quantidadeCotasCompradas;

        return {
          id: presente.id ?? String(index),
          nome: presente.nome,
          valorArrecadado,
          cotasCompradas: quantidadeCotasCompradas,
          totalCotas: quantidadeTotalCotas,
          progresso,
        };
      });

      const confirmados = registrosRsvp.filter(estaConfirmado).length;
      const recusaram = registrosRsvp.length - confirmados;

      const totalAdultos = registrosRsvp.reduce(
        (total, registro) => total + obterAdultos(registro),
        0
      );

      const totalCriancas = registrosRsvp.reduce(
        (total, registro) => total + obterCriancas(registro),
        0
      );

      setStats({
        totalArrecadado,
        totalPresentes: presentes.length,
        respostasRsvp: registrosRsvp.length,
        confirmados,
        recusaram,
        totalAdultos,
        totalCriancas,
        mensagensAprovadas: resultadoMensagens.count ?? 0,
        totalCotas,
        cotasCompradas,
      });

      setResumoPresentes(
        presentesFormatados
          .filter((presente) => presente.cotasCompradas > 0)
          .sort(
            (primeiro, segundo) =>
              segundo.valorArrecadado - primeiro.valorArrecadado
          )
          .slice(0, 5)
      );
    } catch (error) {
      const mensagem =
        error instanceof Error ? error.message : "Erro desconhecido";

      console.error("Erro ao carregar dados do dashboard:", mensagem);
      setErro(
        "Não foi possível carregar todas as informações do painel. Tente atualizar novamente."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const progressoGeralCotas = useMemo(() => {
    if (stats.totalCotas === 0) return 0;

    return Math.min(
      (stats.cotasCompradas / stats.totalCotas) * 100,
      100
    );
  }, [stats.cotasCompradas, stats.totalCotas]);

  if (loading) {
    return (
      <div className="flex min-h-[520px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#6f8669]" />
          <p className="mt-4 font-serif text-sm italic text-[#607d5b]">
            Carregando informações do painel...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <section className="relative overflow-hidden rounded-[28px] border border-[#ded5c5] bg-[#fffdf9] px-6 py-7 shadow-[0_18px_55px_rgba(70,81,65,0.08)] sm:px-8 sm:py-9">
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#dfe7da]/55 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-[#eadfca]/50 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9b7a38]">
              <Sparkles className="h-3.5 w-3.5" />
              Visão geral
            </span>

            <h1 className="mt-3 font-serif text-3xl text-[#395138] sm:text-4xl">
              Olá, Tayná e Kaique
            </h1>

            <p className="mt-3 max-w-2xl font-serif text-sm italic leading-relaxed text-[#6f796c] sm:text-base">
              Acompanhem os presentes, confirmações e mensagens do casamento
              em um só lugar.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={loadDashboardData}
              className="h-11 rounded-xl border-[#d8cfbf] bg-white px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#52654f] hover:bg-[#f5f7f2]"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>

            <Link
              href="/admin/configuracoes"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#395138] px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_10px_24px_rgba(57,81,56,0.18)] transition-colors hover:bg-[#4e694a]"
            >
              <Settings className="h-4 w-4" />
              Configurações
            </Link>
          </div>
        </div>
      </section>

      {erro && (
        <div className="rounded-2xl border border-[#e2bbbb] bg-[#fff5f5] px-5 py-4 text-sm text-[#7a3636]">
          {erro}
        </div>
      )}

      {/* Métricas */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-[22px] border-[#ded5c5] bg-white shadow-[0_12px_36px_rgba(70,81,65,0.06)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#71806d]">
              Arrecadação
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7eee3] text-[#5f775a]">
              <CircleDollarSign className="h-5 w-5" />
            </div>
          </CardHeader>

          <CardContent>
            <p className="font-serif text-2xl text-[#395138]">
              {formatarMoeda(stats.totalArrecadado)}
            </p>
            <p className="mt-2 text-[10px] text-[#879184]">
              Calculado pelas cotas preenchidas
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[22px] border-[#ded5c5] bg-white shadow-[0_12px_36px_rgba(70,81,65,0.06)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#71806d]">
              Presentes
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3ead7] text-[#9b7a38]">
              <Gift className="h-5 w-5" />
            </div>
          </CardHeader>

          <CardContent>
            <p className="font-serif text-2xl text-[#395138]">
              {stats.totalPresentes}
            </p>
            <p className="mt-2 text-[10px] text-[#879184]">
              {stats.cotasCompradas} de {stats.totalCotas} cotas preenchidas
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[22px] border-[#ded5c5] bg-white shadow-[0_12px_36px_rgba(70,81,65,0.06)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#71806d]">
              Respostas RSVP
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e9eee8] text-[#60745d]">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>

          <CardContent>
            <p className="font-serif text-2xl text-[#395138]">
              {stats.respostasRsvp}
            </p>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px]">
              <span className="inline-flex items-center gap-1 text-emerald-700">
                <UserCheck className="h-3 w-3" />
                {stats.confirmados} vão
              </span>
              <span className="inline-flex items-center gap-1 text-amber-700">
                <UserX className="h-3 w-3" />
                {stats.recusaram} não vão
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[22px] border-[#ded5c5] bg-white shadow-[0_12px_36px_rgba(70,81,65,0.06)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#71806d]">
              Mensagens
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2e7e4] text-[#9a6b65]">
              <MessageSquareHeart className="h-5 w-5" />
            </div>
          </CardHeader>

          <CardContent>
            <p className="font-serif text-2xl text-[#395138]">
              {stats.mensagensAprovadas}
            </p>
            <p className="mt-2 text-[10px] text-[#879184]">
              Recados publicados no mural
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Conteúdo principal */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-[24px] border border-[#ded5c5] bg-white p-6 shadow-[0_14px_42px_rgba(70,81,65,0.06)] sm:p-7">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9b7a38]">
                Presentes
              </span>
              <h2 className="mt-1 font-serif text-2xl text-[#395138]">
                Arrecadação por presente
              </h2>
            </div>

            <Link
              href="/admin/presentes"
              className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#52654f] transition-colors hover:text-[#9b7a38]"
            >
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {resumoPresentes.length === 0 ? (
            <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-[#d8cfbf] bg-[#faf8f3] px-6 text-center">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e5ebe1]">
                  <Gift className="h-6 w-6 text-[#6f8669]" />
                </div>
                <p className="mt-4 font-serif text-base italic text-[#6f796c]">
                  Nenhuma cota foi preenchida ainda.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {resumoPresentes.map((presente) => (
                <div
                  key={presente.id}
                  className="rounded-2xl border border-[#ebe4d9] bg-[#fffdf9] px-4 py-4"
                >
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                    <div>
                      <h3 className="font-serif text-base text-[#395138]">
                        {presente.nome}
                      </h3>
                      <p className="mt-1 text-[10px] text-[#879184]">
                        {presente.cotasCompradas} de {presente.totalCotas} cotas
                      </p>
                    </div>

                    <span className="font-serif text-sm font-semibold text-[#8a6b30]">
                      {formatarMoeda(presente.valorArrecadado)}
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e8ede5]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#91a88a] to-[#b89450] transition-all duration-700"
                      style={{
                        width: `${Math.min(presente.progresso, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Pessoas confirmadas */}
          <div className="rounded-[24px] border border-[#ded5c5] bg-[#395138] p-6 text-white shadow-[0_16px_42px_rgba(57,81,56,0.14)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-[#e3cd98]">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <div>
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#e3cd98]">
                  Presença confirmada
                </span>
                <h3 className="mt-1 font-serif text-xl text-[#f7f3eb]">
                  {stats.totalAdultos + stats.totalCriancas} pessoas
                </h3>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4">
                <span className="text-2xl font-serif">{stats.totalAdultos}</span>
                <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-white/60">
                  Adultos
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4">
                <span className="text-2xl font-serif">{stats.totalCriancas}</span>
                <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-white/60">
                  Crianças
                </p>
              </div>
            </div>

            <Link
              href="/admin/rsvp"
              className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f7f3eb] transition-colors hover:bg-white/10"
            >
              Ver lista RSVP
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Progresso das cotas */}
          <div className="rounded-[24px] border border-[#ded5c5] bg-white p-6 shadow-[0_14px_42px_rgba(70,81,65,0.06)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3ead7] text-[#9b7a38]">
                <TrendingUp className="h-5 w-5" />
              </div>

              <div>
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9b7a38]">
                  Progresso geral
                </span>
                <h3 className="mt-1 font-serif text-xl text-[#395138]">
                  {Math.round(progressoGeralCotas)}% das cotas
                </h3>
              </div>
            </div>

            <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-[#e8ede5]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#91a88a] to-[#b89450]"
                style={{ width: `${progressoGeralCotas}%` }}
              />
            </div>

            <p className="mt-3 text-[10px] leading-relaxed text-[#7e897b]">
              {stats.cotasCompradas} cotas preenchidas de um total de{" "}
              {stats.totalCotas}.
            </p>
          </div>

          {/* Atalho */}
          <div className="rounded-[24px] border border-[#ded5c5] bg-[#fffdf9] p-6 shadow-[0_14px_42px_rgba(70,81,65,0.05)]">
            <Heart className="h-5 w-5 fill-[#b89450] text-[#b89450]" />

            <h3 className="mt-4 font-serif text-xl text-[#395138]">
              Mantenha o site atualizado
            </h3>

            <p className="mt-2 text-xs leading-relaxed text-[#6f796c]">
              Revise fotos, horários e informações importantes antes de
              compartilhar o site com os convidados.
            </p>

            <Link
              href="/admin/configuracoes"
              className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#52654f] transition-colors hover:text-[#9b7a38]"
            >
              Abrir configurações
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
