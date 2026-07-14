"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Users, MessageSquareText, Phone, MapPin, UserCheck } from "lucide-react";

export default function AdminMensagens() {
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: rsvpData } = await supabase
        .from("rsvp")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: msgData } = await supabase
        .from("mensagens")
        .select("*")
        .order("created_at", { ascending: false });

      setRsvps(rsvpData || []);
      setMensagens(msgData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteMensagem = async (id: string) => {
    if (!confirm("Deseja excluir esta mensagem permanentemente?")) return;
    try {
      const { error } = await supabase.from("mensagens").delete().eq("id", id);
      if (error) throw error;
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRsvp = async (id: string) => {
    if (!confirm("Deseja excluir esta confirmação permanentemente?")) return;
    try {
      const { error } = await supabase.from("rsvp").delete().eq("id", id);
      if (error) throw error;
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const formatarOpcaoComparecimento = (opcao: string) => {
    switch (opcao) {
      case "cerimonia_e_jantar":
        return "Cerimônia & Jantar";
      case "apenas_cerimonia":
        return "Apenas Cerimônia";
      case "apenas_jantar":
        return "Apenas Jantar";
      default:
        return "Não informado";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-sm text-[#607d5b] font-serif italic">
        Carregando mensagens e lista de RSVP...
      </div>
    );
  }

  const adultos = rsvps.reduce((acc, curr) => acc + (curr.status === 'confirmado' ? curr.quantidade_adultos : 0), 0);
  const criancas = rsvps.reduce((acc, curr) => acc + (curr.status === 'confirmado' ? curr.quantidade_criancas : 0), 0);
  const recusados = rsvps.filter(r => r.status === 'recusado').length;

  return (
    <div className="space-y-8 max-w-6xl pb-12">
      <div>
        <h2 className="font-serif text-2xl text-[#3b5336]">Mensagens & Lista de Presença</h2>
        <p className="text-xs text-[#607d5b] mt-1">Acompanhe quem confirmou presença, os locais selecionados, acompanhantes e modere as mensagens.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* RSVP (Esquerda) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-none border-[#e1e9dc] bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-[#f4f6f3]">
              <CardTitle className="font-serif text-base font-medium text-[#3b5336] flex items-center gap-2">
                <Users className="h-5 w-5 text-[#8fa883]" /> Lista de Convidados Confirmados
              </CardTitle>
              <div className="text-xs text-[#607d5b]">
                <span className="font-semibold text-[#3b5336]">{adultos}</span> adultos | <span className="font-semibold text-[#3b5336]">{criancas}</span> crianças | <span className="text-red-500">{recusados}</span> ausentes
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {rsvps.length === 0 ? (
                <p className="text-sm text-[#607d5b] italic font-serif text-center p-8">Nenhuma confirmação ainda.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-[#607d5b]">
                    <thead className="text-xs uppercase tracking-wider bg-[#f4f6f3] text-[#3b5336]">
                      <tr>
                        <th className="p-4">Convidado Principal / Acompanhantes</th>
                        <th className="p-4">Telefone</th>
                        <th className="p-4">Local Presença</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f4f6f3]">
                      {rsvps.map((r) => (
                        <tr key={r.id} className="hover:bg-[#fbfcfb] align-top">
                          {/* Coluna Nome e Acompanhantes */}
                          <td className="p-4">
                            <div className="font-medium text-[#3b5336]">{r.nome_completo}</div>
                            {r.nomes_acompanhantes && (
                              <div className="text-xs text-[#607d5b] mt-1.5 bg-[#f4f6f3] p-2 border-l-2 border-[#8fa883] flex items-start gap-1.5">
                                <UserCheck className="h-3 w-3 text-[#3b5336] shrink-0 mt-0.5" />
                                <span><strong>Acompanhantes:</strong> {r.nomes_acompanhantes}</span>
                              </div>
                            )}
                          </td>
                          <td className="p-4 flex items-center gap-1.5 text-xs whitespace-nowrap"><Phone className="h-3.5 w-3.5 shrink-0" /> {r.telefone}</td>
                          <td className="p-4 text-xs font-medium text-[#3b5336]">
                            {r.status === "confirmado" ? (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-[#a3b899] shrink-0" />
                                {formatarOpcaoComparecimento(r.opcao_comparecimento)}
                              </div>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="p-4">
                            {r.status === "confirmado" ? (
                              <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap block text-center">
                                {r.quantidade_adultos + r.quantidade_criancas} confirmados
                              </span>
                            ) : (
                              <span className="bg-red-50 text-red-700 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap block text-center">
                                Recusado
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <Button
                              onClick={() => handleDeleteRsvp(r.id)}
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-none h-8 p-2 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Mural de Mensagens (Direita) */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="rounded-none border-[#e1e9dc] bg-white shadow-sm">
            <CardHeader className="border-b border-[#f4f6f3] pb-4">
              <CardTitle className="font-serif text-base font-medium text-[#3b5336] flex items-center gap-2">
                <MessageSquareText className="h-5 w-5 text-[#8fa883]" /> Mensagens Recebidas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
              {mensagens.length === 0 ? (
                <p className="text-sm text-[#607d5b] italic font-serif text-center py-6">Nenhum recado de carinho ainda.</p>
              ) : (
                mensagens.map((m) => (
                  <div key={m.id} className="border border-[#e1e9dc] p-4 bg-[#fbfcfb] space-y-3 relative group">
                    <p className="text-xs text-[#607d5b] italic font-serif leading-relaxed">
                      "{m.mensagem}"
                    </p>
                    <div className="flex justify-between items-center border-t border-[#f4f6f3] pt-2">
                      <span className="text-xs font-serif font-bold text-[#3b5336]">— {m.autor}</span>
                      <Button
                        onClick={() => handleDeleteMensagem(m.id)}
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-none h-7 w-7 p-0 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}