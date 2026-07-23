/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { uploadPresenteImagem } from "@/lib/upload";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  CircleDollarSign,
  Edit3,
  Gift,
  ImagePlus,
  Loader2,
  PackageOpen,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Upload,
  User,
  Users,
  X,
  XCircle,
} from "lucide-react";

interface PresenteRecebido {
  id: string;
  nome_convidado: string | null;
  quantidade_cotas: number | string | null;
  status?: string | null;
}

interface Presente {
  id: string;
  nome: string;
  descricao: string;
  valor_total: number | string;
  total_cotas: number | string;
  cotas_compradas: number | string;
  imagem_url: string;
  categoria: string | null;
  created_at?: string | null;
  presentes_recebidos?: PresenteRecebido[];
}

interface PresenteForm {
  nome: string;
  descricao: string;
  valor_total: string;
  total_cotas: string;
  categoria: string;
  imagem_url: string;
}

interface Feedback {
  tipo: "sucesso" | "erro";
  mensagem: string;
}

const imagemPadrao =
  "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=900";

const estadoInicial: PresenteForm = {
  nome: "",
  descricao: "",
  valor_total: "",
  total_cotas: "1",
  categoria: "Geral",
  imagem_url: "",
};

const categorias = [
  "Geral",
  "Viagem",
  "Alimentação",
  "Hospedagem",
  "Cotas de Casa",
  "Experiências",
  "Diversão",
];

const formatarMoeda = (valor: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);

const numeroSeguro = (valor: unknown) => {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : 0;
};

