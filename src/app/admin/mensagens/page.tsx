"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Check, X, Trash2, Clock, Eye, EyeOff } from "lucide-react";

interface Mensagem {
  id: string;
  nome: string;
  mensagem: string;
  aprovado: boolean;
  created_at: string;
}

export default function AdminMensagens() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [loading, setLoading] = useState(true);

  // Busca as mensagens no banco de dados
  const fetchMensagens = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("mensagens")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMensagens(data || []);
    } catch (err: any) {
      console.error("Erro ao carregar mensagens:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMensagens();
  }, []);

  // Altera o status de aprovação da mensagem (Visualizar ou Ocultar no site)
  const handleToggleAprovacao = async (id: string, statusAtual: boolean) => {
    try {
      const { error } = await supabase
        .from("mensagens")
        .update({ aprovado: !statusAtual })
        .eq("id", id);

      if (error) throw error;

      // Atualiza o estado localmente de forma rápida
      setMensagens((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, aprovado: !statusAtual } : msg))
      );
    } catch (err: any) {
      alert("Erro ao atualizar status da mensagem: " + err.message);
    }
  };

  // Exclui uma mensagem permanentemente
  const handleDeleteMensagem = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta mensagem permanentemente?")) return;

    try {
      const { error } = await supabase
        .from("mensagens")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Remove do estado local
      setMensagens((prev) => prev.filter((msg) => msg.id !== id));
    } catch (err: any) {
      alert("Erro ao excluir mensagem: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-sm text-[#607d5b] font-serif italic">
        Carregando mensagens dos convidados...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl pb-12">
      <div>
        <h2 className="font-serif text-2xl text-[#3b5336] flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-[#8fa883]" /> Mural de Mensagens
        </h2>
        <p className="text-xs text-[#607d5b] mt-1">
          Modere as mensagens de carinho enviadas pelos seus convidados. Somente mensagens aprovadas aparecerão na página inicial.
        </p>
      </div>

      {mensagens.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-[#e1e9dc] bg-white">
          <MessageSquare className="h-8 w-8 text-[#a3b899] mx-auto mb-3" />
          <p className="font-serif text-sm text-[#607d5b] italic">Nenhuma mensagem enviada ainda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {mensagens.map((msg) => (
            <Card 
              key={msg.id} 
              className={`rounded-none border transition-colors ${
                msg.aprovado 
                  ? "border-[#e1e9dc] bg-white" 
                  : "border-amber-200 bg-amber-50/40"
              }`}
            >
              <CardContent className="p-6 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                
                {/* Detalhes da Mensagem */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-serif text-base text-[#3b5336] font-semibold">
                      {msg.nome}
                    </h3>
                    <span className="text-[10px] text-[#a3b899] flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(msg.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                    
                    {/* Badge de Status */}
                    <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 border ${
                      msg.aprovado 
                        ? "bg-[#f4f6f3] text-[#3b5336] border-[#e1e9dc]" 
                        : "bg-amber-100/80 text-amber-800 border-amber-200"
                    }`}>
                      {msg.aprovado ? "Aprovada e Visível" : "Pendente de Aprovação"}
                    </span>
                  </div>

                  <p className="text-xs text-[#607d5b] leading-relaxed italic font-serif bg-[#fdfcf9] p-4 border border-[#f4f6f3]">
                    "{msg.mensagem}"
                  </p>
                </div>

                {/* Ações de Moderação */}
                <div className="flex items-center gap-2 md:self-center">
                  <Button
                    onClick={() => handleToggleAprovacao(msg.id, msg.aprovado)}
                    variant="outline"
                    className={`rounded-none px-4 py-5 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 border cursor-pointer transition-colors ${
                      msg.aprovado
                        ? "border-[#a3b899] text-[#607d5b] hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300"
                        : "border-[#3b5336] bg-[#3b5336] text-white hover:bg-[#4e6b48]"
                    }`}
                  >
                    {msg.aprovado ? (
                      <>
                        <EyeOff className="h-4 w-4" /> Ocultar
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" /> Aprovar no Site
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => handleDeleteMensagem(msg.id)}
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-none p-3 h-10 w-10 flex items-center justify-center cursor-pointer transition-colors"
                    title="Excluir Mensagem"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}