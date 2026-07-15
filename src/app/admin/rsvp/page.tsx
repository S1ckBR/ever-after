"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, UserX, Trash2, Search, Phone, Mail } from "lucide-react";
import AuthGuard from "@/components/admin/AuthGuard"; // Importando o protetor

interface Presenca {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  confirmado: boolean;
  acompanhantes: number;
  criancas: number;
  created_at: string;
}

export default function AdminRSVP() {
  const [presencas, setPresencas] = useState<Presenca[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "confirmados" | "ausentes">("todos");

  const fetchPresencas = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("rsvp") 
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPresencas(data || []);
    } catch (err: any) {
      console.error("Erro ao carregar lista de presença:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPresencas();
  }, []);

  const handleDeletePresenca = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta confirmação da lista?")) return;

    try {
      const { error } = await supabase
        .from("rsvp")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setPresencas((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert("Erro ao excluir presença: " + err.message);
    }
  };

  const totalConfirmados = presencas.filter((p) => p.confirmado).length;
  const totalAusentes = presencas.filter((p) => !p.confirmado).length;
  
  const totalAdultosCompanhia = presencas
    .filter((p) => p.confirmado)
    .reduce((acc, p) => acc + 1 + (Number(p.acompanhantes) || 0), 0);

  const totalCriancas = presencas
    .filter((p) => p.confirmado)
    .reduce((acc, p) => acc + (Number(p.criancas) || 0), 0);

  // CORREÇÃO APLICADA AQUI: (p.nome || "") garante que não quebre se o nome for null/undefined
  const presencasFiltradas = presencas.filter((p) => {
    const atendeBusca = (p.nome || "").toLowerCase().includes(busca.toLowerCase());
    
    if (filtro === "confirmados") return atendeBusca && p.confirmado;
    if (filtro === "ausentes") return atendeBusca && !p.confirmado;
    return atendeBusca;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-sm text-[#607d5b] font-serif italic">
        Carregando lista de presença (RSVP)...
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="space-y-8 max-w-6xl pb-12">
        <div>
          <h2 className="font-serif text-2xl text-[#3b5336] flex items-center gap-2">
            <Users className="h-6 w-6 text-[#8fa883]" /> Confirmações de Presença (RSVP)
          </h2>
          <p className="text-xs text-[#607d5b] mt-1">
            Acompanhe quem confirmou presença ou ausência no casamento.
          </p>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="rounded-none border-[#e1e9dc] bg-white shadow-xs">
            <CardHeader className="pb-2">
              <span className="text-[10px] uppercase tracking-wider text-[#a3b899]">Total de Cadastros</span>
              <CardTitle className="font-serif text-2xl text-[#3b5336]">{presencas.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="rounded-none border-[#e1e9dc] bg-white shadow-xs">
            <CardHeader className="pb-2">
              <span className="text-[10px] uppercase tracking-wider text-emerald-600">Irão Comparecer</span>
              <CardTitle className="font-serif text-2xl text-emerald-700">{totalConfirmados}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="rounded-none border-[#e1e9dc] bg-white shadow-xs">
            <CardHeader className="pb-2">
              <span className="text-[10px] uppercase tracking-wider text-amber-600">Não Irão Comparecer</span>
              <CardTitle className="font-serif text-2xl text-amber-700">{totalAusentes}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="rounded-none border-[#e1e9dc] bg-white shadow-xs">
            <CardHeader className="pb-2">
              <span className="text-[10px] uppercase tracking-wider text-[#3b5336]">Pessoas Confirmadas</span>
              <CardTitle className="font-serif text-xl text-[#3b5336] flex flex-col">
                <span>{totalAdultosCompanhia} Adultos</span>
                <span className="text-xs text-[#607d5b] font-normal font-sans mt-0.5">{totalCriancas} Crianças</span>
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Barra de Filtros e Busca */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a3b899]" />
            <input
              type="text"
              placeholder="Buscar convidado pelo nome..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full text-xs border border-[#e1e9dc] pl-10 pr-4 py-3 bg-white rounded-none focus:outline-none focus:border-[#3b5336]"
            />
          </div>
          <div className="flex items-center gap-1 bg-[#f4f6f3] p-1 border border-[#e1e9dc] self-start md:self-auto">
            <button onClick={() => setFiltro("todos")} className={`px-4 py-2 text-[10px] uppercase tracking-wider font-semibold cursor-pointer ${filtro === "todos" ? "bg-white text-[#3b5336]" : "text-[#607d5b]"}`}>Todos</button>
            <button onClick={() => setFiltro("confirmados")} className={`px-4 py-2 text-[10px] uppercase tracking-wider font-semibold cursor-pointer ${filtro === "confirmados" ? "bg-white text-emerald-700" : "text-[#607d5b]"}`}>Vão</button>
            <button onClick={() => setFiltro("ausentes")} className={`px-4 py-2 text-[10px] uppercase tracking-wider font-semibold cursor-pointer ${filtro === "ausentes" ? "bg-white text-amber-700" : "text-[#607d5b]"}`}>Não Vão</button>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white border border-[#e1e9dc] overflow-x-auto rounded-none">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e1e9dc] bg-[#fdfcf9] text-[10px] uppercase tracking-wider text-[#607d5b] font-semibold">
                <th className="p-4">Convidado</th>
                <th className="p-4">Presença</th>
                <th className="p-4 text-center">Acompanhantes</th>
                <th className="p-4 text-center">Crianças</th>
                <th className="p-4">Contato</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f6f3]">
              {presencasFiltradas.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 font-serif text-sm text-[#607d5b] italic">Nenhum registro encontrado.</td></tr>
              ) : (
                presencasFiltradas.map((convidado) => (
                  <tr key={convidado.id} className="hover:bg-[#fbfcfb] transition-colors text-xs text-[#3b5336]">
                    <td className="p-4 font-serif font-semibold text-sm">{convidado.nome}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] uppercase tracking-wider font-bold border ${convidado.confirmado ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                        {convidado.confirmado ? <><UserCheck className="h-3.5 w-3.5" /> Confirmado</> : <><UserX className="h-3.5 w-3.5" /> Ausente</>}
                      </span>
                    </td>
                    <td className="p-4 text-center text-sm font-medium">{convidado.confirmado ? convidado.acompanhantes : "-"}</td>
                    <td className="p-4 text-center text-sm font-medium">{convidado.confirmado ? convidado.criancas : "-"}</td>
                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-[#607d5b]"><Mail className="h-3.5 w-3.5 text-[#a3b899]" /> {convidado.email}</div>
                      <div className="flex items-center gap-1.5 text-xs text-[#607d5b]"><Phone className="h-3.5 w-3.5 text-[#a3b899]" /> {convidado.telefone}</div>
                    </td>
                    <td className="p-4 text-center">
                      <Button onClick={() => handleDeletePresenca(convidado.id)} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 rounded-none p-2 h-8 w-8 flex items-center justify-center mx-auto" title="Excluir"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AuthGuard>
  );
}