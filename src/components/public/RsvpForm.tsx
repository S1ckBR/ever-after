"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  CalendarCheck,
  CheckCircle2,
  Heart,
  MapPin,
  Phone,
  Sparkles,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";

interface RsvpFormProps {
  dataLimiteRsvp?: string;
}

interface RsvpFormState {
  nome_completo: string;
  telefone: string;
  quantidade_adultos: number;
  quantidade_criancas: number;
  status: "confirmado" | "recusado";
  opcao_comparecimento:
    | "cerimonia_e_jantar"
    | "apenas_cerimonia"
    | "apenas_jantar";
  nomes_acompanhantes: string;
}

const estadoInicial: RsvpFormState = {
  nome_completo: "",
  telefone: "",
  quantidade_adultos: 1,
  quantidade_criancas: 0,
  status: "confirmado",
  opcao_comparecimento: "cerimonia_e_jantar",
  nomes_acompanhantes: "",
};

export default function RsvpForm({ dataLimiteRsvp }: RsvpFormProps) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    tipo: "sucesso" | "erro";
    mensagem: string;
  } | null>(null);
  const [form, setForm] = useState<RsvpFormState>(estadoInicial);

  const formatarDataLimite = (data?: string) => {
    if (!data) return null;

    const datePart = data.includes("T") ? data.split("T")[0] : data;
    const [year, month, day] = datePart.split("-").map(Number);

    if (!year || !month || !day) return null;

    return new Date(year, month - 1, day).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const dataLimiteFormatada = formatarDataLimite(dataLimiteRsvp);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const nomeCompleto = form.nome_completo.trim();
    const telefone = form.telefone.trim();
    const quantidadeAdultos = Number(form.quantidade_adultos);
    const quantidadeCriancas = Number(form.quantidade_criancas);
    const totalPessoas = quantidadeAdultos + quantidadeCriancas;
    const precisaNomes =
      form.status === "confirmado" && totalPessoas > 1;
    const nomesAcompanhantes = form.nomes_acompanhantes.trim();

    if (!nomeCompleto) {
      setFeedback({
        tipo: "erro",
        mensagem: "Por favor, preencha o seu nome completo.",
      });
      return;
    }

    if (!telefone) {
      setFeedback({
        tipo: "erro",
        mensagem: "Por favor, preencha o seu telefone ou WhatsApp.",
      });
      return;
    }

    if (quantidadeAdultos < 1 && form.status === "confirmado") {
      setFeedback({
        tipo: "erro",
        mensagem: "Informe pelo menos um adulto na confirmação.",
      });
      return;
    }

    if (precisaNomes && !nomesAcompanhantes) {
      setFeedback({
        tipo: "erro",
        mensagem: "Por favor, informe o nome dos acompanhantes.",
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        nome_completo: nomeCompleto,
        telefone,
        quantidade_adultos:
          form.status === "confirmado" ? quantidadeAdultos : 0,
        quantidade_criancas:
          form.status === "confirmado" ? quantidadeCriancas : 0,
        status: form.status,
        opcao_comparecimento:
          form.status === "confirmado"
            ? form.opcao_comparecimento
            : null,
        nomes_acompanhantes:
          form.status === "confirmado" && precisaNomes
            ? nomesAcompanhantes
            : null,
      };

      const { error } = await supabase.from("rsvp").insert(payload);

      if (error) {
        console.error("Erro ao salvar RSVP:", error);
        throw error;
      }

      setFeedback({
        tipo: "sucesso",
        mensagem:
          form.status === "confirmado"
            ? `Presença confirmada com sucesso, ${nomeCompleto}! Mal podemos esperar para celebrar com você.`
            : `Recebemos sua resposta, ${nomeCompleto}. Sentiremos sua falta, mas agradecemos por avisar.`,
      });

      setForm(estadoInicial);
    } catch (error) {
      console.error("Falha ao enviar RSVP:", error);

      setFeedback({
        tipo: "erro",
        mensagem:
          "Não foi possível enviar sua confirmação. Por favor, tente novamente em instantes.",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalConfirmados =
    Number(form.quantidade_adultos) +
    Number(form.quantidade_criancas);

  const exibeCampoAcompanhantes =
    form.status === "confirmado" && totalConfirmados > 1;

  const inputClassName =
    "w-full rounded-xl border border-[#ddd5c7] bg-[#fffdf9] px-4 py-3.5 text-sm text-[#3f4f3c] outline-none transition-all duration-300 placeholder:text-[#9ba397] focus:border-[#7d9476] focus:ring-4 focus:ring-[#dfe7da]/60";

  const labelClassName =
    "flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6d7c68]";

  return (
    <section
      id="rsvp"
      className="relative overflow-hidden border-t border-[#e4dccd] bg-[#f7f3eb] py-24 sm:py-28 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#dfe7da]/45 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-[#eadfca]/55 blur-3xl" />
      </div>

      <svg
        aria-hidden="true"
        viewBox="0 0 220 360"
        className="pointer-events-none absolute -left-10 top-16 hidden h-[360px] w-[220px] text-[#8da084]/20 lg:block"
        fill="none"
      >
        <path
          d="M22 338C61 274 87 215 91 146C94 98 78 53 51 19"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M77 232C49 215 29 188 18 158"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M89 182C119 157 134 126 139 91"
          stroke="currentColor"
          strokeWidth="2"
        />
        <ellipse
          cx="38"
          cy="190"
          rx="17"
          ry="7"
          transform="rotate(46 38 190)"
          fill="currentColor"
        />
        <ellipse
          cx="116"
          cy="137"
          rx="18"
          ry="7"
          transform="rotate(-47 116 137)"
          fill="currentColor"
        />
        <ellipse
          cx="74"
          cy="104"
          rx="18"
          ry="7"
          transform="rotate(63 74 104)"
          fill="currentColor"
        />
      </svg>

      <svg
        aria-hidden="true"
        viewBox="0 0 220 360"
        className="pointer-events-none absolute -right-10 bottom-8 hidden h-[360px] w-[220px] rotate-180 text-[#b89a5f]/18 lg:block"
        fill="none"
      >
        <path
          d="M22 338C61 274 87 215 91 146C94 98 78 53 51 19"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M77 232C49 215 29 188 18 158"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M89 182C119 157 134 126 139 91"
          stroke="currentColor"
          strokeWidth="2"
        />
        <ellipse
          cx="38"
          cy="190"
          rx="17"
          ry="7"
          transform="rotate(46 38 190)"
          fill="currentColor"
        />
        <ellipse
          cx="116"
          cy="137"
          rx="18"
          ry="7"
          transform="rotate(-47 116 137)"
          fill="currentColor"
        />
        <ellipse
          cx="74"
          cy="104"
          rx="18"
          ry="7"
          transform="rotate(63 74 104)"
          fill="currentColor"
        />
      </svg>

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <div className="mb-5 inline-flex items-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#b89450]/70" />
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#71806d]">
              <Sparkles className="h-3.5 w-3.5 text-[#b89450]" />
              R.S.V.P.
            </span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#b89450]/70" />
          </div>

          <h2 className="font-serif text-4xl font-normal leading-tight text-[#395138] sm:text-5xl">
            Confirme sua
            <span className="block italic text-[#6f8669]">presença</span>
          </h2>

          <div className="mx-auto my-6 flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-[#cdb98d]/70" />
            <Heart className="h-4 w-4 fill-[#b89450] text-[#b89450]" />
            <span className="h-px w-16 bg-[#cdb98d]/70" />
          </div>

          <p className="font-serif text-base italic leading-relaxed text-[#697365]">
            Será uma alegria imensa ter você conosco nesse momento tão
            especial.
          </p>

          {dataLimiteFormatada && (
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#8a6b30]">
              Confirme até {dataLimiteFormatada}
            </p>
          )}
        </div>

        {feedback && (
          <div
            role="alert"
            className={[
              "mb-7 flex items-start gap-3 rounded-2xl border px-5 py-4 text-sm shadow-sm",
              feedback.tipo === "sucesso"
                ? "border-[#b8c9b1] bg-[#f1f6ee] text-[#395138]"
                : "border-[#e0b9b9] bg-[#fff5f5] text-[#7a3636]",
            ].join(" ")}
          >
            {feedback.tipo === "sucesso" ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            ) : (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
            )}
            <p className="leading-relaxed">{feedback.mensagem}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-[28px] border border-[#ddd3c1] bg-[#fffdf9]/95 p-6 shadow-[0_20px_65px_rgba(70,81,65,0.12)] backdrop-blur-sm sm:p-9"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#d8c89f] bg-[#f4ead5]">
              <CalendarCheck className="h-6 w-6 text-[#8a6b30]" />
            </div>
            <h3 className="font-serif text-2xl text-[#395138]">
              Conte com a gente
            </h3>
            <p className="mt-2 font-serif text-sm italic text-[#7a8376]">
              Preencha os dados abaixo para registrar sua resposta.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="nome_completo" className={labelClassName}>
                <UserPlus className="h-3.5 w-3.5 text-[#a27c36]" />
                Nome completo
              </label>
              <input
                id="nome_completo"
                type="text"
                name="nome_completo"
                value={form.nome_completo}
                onChange={handleChange}
                className={inputClassName}
                placeholder="Digite seu nome e sobrenome"
                autoComplete="name"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="telefone" className={labelClassName}>
                  <Phone className="h-3.5 w-3.5 text-[#a27c36]" />
                  Telefone / WhatsApp
                </label>
                <input
                  id="telefone"
                  type="tel"
                  name="telefone"
                  value={form.telefone}
                  onChange={handleChange}
                  className={inputClassName}
                  placeholder="(11) 99999-9999"
                  autoComplete="tel"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className={labelClassName}>
                  <Heart className="h-3.5 w-3.5 text-[#a27c36]" />
                  Você irá ao evento?
                </label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={inputClassName}
                >
                  <option value="confirmado">Sim, eu irei!</option>
                  <option value="recusado">Não poderei ir</option>
                </select>
              </div>
            </div>

            {form.status === "confirmado" && (
              <div className="space-y-6 rounded-2xl border border-[#e6dece] bg-[#faf7f1] p-5 sm:p-6">
                <div className="space-y-2">
                  <label
                    htmlFor="opcao_comparecimento"
                    className={labelClassName}
                  >
                    <MapPin className="h-3.5 w-3.5 text-[#a27c36]" />
                    Onde você comparecerá?
                  </label>
                  <select
                    id="opcao_comparecimento"
                    name="opcao_comparecimento"
                    value={form.opcao_comparecimento}
                    onChange={handleChange}
                    className={inputClassName}
                  >
                    <option value="cerimonia_e_jantar">
                      Cerimônia &amp; Jantar
                    </option>
                    <option value="apenas_cerimonia">
                      Apenas na Cerimônia
                    </option>
                    <option value="apenas_jantar">
                      Apenas no Jantar
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="quantidade_adultos"
                      className={labelClassName}
                    >
                      <Users className="h-3.5 w-3.5 text-[#a27c36]" />
                      Adultos
                    </label>
                    <input
                      id="quantidade_adultos"
                      type="number"
                      name="quantidade_adultos"
                      min="1"
                      max="10"
                      value={form.quantidade_adultos}
                      onChange={handleChange}
                      className={inputClassName}
                    />
                    <p className="text-[10px] italic text-[#8c9488]">
                      Incluindo você
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="quantidade_criancas"
                      className={labelClassName}
                    >
                      <Users className="h-3.5 w-3.5 text-[#a27c36]" />
                      Crianças
                    </label>
                    <input
                      id="quantidade_criancas"
                      type="number"
                      name="quantidade_criancas"
                      min="0"
                      max="10"
                      value={form.quantidade_criancas}
                      onChange={handleChange}
                      className={inputClassName}
                    />
                  </div>
                </div>

                {exibeCampoAcompanhantes && (
                  <div className="space-y-2 border-t border-[#e3dac8] pt-5">
                    <label
                      htmlFor="nomes_acompanhantes"
                      className={labelClassName}
                    >
                      <UserPlus className="h-3.5 w-3.5 text-[#a27c36]" />
                      Nome dos acompanhantes
                    </label>
                    <textarea
                      id="nomes_acompanhantes"
                      name="nomes_acompanhantes"
                      rows={3}
                      value={form.nomes_acompanhantes}
                      onChange={handleChange}
                      placeholder="Digite os nomes completos separados por vírgula"
                      className={`${inputClassName} resize-none`}
                      required
                    />
                    <p className="text-[10px] italic leading-relaxed text-[#7d8879]">
                      Você confirmou para {totalConfirmados} pessoas. Informe o
                      nome das outras {totalConfirmados - 1}.
                    </p>
                  </div>
                )}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="h-14 w-full rounded-xl border border-[#395138] bg-[#395138] text-xs font-semibold uppercase tracking-[0.16em] text-[#fffdf9] shadow-[0_12px_28px_rgba(57,81,56,0.2)] transition-all duration-300 hover:bg-[#4e694a] hover:shadow-[0_16px_34px_rgba(57,81,56,0.28)] disabled:cursor-not-allowed disabled:opacity-65"
            >
              <CalendarCheck className="mr-2 h-4 w-4" />
              {loading ? "Enviando confirmação..." : "Confirmar presença"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
