import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Gift, Check, ArrowRight } from "lucide-react";

export const revalidate = 0; // Evita cache no painel

async function getAdminDashboardData() {
  // 1. Busca todos os presentes para somar o arrecadado com base nas cotas compradas
  const { data: presentes } = await supabase.from("presentes").select("*");
  
  // 2. Busca todos os RSVPs
  const { data: rsvp } = await supabase.from("rsvp").select("*");

  const totalPresentes = presentes?.length || 0;
  
  // Calcula o valor arrecadado real com base nas cotas compradas
  let totalArrecadado = 0;
  presentes?.forEach((p) => {
    const valorCota = Number(p.valor_total) / p.total_cotas;
    totalArrecadado += valorCota * p.cotas_compradas;
  });

  // Estatísticas de RSVP
  const convidadosTotal = rsvp?.reduce((acc, curr) => acc + curr.quantidade_adultos + curr.quantidade_criancas, 0) || 0;
  const confirmados = rsvp?.filter(r => r.status === "confirmado").length || 0;
  const pendentes = rsvp?.filter(r => r.status === "pendente").length || 0;
  const recusados = rsvp?.filter(r => r.status === "recusado").length || 0;

  return {
    totalArrecadado,
    totalPresentes,
    convidadosTotal,
    rsvpStats: { confirmados, pendentes, recusados },
  };
}

export default async function AdminDashboard() {
  const data = await getAdminDashboardData();

  // Simulação de últimos presentes (Mock temporário para visualização)
  const ultimosPresentes = [
    { id: 1, doador: "João Silva", item: "Lua de Mel", valor: 150, status: "Pago" },
    { id: 2, doador: "Maria Oliveira", item: "Jantar Romântico", valor: 60, status: "Pago" },
    { id: 3, doador: "Pedro Souza", item: "Aluguel de Carro", valor: 100, status: "Pago" },
  ];

  return (
    <div className="space-y-8">
      {/* Grid de Estatísticas */}
      <div className="grid gap-6 md:grid-cols-4">
        {/* Total Arrecadado */}
        <Card className="rounded-none border-[#e1e9dc] bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs uppercase tracking-widest text-[#607d5b]">Total Arrecadado</CardTitle>
            <DollarSign className="h-4 w-4 text-[#8fa883]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-serif font-light text-[#3b5336]">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(data.totalArrecadado)}
            </div>
          </CardContent>
        </Card>

        {/* Total Presentes */}
        <Card className="rounded-none border-[#e1e9dc] bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs uppercase tracking-widest text-[#607d5b]">Presentes Criados</CardTitle>
            <Gift className="h-4 w-4 text-[#8fa883]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-serif font-light text-[#3b5336]">{data.totalPresentes}</div>
          </CardContent>
        </Card>

        {/* Convidados Totais */}
        <Card className="rounded-none border-[#e1e9dc] bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs uppercase tracking-widest text-[#607d5b]">Total Convidados</CardTitle>
            <Check className="h-4 w-4 text-[#8fa883]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-serif font-light text-[#3b5336]">{data.convidadosTotal}</div>
          </CardContent>
        </Card>

        {/* RSVP Resumo */}
        <Card className="rounded-none border-[#e1e9dc] bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs uppercase tracking-widest text-[#607d5b]">Status RSVP</CardTitle>
            <Check className="h-4 w-4 text-[#8fa883]" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-[#3b5336] font-semibold">{data.rsvpStats.confirmados} Confirmados</span>
              <span className="text-orange-500">{data.rsvpStats.pendentes} Pendentes</span>
              <span className="text-red-500">{data.rsvpStats.recusados} Recusaram</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção Inferior: Últimas Atividades */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 bg-white border border-[#e1e9dc] p-6 shadow-sm">
          <h2 className="font-serif text-lg text-[#3b5336] mb-4">Últimos Presentes Recebidos</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#607d5b]">
              <thead className="text-xs uppercase tracking-wider bg-[#f4f6f3] text-[#3b5336] border-b border-[#e1e9dc]">
                <tr>
                  <th className="p-3">Convidado</th>
                  <th className="p-3">Presente</th>
                  <th className="p-3">Valor</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4f6f3]">
                {ultimosPresentes.map((p) => (
                  <tr key={p.id} className="hover:bg-[#fbfcfb]">
                    <td className="p-3 font-medium text-[#3b5336]">{p.doador}</td>
                    <td className="p-3">{p.item}</td>
                    <td className="p-3">R$ {p.valor.toFixed(2)}</td>
                    <td className="p-3">
                      <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-[#e1e9dc] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-serif text-lg text-[#3b5336] mb-2">Dica de Administrador</h2>
            <p className="text-xs text-[#607d5b] leading-relaxed">
              Você pode alterar todos os locais, horários, presentes, fotos e configurações nas abas laterais. Todas as alterações feitas são salvas de forma segura no Supabase e refletidas instantaneamente no site público dos noivos!
            </p>
          </div>
          <Link 
            href="/admin/configuracoes" 
            className="mt-6 flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#3b5336] bg-[#f4f6f3] py-4 hover:bg-[#e2ebd9] transition-colors"
          >
            Ir para Configurações <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}