export default function AdminPresentes() {
  const [presentes, setPresentes] = useState<Presente[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [form, setForm] = useState<PresenteForm>(estadoInicial);

  const loadPresentes = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("presentes")
        .select("*, presentes_recebidos(*)")
        .order("created_at", { ascending: true });

      if (error) throw error;

      setPresentes((data as Presente[]) ?? []);
    } catch (error) {
      const mensagem =
        error instanceof Error ? error.message : "Erro desconhecido";

      console.error("Erro ao carregar presentes:", mensagem);
      setFeedback({
        tipo: "erro",
        mensagem:
          "Não foi possível carregar a lista de presentes. Atualize a página e tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPresentes();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const resetForm = () => {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setForm(estadoInicial);
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    setShowForm(false);
  };

  const abrirNovoPresente = () => {
    setFeedback(null);
    setForm(estadoInicial);
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    setShowForm(true);
  };

  const abrirEdicao = (presente: Presente) => {
    setFeedback(null);

    setForm({
      nome: presente.nome ?? "",
      descricao: presente.descricao ?? "",
      valor_total: String(presente.valor_total ?? ""),
      total_cotas: String(presente.total_cotas ?? "1"),
      categoria: presente.categoria || "Geral",
      imagem_url: presente.imagem_url || "",
    });

    setImageFile(null);
    setImagePreview(presente.imagem_url || null);
    setEditingId(presente.id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setForm((estadoAtual) => ({
      ...estadoAtual,
      [name]: value,
    }));
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const arquivo = event.target.files?.[0];
    event.target.value = "";

    if (!arquivo) return;

    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
    const tamanhoMaximo = 8 * 1024 * 1024;

    if (!tiposPermitidos.includes(arquivo.type)) {
      setFeedback({
        tipo: "erro",
        mensagem: "Escolha uma imagem JPG, PNG ou WEBP.",
      });
      return;
    }

    if (arquivo.size > tamanhoMaximo) {
      setFeedback({
        tipo: "erro",
        mensagem: "A imagem deve ter no máximo 8 MB.",
      });
      return;
    }

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setFeedback(null);
    setImageFile(arquivo);
    setImagePreview(URL.createObjectURL(arquivo));
  };

  const removerImagemDoFormulario = () => {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);
    setImagePreview(null);
    setForm((estadoAtual) => ({
      ...estadoAtual,
      imagem_url: "",
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFeedback(null);

    const nome = form.nome.trim();
    const descricao = form.descricao.trim();
    const valorTotal = numeroSeguro(form.valor_total);
    const totalCotas = Math.floor(numeroSeguro(form.total_cotas));

    if (!nome || !descricao) {
      setFeedback({
        tipo: "erro",
        mensagem: "Preencha o nome e a descrição do presente.",
      });
      return;
    }

    if (valorTotal <= 0) {
      setFeedback({
        tipo: "erro",
        mensagem: "O valor total do presente deve ser maior que zero.",
      });
      return;
    }

    if (totalCotas < 1) {
      setFeedback({
        tipo: "erro",
        mensagem: "O presente deve ter pelo menos uma cota.",
      });
      return;
    }

    setSaving(true);

    try {
      let finalImageUrl =
        form.imagem_url.trim() || imagePreview || imagemPadrao;

      if (imageFile) {
        const uploadedUrl = await uploadPresenteImagem(imageFile);

        if (!uploadedUrl) {
          throw new Error(
            "O upload da imagem não retornou uma URL válida."
          );
        }

        finalImageUrl = uploadedUrl;
      }

      const payload = {
        nome,
        descricao,
        valor_total: valorTotal,
        total_cotas: totalCotas,
        imagem_url: finalImageUrl,
        categoria: form.categoria,
      };

      if (editingId) {
        const presenteAtual = presentes.find(
          (presente) => presente.id === editingId
        );
        const cotasCompradas = numeroSeguro(
          presenteAtual?.cotas_compradas
        );

        if (totalCotas < cotasCompradas) {
          throw new Error(
            `Este presente já possui ${cotasCompradas} cota(s) comprada(s). O total não pode ser menor que isso.`
          );
        }

        const { error } = await supabase
          .from("presentes")
          .update(payload)
          .eq("id", editingId);

        if (error) throw error;

        setFeedback({
          tipo: "sucesso",
          mensagem: "Presente atualizado com sucesso.",
        });
      } else {
        const { error } = await supabase.from("presentes").insert({
          ...payload,
          cotas_compradas: 0,
        });

        if (error) throw error;

        setFeedback({
          tipo: "sucesso",
          mensagem: "Presente cadastrado com sucesso.",
        });
      }

      resetForm();
      await loadPresentes();
    } catch (error) {
      const mensagem =
        error instanceof Error ? error.message : "Erro desconhecido";

      console.error("Erro ao salvar presente:", mensagem);
      setFeedback({
        tipo: "erro",
        mensagem: `Não foi possível salvar o presente. ${mensagem}`,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const presente = presentes.find((item) => item.id === id);
    const nomePresente = presente?.nome || "este presente";

    const confirmou = window.confirm(
      `Tem certeza que deseja remover “${nomePresente}” da lista?`
    );

    if (!confirmou) return;

    setFeedback(null);

    try {
      const { error } = await supabase
        .from("presentes")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setPresentes((listaAtual) =>
        listaAtual.filter((item) => item.id !== id)
      );

      setFeedback({
        tipo: "sucesso",
        mensagem: "Presente removido com sucesso.",
      });
    } catch (error) {
      const mensagem =
        error instanceof Error ? error.message : "Erro desconhecido";

      console.error("Erro ao remover presente:", mensagem);
      setFeedback({
        tipo: "erro",
        mensagem: `Não foi possível remover o presente. ${mensagem}`,
      });
    }
  };

  const metricas = useMemo(() => {
    let totalCotas = 0;
    let cotasCompradas = 0;
    let totalArrecadado = 0;
    let totalCompradores = 0;

    presentes.forEach((presente) => {
      const valorTotal = numeroSeguro(presente.valor_total);
      const quantidadeTotal = Math.max(
        numeroSeguro(presente.total_cotas),
        1
      );
      const quantidadeComprada = Math.min(
        numeroSeguro(presente.cotas_compradas),
        quantidadeTotal
      );

      totalCotas += quantidadeTotal;
      cotasCompradas += quantidadeComprada;
      totalArrecadado +=
        (valorTotal / quantidadeTotal) * quantidadeComprada;
      totalCompradores += presente.presentes_recebidos?.length ?? 0;
    });

    return {
      totalCotas,
      cotasCompradas,
      totalArrecadado,
      totalCompradores,
    };
  }, [presentes]);

  const inputClassName =
    "w-full rounded-xl border border-[#ddd5c7] bg-[#fffdf9] px-4 py-3.5 text-sm text-[#3f4f3c] outline-none transition-all duration-300 placeholder:text-[#9ba397] focus:border-[#7d9476] focus:ring-4 focus:ring-[#dfe7da]/60";

  const labelClassName =
    "text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6d7c68]";

  return (
    <div className="space-y-8 pb-12">
      {/* Cabeçalho */}
      <section className="relative overflow-hidden rounded-[28px] border border-[#ded5c5] bg-[#fffdf9] px-6 py-7 shadow-[0_18px_55px_rgba(70,81,65,0.08)] sm:px-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#dfe7da]/55 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9b7a38]">
              <Sparkles className="h-3.5 w-3.5" />
              Lista de presentes
            </span>

            <h1 className="mt-3 font-serif text-3xl text-[#395138] sm:text-4xl">
              Gerencie os presentes
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#6f796c]">
              Cadastre, edite e acompanhe as cotas e os convidados que já
              presentearam vocês.
            </p>
          </div>

          {!showForm && (
            <Button
              type="button"
              onClick={abrirNovoPresente}
              className="h-12 rounded-xl bg-[#395138] px-6 text-[10px] font-semibold uppercase tracking-[0.15em] text-white shadow-[0_12px_28px_rgba(57,81,56,0.2)] hover:bg-[#4e694a]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo presente
            </Button>
          )}
        </div>
      </section>

      {feedback && (
        <div
          role="alert"
          className={[
            "flex items-start gap-3 rounded-2xl border px-5 py-4 text-sm shadow-sm",
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

      {/* Métricas */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[22px] border border-[#ded5c5] bg-white p-5 shadow-[0_12px_36px_rgba(70,81,65,0.06)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#71806d]">
              Presentes
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7eee3] text-[#5f775a]">
              <Gift className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 font-serif text-2xl text-[#395138]">
            {presentes.length}
          </p>
          <p className="mt-1 text-[10px] text-[#879184]">
            Itens cadastrados
          </p>
        </div>

        <div className="rounded-[22px] border border-[#ded5c5] bg-white p-5 shadow-[0_12px_36px_rgba(70,81,65,0.06)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#71806d]">
              Cotas preenchidas
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3ead7] text-[#9b7a38]">
              <PackageOpen className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 font-serif text-2xl text-[#395138]">
            {metricas.cotasCompradas}
          </p>
          <p className="mt-1 text-[10px] text-[#879184]">
            De {metricas.totalCotas} cotas
          </p>
        </div>

        <div className="rounded-[22px] border border-[#ded5c5] bg-white p-5 shadow-[0_12px_36px_rgba(70,81,65,0.06)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#71806d]">
              Arrecadado
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e9eee8] text-[#60745d]">
              <CircleDollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 font-serif text-2xl text-[#395138]">
            {formatarMoeda(metricas.totalArrecadado)}
          </p>
          <p className="mt-1 text-[10px] text-[#879184]">
            Conforme as cotas preenchidas
          </p>
        </div>

        <div className="rounded-[22px] border border-[#ded5c5] bg-white p-5 shadow-[0_12px_36px_rgba(70,81,65,0.06)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#71806d]">
              Registros
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2e7e4] text-[#9a6b65]">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 font-serif text-2xl text-[#395138]">
            {metricas.totalCompradores}
          </p>
          <p className="mt-1 text-[10px] text-[#879184]">
            Compras registradas
          </p>
        </div>
      </section>

      {/* Formulário */}
      {showForm && (
        <section className="overflow-hidden rounded-[26px] border border-[#ded5c5] bg-white shadow-[0_16px_46px_rgba(70,81,65,0.08)]">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between border-b border-[#eee7dc] px-6 py-5 sm:px-7">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9b7a38]">
                  {editingId ? "Editar presente" : "Novo presente"}
                </span>
                <h2 className="mt-1 font-serif text-2xl text-[#395138]">
                  {editingId
                    ? "Atualize as informações"
                    : "Cadastre um novo presente"}
                </h2>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ddd5c7] text-[#71806d] transition-colors hover:bg-[#f5f7f2]"
                aria-label="Fechar formulário"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-8 p-6 sm:p-7 lg:grid-cols-[minmax(0,1fr)_340px]">
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="nome" className={labelClassName}>
                      Nome do presente
                    </label>
                    <input
                      id="nome"
                      type="text"
                      name="nome"
                      placeholder="Ex.: Jantar romântico na Itália"
                      value={form.nome}
                      onChange={handleInputChange}
                      className={inputClassName}
                      maxLength={120}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="categoria" className={labelClassName}>
                      Categoria
                    </label>
                    <select
                      id="categoria"
                      name="categoria"
                      value={form.categoria}
                      onChange={handleInputChange}
                      className={inputClassName}
                    >
                      {categorias.map((categoria) => (
                        <option key={categoria} value={categoria}>
                          {categoria}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="valor_total" className={labelClassName}>
                      Valor total
                    </label>
                    <input
                      id="valor_total"
                      type="number"
                      name="valor_total"
                      min="0.01"
                      step="0.01"
                      placeholder="Ex.: 1500"
                      value={form.valor_total}
                      onChange={handleInputChange}
                      className={inputClassName}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="total_cotas" className={labelClassName}>
                      Quantidade de cotas
                    </label>
                    <input
                      id="total_cotas"
                      type="number"
                      name="total_cotas"
                      min="1"
                      step="1"
                      placeholder="Ex.: 10"
                      value={form.total_cotas}
                      onChange={handleInputChange}
                      className={inputClassName}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="descricao" className={labelClassName}>
                    Descrição
                  </label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    rows={5}
                    placeholder="Conte de forma divertida por que esse presente é especial."
                    value={form.descricao}
                    onChange={handleInputChange}
                    className={`${inputClassName} resize-none leading-relaxed`}
                    maxLength={500}
                    required
                  />
                  <p className="text-right text-[10px] text-[#929b8f]">
                    {form.descricao.length}/500
                  </p>
                </div>
              </div>

              <div>
                <label className={labelClassName}>Foto do presente</label>

                <div className="mt-2 overflow-hidden rounded-[22px] border border-[#ded5c5] bg-[#faf8f3]">
                  <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#eef2ec]">
                    {imagePreview ? (
                      imagePreview.startsWith("blob:") ? (
                        <img
                          src={imagePreview}
                          alt="Prévia do presente"
                          className="h-full w-full object-contain p-3"
                        />
                      ) : (
                        <Image
                          src={imagePreview}
                          alt="Prévia do presente"
                          fill
                          sizes="340px"
                          className="object-contain p-3"
                        />
                      )
                    ) : (
                      <div className="text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#dfe7da] text-[#647b60]">
                          <ImagePlus className="h-6 w-6" />
                        </div>
                        <p className="mt-4 font-serif text-sm italic text-[#6f796c]">
                          Escolha uma imagem
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 p-4">
                    <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#395138] px-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-white transition-colors hover:bg-[#4e694a]">
                      <Upload className="h-4 w-4" />
                      {imagePreview ? "Trocar foto" : "Escolher foto"}

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>

                    {imagePreview && (
                      <button
                        type="button"
                        onClick={removerImagemDoFormulario}
                        className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white text-[10px] font-semibold uppercase tracking-[0.13em] text-red-600 transition-colors hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remover imagem
                      </button>
                    )}

                    <p className="text-[10px] italic leading-relaxed text-[#899286]">
                      JPG, PNG ou WEBP. Máximo de 8 MB. A imagem será exibida
                      inteira, sem cortes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse justify-end gap-3 border-t border-[#eee7dc] bg-[#fbfaf6] px-6 py-5 sm:flex-row sm:px-7">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="h-11 rounded-xl border-[#d8cfbf] px-5 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#60705c]"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={saving}
                className="h-11 rounded-xl bg-[#395138] px-6 text-[10px] font-semibold uppercase tracking-[0.13em] text-white hover:bg-[#4e694a]"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {editingId ? "Salvar alterações" : "Salvar presente"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </section>
      )}

      {/* Lista */}
      {loading ? (
        <div className="flex min-h-[360px] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#6f8669]" />
            <p className="mt-4 font-serif text-sm italic text-[#607d5b]">
              Carregando lista de presentes...
            </p>
          </div>
        </div>
      ) : presentes.length === 0 ? (
        <div className="flex min-h-[320px] items-center justify-center rounded-[26px] border border-dashed border-[#d8cfbf] bg-[#fffdf9] px-6 text-center">
          <div>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e5ebe1]">
              <Gift className="h-7 w-7 text-[#6f8669]" />
            </div>

            <h2 className="mt-5 font-serif text-2xl text-[#395138]">
              Nenhum presente cadastrado
            </h2>

            <p className="mt-2 font-serif text-sm italic text-[#6f796c]">
              Crie o primeiro item da lista de presentes.
            </p>

            <Button
              type="button"
              onClick={abrirNovoPresente}
              className="mt-6 h-11 rounded-xl bg-[#395138] px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#4e694a]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Criar presente
            </Button>
          </div>
        </div>
      ) : (
        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9b7a38]">
                Presentes cadastrados
              </span>
              <h2 className="mt-1 font-serif text-2xl text-[#395138]">
                Sua lista
              </h2>
            </div>

            <span className="rounded-full border border-[#ded5c5] bg-[#fffdf9] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#71806d]">
              {presentes.length}{" "}
              {presentes.length === 1 ? "presente" : "presentes"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {presentes.map((presente) => {
              const valorTotal = numeroSeguro(presente.valor_total);
              const totalCotas = Math.max(
                numeroSeguro(presente.total_cotas),
                1
              );
              const cotasCompradas = Math.min(
                numeroSeguro(presente.cotas_compradas),
                totalCotas
              );
              const valorCota = valorTotal / totalCotas;
              const progresso = (cotasCompradas / totalCotas) * 100;
              const restantes = Math.max(
                totalCotas - cotasCompradas,
                0
              );

              return (
                <article
                  key={presente.id}
                  className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#ded5c5] bg-white shadow-[0_14px_40px_rgba(70,81,65,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(70,81,65,0.12)]"
                >
                  <div className="relative flex h-56 w-full items-center justify-center overflow-hidden bg-[#eef2ec]">
                    <Image
                      src={presente.imagem_url || imagemPadrao}
                      alt={presente.nome}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
                    />

                    <span className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/90 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#52654f] shadow-sm backdrop-blur">
                      {presente.categoria || "Geral"}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div>
                      <h3 className="font-serif text-xl leading-snug text-[#395138]">
                        {presente.nome}
                      </h3>

                      <p className="mt-2 line-clamp-3 min-h-[58px] font-serif text-sm italic leading-relaxed text-[#6f796c]">
                        {presente.descricao}
                      </p>
                    </div>

                    <div className="mt-5 rounded-2xl border border-[#ebe4d9] bg-[#faf8f3] p-4">
                      <div className="flex items-end justify-between gap-3">
                        <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#7c8878]">
                          Valor total
                        </span>
                        <span className="font-serif text-lg text-[#395138]">
                          {formatarMoeda(valorTotal)}
                        </span>
                      </div>

                      <div className="mt-2 flex items-end justify-between gap-3">
                        <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#7c8878]">
                          Valor da cota
                        </span>
                        <span className="font-serif text-sm font-semibold text-[#9b7a38]">
                          {formatarMoeda(valorCota)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="flex justify-between text-[10px] text-[#71806d]">
                        <span>
                          {cotasCompradas} de {totalCotas} cotas
                        </span>
                        <span>{restantes} restantes</span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e8ede5]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#91a88a] to-[#b89450]"
                          style={{
                            width: `${Math.min(progresso, 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {presente.presentes_recebidos &&
                      presente.presentes_recebidos.length > 0 && (
                        <div className="mt-5 border-t border-[#eee7dc] pt-4">
                          <h4 className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#71806d]">
                            <User className="h-3.5 w-3.5 text-[#9b7a38]" />
                            Quem presenteou
                          </h4>

                          <ul className="mt-3 max-h-28 space-y-2 overflow-y-auto pr-1">
                            {presente.presentes_recebidos.map(
                              (registro) => (
                                <li
                                  key={registro.id}
                                  className="flex items-center justify-between gap-3 rounded-xl bg-[#f5f7f2] px-3 py-2 text-[10px] text-[#52654f]"
                                >
                                  <span
                                    className="truncate font-medium"
                                    title={
                                      registro.nome_convidado ||
                                      "Convidado"
                                    }
                                  >
                                    {registro.nome_convidado ||
                                      "Convidado não informado"}
                                  </span>

                                  <span className="shrink-0 font-semibold text-[#8a6b30]">
                                    {numeroSeguro(
                                      registro.quantidade_cotas
                                    )}{" "}
                                    cota(s)
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    <div className="mt-auto flex gap-2 border-t border-[#eee7dc] pt-5">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => abrirEdicao(presente)}
                        className="h-10 flex-1 rounded-xl border-[#d8cfbf] text-[10px] font-semibold uppercase tracking-[0.12em] text-[#52654f] hover:bg-[#f5f7f2]"
                      >
                        <Edit3 className="mr-2 h-3.5 w-3.5" />
                        Editar
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleDelete(presente.id)}
                        className="h-10 rounded-xl border-red-200 px-4 text-red-600 hover:bg-red-50"
                        title="Remover presente"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
