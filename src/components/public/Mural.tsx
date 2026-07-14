"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Send, MessageSquareHeart } from "lucide-react";

export default function Mural() {
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [autor, setAutor] = useState("");
  const [texto, setTexto] = useState("");
  const [sending, setSending] = useState(false);

  const loadMensagens = async () => {
    const { data } = await supabase
      .from("mensagens")
      .select("*")
      .eq("aprovado", true)
      .order("created_at", { ascending: false });
    
    setMensagens(data || []);
  };

  useEffect(() => {
    loadMensagens();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const { error } = await supabase.from("mensagens").insert({
        autor,
        mensagem: texto,
        aprovado: true, // Aprovado por padrão, mas pode ser moderado no admin
      });

      if (error) throw error;

      alert("Mensagem de carinho enviada com sucesso!");
      setAutor("");
      setTexto("");
      loadMensagens();
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar mensagem.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="mensagens" className="py-20 bg-[#fdfcf9] border-t border-[#e1e9dc]">
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <div className="text-center space-y-3 mb-16">
          <span className="text-[11px] tracking-[0.25em] uppercase text-[#607d5b] block font-semibold">
            Mural de Recados
          </span>
          <h2 className="font-serif text-3xl font-light text-[#3b5336]">
            Deixe seus votos de felicidade
          </h2>
          <div className="h-[1px] w-16 bg-[#a3b899] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Formulário de Envio */}
          <div className="md:col-span-1">
            <form onSubmit={handleSubmit} className="bg-white border border-[#e1e9dc] p-6 shadow-sm space-y-4">
              <h3 className="font-serif text-lg text-[#3b5336] flex items-center gap-2">
                <MessageSquareHeart className="h-4 w-4 text-[#8fa883]" /> Escrever Recado
              </h3>
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-[#607d5b]">Seu Nome</label>
                <input
                  type="text"
                  value={autor}
                  onChange={(e) => setAutor(e.target.value)}
                  className="w-full text-sm border border-[#e1e9dc] p-3 rounded-none focus:outline-none focus:border-[#3b5336]"
                  placeholder="Ex: Família Silva"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-[#607d5b]">Mensagem</label>
                <textarea
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  rows={4}
                  className="w-full text-sm border border-[#e1e9dc] p-3 rounded-none focus:outline-none focus:border-[#3b5336] resize-none"
                  placeholder="Deixe sua mensagem de carinho aqui..."
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={sending}
                className="w-full bg-[#3b5336] hover:bg-[#4e6b48] text-[#fdfcf9] rounded-none py-5 text-xs tracking-widest uppercase font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                Enviar Mensagem <Send className="h-3 w-3" />
              </Button>
            </form>
          </div>

          {/* Lista de Mensagens */}
          <div className="md:col-span-2 space-y-4 max-h-[480px] overflow-y-auto pr-2">
            {mensagens.length === 0 ? (
              <div className="text-center p-12 border border-dashed border-[#e1e9dc] bg-white">
                <p className="text-sm text-[#607d5b] font-serif italic">Seja o primeiro a deixar uma mensagem de carinho!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mensagens.map((m) => (
                  <div key={m.id} className="bg-white border border-[#e1e9dc] p-5 shadow-xs flex flex-col justify-between">
                    <p className="text-xs text-[#607d5b] italic font-serif leading-relaxed">
                      "{m.mensagem}"
                    </p>
                    <div className="mt-4 border-t border-[#f4f6f3] pt-2 text-right">
                      <span className="text-xs font-serif font-bold text-[#3b5336]">
                        — {m.autor}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}