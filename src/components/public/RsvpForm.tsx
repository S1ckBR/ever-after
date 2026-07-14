"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Users, Phone, MapPin, UserPlus } from "lucide-react";

export default function RsvpForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome_completo: "",
    telefone: "",
    quantidade_adultos: 1,
    quantidade_criancas: 0,
    status: "confirmado", // 'confirmado' ou 'recusado'
    opcao_comparecimento: "cerimonia_e_jantar", // 'cerimonia_e_jantar', 'apenas_cerimonia', 'apenas_jantar'
    nomes_acompanhantes: "", // Texto contendo os nomes dos acompanhantes
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Verifica se há acompanhantes de fato com base na quantidade informada
      const totalPessoas = Number(form.quantidade_adultos) + Number(form.quantidade_criancas);
      const precisaNomes = totalPessoas > 1;

      const { error } = await supabase.from("rsvp").insert({
        nome_completo: form.nome_completo,
        telefone: form.telefone,
        quantidade_adultos: Number(form.quantidade_adultos),
        quantidade_criancas: Number(form.quantidade_criancas),
        status: form.status,
        opcao_comparecimento: form.status === "confirmado" ? form.opcao_comparecimento : null,
        nomes_acompanhantes: (form.status === "confirmado" && precisaNomes) ? form.nomes_acompanhantes : null,
      });

      if (error) throw error;

      alert("Presença confirmada com sucesso! Muito obrigado.");
      setForm({
        nome_completo: "",
        telefone: "",
        quantidade_adultos: 1,
        quantidade_criancas: 0,
        status: "confirmado",
        opcao_comparecimento: "cerimonia_e_jantar",
        nomes_acompanhantes: "",
      });
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar confirmação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Verifica se o formulário precisa exibir o campo de nomes de acompanhantes
  const totalConfirmados = Number(form.quantidade_adultos) + Number(form.quantidade_criancas);
  const exibeCampoAcompanhantes = form.status === "confirmado" && totalConfirmados > 1;

  return (
    <section id="rsvp" className="py-20 bg-[#f7f9f5] border-t border-[#e1e9dc]">
      <div className="mx-auto max-w-xl px-4">
        <div className="text-center space-y-3 mb-10">
          <span className="text-[11px] tracking-[0.25em] uppercase text-[#607d5b] block font-semibold">
            R.S.V.P
          </span>
          <h2 className="font-serif text-3xl font-light text-[#3b5336]">
            Confirme sua Presença
          </h2>
          <p className="text-xs text-[#607d5b] font-serif italic">
            Por favor, confirme sua presença até o dia 21 de Outubro de 2026.
          </p>
          <div className="h-[1px] w-16 bg-[#a3b899] mx-auto mt-4" />
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-[#e1e9dc] p-8 shadow-sm space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-[#607d5b]">Nome Completo</label>
            <input
              type="text"
              name="nome_completo"
              value={form.nome_completo}
              onChange={handleChange}
              className="w-full text-sm border border-[#e1e9dc] p-3 rounded-none focus:outline-none focus:border-[#3b5336]"
              placeholder="Digite seu nome e sobrenome"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#607d5b] flex items-center gap-1">
                <Phone className="h-3 w-3" /> Telefone / WhatsApp
              </label>
              <input
                type="tel"
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                className="w-full text-sm border border-[#e1e9dc] p-3 rounded-none focus:outline-none focus:border-[#3b5336]"
                placeholder="(11) 99999-9999"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#607d5b]">Você irá ao evento?</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full text-sm border border-[#e1e9dc] p-3 bg-white rounded-none focus:outline-none focus:border-[#3b5336]"
              >
                <option value="confirmado">Sim, eu irei!</option>
                <option value="recusado">Não poderei ir</option>
              </select>
            </div>
          </div>

          {form.status === "confirmado" && (
            <>
              {/* Onde irá comparecer */}
              <div className="space-y-1.5 pt-2 border-t border-[#f4f6f3]">
                <label className="text-xs uppercase tracking-wider text-[#607d5b] flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-[#a3b899]" /> Onde você comparecerá?
                </label>
                <select
                  name="opcao_comparecimento"
                  value={form.opcao_comparecimento}
                  onChange={handleChange}
                  className="w-full text-sm border border-[#e1e9dc] p-3 bg-white rounded-none focus:outline-none focus:border-[#3b5336]"
                >
                  <option value="cerimonia_e_jantar">Cerimônia & Jantar (Recepção)</option>
                  <option value="apenas_cerimonia">Apenas na Cerimônia</option>
                  <option value="apenas_jantar">Apenas no Jantar (Recepção)</option>
                </select>
              </div>

              {/* Quantidade de Pessoas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-[#607d5b] flex items-center gap-1">
                    <Users className="h-3 w-3" /> Adultos (incluindo você)
                  </label>
                  <input
                    type="number"
                    name="quantidade_adultos"
                    min="1"
                    max="10"
                    value={form.quantidade_adultos}
                    onChange={handleChange}
                    className="w-full text-sm border border-[#e1e9dc] p-3 rounded-none focus:outline-none focus:border-[#3b5336]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-[#607d5b] flex items-center gap-1">
                    <Users className="h-3 w-3" /> Crianças
                  </label>
                  <input
                    type="number"
                    name="quantidade_criancas"
                    min="0"
                    max="10"
                    value={form.quantidade_criancas}
                    onChange={handleChange}
                    className="w-full text-sm border border-[#e1e9dc] p-3 rounded-none focus:outline-none focus:border-[#3b5336]"
                  />
                </div>
              </div>

              {/* Campo Dinâmico: Nome dos Acompanhantes */}
              {exibeCampoAcompanhantes && (
                <div className="space-y-1.5 pt-2 border-t border-[#f4f6f3] transition-all duration-300">
                  <label className="text-xs uppercase tracking-wider text-[#607d5b] flex items-center gap-1.5">
                    <UserPlus className="h-3.5 w-3.5 text-[#a3b899]" /> Nome dos Acompanhantes
                  </label>
                  <textarea
                    name="nomes_acompanhantes"
                    rows={2}
                    value={form.nomes_acompanhantes}
                    onChange={handleChange}
                    placeholder="Digite o nome completo de cada acompanhante separado por vírgula"
                    className="w-full text-sm border border-[#e1e9dc] p-3 rounded-none focus:outline-none focus:border-[#3b5336] resize-none"
                    required
                  />
                  <p className="text-[10px] text-[#607d5b] italic">
                    Como você confirmou para {totalConfirmados} pessoas, digite o nome das outras {totalConfirmados - 1} pessoas.
                  </p>
                </div>
              )}
            </>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3b5336] hover:bg-[#4e6b48] text-[#fdfcf9] rounded-none py-6 text-xs tracking-widest uppercase font-semibold flex items-center justify-center gap-2 cursor-pointer pt-4"
          >
            <CalendarCheck className="h-4 w-4" />
            {loading ? "Processando..." : "Confirmar Presença"}
          </Button>
        </form>
      </div>
    </section>
  );
}