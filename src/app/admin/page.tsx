"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  Gift, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalArrecadado: number;
  totalPresentes: number;
  totalConvidados: number;
  confirmados: number;
  recusaram: number;
}

interface UltimosPresentes {
  id: string;
  convidado: string;
  presente: string;
  valor: number;
  status: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalArrecadado: 0,
    totalPresentes: 0,
    totalConvidados: 0,
    confirmados: 0,
    recusaram: 0,
  });
  const [ultimosPresentes, setUltimosPresentes] = useState<UltimosPresentes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);

        // 1. Busca os presentes para calcular arrecadação e contagem
        const { data: presentes, error: errorPresentes } = await supabase
          .from("presentes")
          .select("valor_total, total_cotas, cotas_compradas, nome");

        if (errorPresentes) throw errorPresentes;

        let totalArrecadado = 0;
        let totalPresentes = presentes?.length || 0;

        presentes?.forEach((p) => {
          const valorCota = Number(p.valor_total) / p.total_cotas;
          totalArrecadado += valorCota * p.cotas_compradas;
        });

        // 2. Busca dados de RSVP de forma segura (tenta ler 'presenca' ou 'rsvp')
        let rsvpData: any[] = [];
        
        const { data: tentatitval1, error: errorL1 } = await supabase
          .from("rsvp")
          .select("confirmado, acompanhantes");
        
        if (!errorL1 && tentatitval1) {
          rsvpData = tentatitval1;
        } else {
          // Se falhou na tabela "presenca", tenta na tabela "rsvp"
          const { data: tentativa2, error: errorL2 } = await supabase
            .from("rsvp")
            .select("confirmado, acompanhantes");
          
          if (!errorL2 && tentativa2) {
            rsvpData = tentativa2;
          }
        }

        const totalConvidados = rsvpData.length;
        const confirmados = rsvpData.filter((p) => p.confirmado).length;
        const recusaram = rsvpData.filter((p) => !p.confirmado).length;

        setStats({
          totalArrecadado,
          totalPresentes,
          totalConvidados,
          confirmados,
          recusaram,
        });

        // 3. Monta últimos presentes recebidos
        const presentesComCotas = presentes?.filter(p => p.cotas_compradas > 0) || [];
        const formatados: UltimosPresentes[] = presentesComCotas.map((p, index) => {
          const valorCota = Number(p.valor_total) / p.total_cotas;
          return {
            id: String(index),
            convidado: "Convidado Confirmado",
            presente: p.nome,
            valor: valorCota * p.cotas_compradas,
            status: "Pago"
          };
        });
        setUltimosPresentes(formatados.slice(0, 5));

      } catch (err: any) {
        console.error("Erro ao carregar dados do Dashboard:", err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-sm text-[#607d5b] font-serif italic">
        Carregando informações do painel...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-[#3b5336]">Visão Geral do Evento</h2>
        <p className="text-xs text-[#607d5b] mt-1">Acompanhe as estatísticas financeiras e de presença em tempo real.</p>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Arrecadado */}
        <Card className="rounded-none border-[#e1e9dc] bg-white shadow-xs">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-[#607d5b] font-semibold">Total Arrecadado</span>
            <DollarSign className="h-4 w-4 text-[#8fa883]" />
          </CardHeader>
          <CardContent>
            <CardTitle className="font-serif text-2xl text-[#3b5336]">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stats.totalArrecadado)}
            </CardTitle>
          </CardContent>
        </Card>

        {/* Presentes Criados */}
        <Card className="rounded-none border-[#e1e9dc] bg-white shadow-xs">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-[#607d5b] font-semibold">Presentes Criados</span>
            <Gift className="h-4 w-4 text-[#8fa883]" />
          </CardHeader>
          <CardContent>
            <CardTitle className="font-serif text-2xl text-[#3b5336]">{stats.totalPresentes}</CardTitle>
          </CardContent>
        </Card>

        {/* Total de Convidados */}
        <Card className="rounded-none border-[#e1e9dc] bg-white shadow-xs">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-[#607d5b] font-semibold">Respostas RSVP</span>
            <Users className="h-4 w-4 text-[#8fa883]" />
          </CardHeader>
          <CardContent>
            <CardTitle className="font-serif text-2xl text-[#3b5336]">{stats.totalConvidados}</CardTitle>
          </CardContent>
        </Card>

        {/* Status RSVP */}
        <Card className="rounded-none border-[#e1e9dc] bg-white shadow-xs">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-[#607d5b] font-semibold">Status RSVP</span>
            <CheckCircle2 className="h-4 w-4 text-[#8fa883]" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-emerald-700 font-bold">{stats.confirmados} Confirmados</span>
              <span className="text-amber-700 font-bold">{stats.recusaram} Recusaram</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Últimos Presentes Recebidos */}
        <div className="lg:col-span-2 bg-white border border-[#e1e9dc] p-6 space-y-4">
          <h3 className="font-serif text-base text-[#3b5336]">Últimos Presentes Recebidos</h3>
          
          {ultimosPresentes.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#607d5b] italic font-serif">
              Nenhum presente recebido ainda.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#e1e9dc] text-[#607d5b] uppercase font-semibold">
                    <th className="pb-3">Presente</th>
                    <th className="pb-3 text-right">Valor Arrecadado</th>
                    <th className="pb-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4f6f3]">
                  {ultimosPresentes.map((p) => (
                    <tr key={p.id} className="text-[#3b5336]">
                      <td className="py-3 font-serif font-medium">{p.presente}</td>
                      <td className="py-3 text-right">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(p.valor)}
                      </td>
                      <td className="py-3 text-center">
                        <span className="px-2 py-0.5 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-none uppercase font-bold">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Card Informativo / Dicas */}
        <div className="bg-white border border-[#e1e9dc] p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-serif text-base text-[#3b5336] flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#8fa883]" /> Dica de Administrador
            </h3>
            <p className="text-xs text-[#607d5b] leading-relaxed">
              Você pode alterar todos os locais, horários, presentes, fotos e configurações nas abas laterais. Todas as alterações feitas são salvas de forma segura no Supabase e refletidas instantaneamente no site público de vocês!
            </p>
          </div>

          <Link
            href="/admin/configuracoes"
            className="w-full text-center text-xs tracking-widest uppercase font-semibold text-[#3b5336] hover:text-[#4e6b48] py-3 mt-6 border border-[#e1e9dc] hover:bg-[#fafbfa] transition-colors flex items-center justify-center gap-2"
          >
            Ir para Configurações <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}