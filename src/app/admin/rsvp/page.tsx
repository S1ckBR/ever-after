"use client";

<<<<<<< HEAD
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
=======
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  Search,
  Trash2,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import AuthGuard from "@/components/admin/AuthGuard";

interface Presenca {
  id: string;

  // Campos atuais da tabela/formulário
  nome_completo?: string | null;
  telefone?: string | null;
  status?: "confirmado" | "recusado" | string | null;
  quantidade_adultos?: number | null;
  quantidade_criancas?: number | null;
  nomes_acompanhantes?: string | null;
  opcao_comparecimento?: string | null;

  // Campos antigos, mantidos apenas para compatibilidade
  nome?: string | null;
  email?: string | null;
  confirmado?: boolean | null;
  acompanhantes?: number | null;
  criancas?: number | null;

>>>>>>> 32afcd0 (Corrige exibicao dos dados RSVP no painel)
  created_at: string;
}

export default function AdminRSVP() {
  const [presencas, setPresencas] = useState<Presenca[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
<<<<<<< HEAD
  const [filtro, setFiltro] = useState<"todos" | "confirmados" | "ausentes">("todos");

  const fetchPresencas = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("rsvp") 
=======
  const [filtro, setFiltro] = useState<
    "todos" | "confirmados" | "ausentes"
  >("todos");

  const fetchPresencas = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("rsvp")
>>>>>>> 32afcd0 (Corrige exibicao dos dados RSVP no painel)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
<<<<<<< HEAD
      setPresencas(data || []);
    } catch (err: any) {
      console.error("Erro ao carregar lista de presença:", err.message);
=======

      setPresencas((data as Presenca[]) || []);
    } catch (error) {
      const mensagem =
        error instanceof Error ? error.message : "Erro desconhecido";
      console.error("Erro ao carregar lista de presença:", mensagem);
>>>>>>> 32afcd0 (Corrige exibicao dos dados RSVP no painel)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPresencas();
  }, []);

  const handleDeletePresenca = async (id: string) => {
<<<<<<< HEAD
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
=======
    if (
      !confirm("Tem certeza que deseja excluir esta confirmação da lista?")
    ) {
      return;
    }

    try {
      const { error } = await supabase.from("rsvp").delete().eq("id", id);

      if (error) throw error;

      setPresencas((prev) => prev.filter((presenca) => presenca.id !== id));
    } catch (error) {
      const mensagem =
        error instanceof Error ? error.message : "Erro desconhecido";
      alert(`Erro ao excluir presença: ${mensagem}`);
    }
  };

  const obterNome = (presenca: Presenca) =>
    presenca.nome_completo?.trim() ||
    presenca.nome?.trim() ||
    "Nome não informado";

  const estaConfirmado = (presenca: Presenca) => {
    if (typeof presenca.confirmado === "boolean") {
      return presenca.confirmado;
    }

    return presenca.status === "confirmado";
  };

  const obterQuantidadeAdultos = (presenca: Presenca) => {
    if (!estaConfirmado(presenca)) return 0;

    if (presenca.quantidade_adultos != null) {
      return Number(presenca.quantidade_adultos) || 0;
    }

    return 1 + (Number(presenca.acompanhantes) || 0);
  };

  const obterQuantidadeCriancas = (presenca: Presenca) => {
    if (!estaConfirmado(presenca)) return 0;

    return (
      Number(
        presenca.quantidade_criancas ?? presenca.criancas ?? 0
      ) || 0
    );
  };

  const obterQuantidadeAcompanhantes = (presenca: Presenca) => {
    if (!estaConfirmado(presenca)) return 0;

    if (presenca.quantidade_adultos != null) {
      return Math.max(Number(presenca.quantidade_adultos) - 1, 0);
    }

    return Number(presenca.acompanhantes) || 0;
  };

  const totalConfirmados = useMemo(
    () => presencas.filter(estaConfirmado).length,
    [presencas]
  );

  const totalAusentes = presencas.length - totalConfirmados;

  const totalAdultos = useMemo(
    () =>
      presencas.reduce(
        (total, presenca) => total + obterQuantidadeAdultos(presenca),
        0
      ),
    [presencas]
  );

  const totalCriancas = useMemo(
    () =>
      presencas.reduce(
        (total, presenca) => total + obterQuantidadeCriancas(presenca),
        0
      ),
    [presencas]
  );

  const presencasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return presencas.filter((presenca) => {
      const confirmado = estaConfirmado(presenca);
      const atendeBusca = obterNome(presenca)
        .toLowerCase()
        .includes(termo);

      if (filtro === "confirmados") {
        return atendeBusca && confirmado;
      }

      if (filtro === "ausentes") {
        return atendeBusca && !confirmado;
      }

      return atendeBusca;
    });
  }, [presencas, busca, filtro]);

  const formatarOpcaoComparecimento = (opcao?: string | null) => {
    switch (opcao) {
      case "cerimonia_e_jantar":
        return "Cerimônia e jantar";
      case "apenas_cerimonia":
        return "Apenas cerimônia";
      case "apenas_jantar":
        return "Apenas jantar";
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center font-serif text-sm italic text-[#607d5b]">
>>>>>>> 32afcd0 (Corrige exibicao dos dados RSVP no painel)
        Carregando lista de presença (RSVP)...
      </div>
    );
  }

  return (
    <AuthGuard>
<<<<<<< HEAD
      <div className="space-y-8 max-w-6xl pb-12">
        <div>
          <h2 className="font-serif text-2xl text-[#3b5336] flex items-center gap-2">
            <Users className="h-6 w-6 text-[#8fa883]" /> Confirmações de Presença (RSVP)
          </h2>
          <p className="text-xs text-[#607d5b] mt-1">
=======
      <div className="max-w-6xl space-y-8 pb-12">
        <div>
          <h2 className="flex items-center gap-2 font-serif text-2xl text-[#3b5336]">
            <Users className="h-6 w-6 text-[#8fa883]" />
            Confirmações de Presença (RSVP)
          </h2>
          <p className="mt-1 text-xs text-[#607d5b]">
>>>>>>> 32afcd0 (Corrige exibicao dos dados RSVP no painel)
            Acompanhe quem confirmou presença ou ausência no casamento.
          </p>
        </div>

<<<<<<< HEAD
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
=======
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-none border-[#e1e9dc] bg-white shadow-xs">
            <CardHeader className="pb-2">
              <span className="text-[10px] uppercase tracking-wider text-[#a3b899]">
                Total de cadastros
              </span>
              <CardTitle className="font-serif text-2xl text-[#3b5336]">
                {presencas.length}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="rounded-none border-[#e1e9dc] bg-white shadow-xs">
            <CardHeader className="pb-2">
              <span className="text-[10px] uppercase tracking-wider text-emerald-600">
                Irão comparecer
              </span>
              <CardTitle className="font-serif text-2xl text-emerald-700">
                {totalConfirmados}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="rounded-none border-[#e1e9dc] bg-white shadow-xs">
            <CardHeader className="pb-2">
              <span className="text-[10px] uppercase tracking-wider text-amber-600">
                Não irão comparecer
              </span>
              <CardTitle className="font-serif text-2xl text-amber-700">
                {totalAusentes}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="rounded-none border-[#e1e9dc] bg-white shadow-xs">
            <CardHeader className="pb-2">
              <span className="text-[10px] uppercase tracking-wider text-[#3b5336]">
                Pessoas confirmadas
              </span>
              <CardTitle className="flex flex-col font-serif text-xl text-[#3b5336]">
                <span>{totalAdultos} Adultos</span>
                <span className="mt-0.5 font-sans text-xs font-normal text-[#607d5b]">
                  {totalCriancas} Crianças
                </span>
>>>>>>> 32afcd0 (Corrige exibicao dos dados RSVP no painel)
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

<<<<<<< HEAD
        {/* Barra de Filtros e Busca */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a3b899]" />
=======
        <div className="flex flex-col items-stretch justify-between gap-4 md:flex-row md:items-center">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a3b899]" />
>>>>>>> 32afcd0 (Corrige exibicao dos dados RSVP no painel)
            <input
              type="text"
              placeholder="Buscar convidado pelo nome..."
              value={busca}
<<<<<<< HEAD
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
=======
              onChange={(event) => setBusca(event.target.value)}
              className="w-full rounded-none border border-[#e1e9dc] bg-white py-3 pl-10 pr-4 text-xs focus:border-[#3b5336] focus:outline-none"
            />
          </div>

          <div className="flex self-start border border-[#e1e9dc] bg-[#f4f6f3] p-1 md:self-auto">
            {[
              ["todos", "Todos"],
              ["confirmados", "Vão"],
              ["ausentes", "Não vão"],
            ].map(([valor, rotulo]) => (
              <button
                key={valor}
                type="button"
                onClick={() =>
                  setFiltro(
                    valor as "todos" | "confirmados" | "ausentes"
                  )
                }
                className={`cursor-pointer px-4 py-2 text-[10px] font-semibold uppercase tracking-wider ${
                  filtro === valor
                    ? "bg-white text-[#3b5336]"
                    : "text-[#607d5b]"
                }`}
              >
                {rotulo}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-none border border-[#e1e9dc] bg-white">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#e1e9dc] bg-[#fdfcf9] text-[10px] font-semibold uppercase tracking-wider text-[#607d5b]">
                <th className="p-4">Convidado</th>
                <th className="p-4">Presença</th>
                <th className="p-4 text-center">Adultos</th>
                <th className="p-4 text-center">Crianças</th>
                <th className="p-4">Acompanhantes</th>
>>>>>>> 32afcd0 (Corrige exibicao dos dados RSVP no painel)
                <th className="p-4">Contato</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
<<<<<<< HEAD
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
=======

            <tbody className="divide-y divide-[#f4f6f3]">
              {presencasFiltradas.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center font-serif text-sm italic text-[#607d5b]"
                  >
                    Nenhum registro encontrado.
                  </td>
                </tr>
              ) : (
                presencasFiltradas.map((convidado) => {
                  const confirmado = estaConfirmado(convidado);
                  const nome = obterNome(convidado);
                  const quantidadeAdultos =
                    obterQuantidadeAdultos(convidado);
                  const quantidadeCriancas =
                    obterQuantidadeCriancas(convidado);
                  const quantidadeAcompanhantes =
                    obterQuantidadeAcompanhantes(convidado);
                  const opcao = formatarOpcaoComparecimento(
                    convidado.opcao_comparecimento
                  );

                  return (
                    <tr
                      key={convidado.id}
                      className="text-xs text-[#3b5336] transition-colors hover:bg-[#fbfcfb]"
                    >
                      <td className="p-4">
                        <div className="font-serif text-sm font-semibold">
                          {nome}
                        </div>
                        {opcao && confirmado && (
                          <div className="mt-1 text-[10px] text-[#7a8576]">
                            {opcao}
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
                            confirmado
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-amber-200 bg-amber-50 text-amber-700"
                          }`}
                        >
                          {confirmado ? (
                            <>
                              <UserCheck className="h-3.5 w-3.5" />
                              Confirmado
                            </>
                          ) : (
                            <>
                              <UserX className="h-3.5 w-3.5" />
                              Ausente
                            </>
                          )}
                        </span>
                      </td>

                      <td className="p-4 text-center text-sm font-medium">
                        {confirmado ? quantidadeAdultos : "-"}
                      </td>

                      <td className="p-4 text-center text-sm font-medium">
                        {confirmado ? quantidadeCriancas : "-"}
                      </td>

                      <td className="p-4">
                        {confirmado ? (
                          <>
                            <div className="text-sm font-medium">
                              {quantidadeAcompanhantes}
                            </div>
                            {convidado.nomes_acompanhantes && (
                              <div className="mt-1 max-w-[220px] text-[10px] leading-relaxed text-[#6f7a6c]">
                                {convidado.nomes_acompanhantes}
                              </div>
                            )}
                          </>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td className="p-4 space-y-1">
                        {convidado.email && (
                          <div className="flex items-center gap-1.5 text-xs text-[#607d5b]">
                            <Mail className="h-3.5 w-3.5 text-[#a3b899]" />
                            {convidado.email}
                          </div>
                        )}

                        {convidado.telefone ? (
                          <div className="flex items-center gap-1.5 text-xs text-[#607d5b]">
                            <Phone className="h-3.5 w-3.5 text-[#a3b899]" />
                            {convidado.telefone}
                          </div>
                        ) : (
                          <span className="text-[10px] italic text-[#9aa394]">
                            Sem contato
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-center">
                        <Button
                          type="button"
                          onClick={() =>
                            handleDeletePresenca(convidado.id)
                          }
                          variant="outline"
                          className="mx-auto flex h-8 w-8 items-center justify-center rounded-none border-red-200 p-2 text-red-600 hover:bg-red-50"
                          title="Excluir"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
>>>>>>> 32afcd0 (Corrige exibicao dos dados RSVP no painel)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AuthGuard>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 32afcd0 (Corrige exibicao dos dados RSVP no painel)
