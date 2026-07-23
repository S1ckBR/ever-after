/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  ImagePlus,
  Loader2,
  MapPin,
  Save,
  Sparkles,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react";

const STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "imagens";

type CampoImagem = "imagem_cerimonia" | "imagem_recepcao";

interface EventoForm {
  id: string;
  titulo_cerimonial: string;
  subtitulo_cerimonial: string;
  cerimonia_data: string;
  cerimonia_hora: string;
  cerimonia_local: string;
  cerimonia_mapa_url: string;
  festa_data: string;
  festa_hora: string;
  festa_local: string;
  festa_mapa_url: string;
  imagem_cerimonia: string;
  imagem_recepcao: string;
}

interface Feedback {
  tipo: "sucesso" | "erro";
  mensagem: string;
}

const estadoInicial: EventoForm = {
  id: "",
  titulo_cerimonial: "O Grande Dia",
  subtitulo_cerimonial: "Onde e quando acontecerá",
  cerimonia_data: "",
  cerimonia_hora: "",
  cerimonia_local: "",
  cerimonia_mapa_url: "",
  festa_data: "",
  festa_hora: "",
  festa_local: "",
  festa_mapa_url: "",
  imagem_cerimonia: "",
  imagem_recepcao: "",
};

export default function EventoAdmin() {
  const [form, setForm] = useState<EventoForm>(estadoInicial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<CampoImagem | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    async function loadEventData() {
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("configuracoes")
          .select("*")
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setForm({
            id: data.id ?? "",
            titulo_cerimonial:
              data.titulo_cerimonial || estadoInicial.titulo_cerimonial,
            subtitulo_cerimonial:
              data.subtitulo_cerimonial || estadoInicial.subtitulo_cerimonial,
            cerimonia_data: data.cerimonia_data || "",
            cerimonia_hora: data.cerimonia_hora || "",
            cerimonia_local: data.cerimonia_local || "",
            cerimonia_mapa_url: data.cerimonia_mapa_url || "",
            festa_data: data.festa_data || "",
            festa_hora: data.festa_hora || "",
            festa_local: data.festa_local || "",
            festa_mapa_url: data.festa_mapa_url || "",
            imagem_cerimonia: data.imagem_cerimonia || "",
            imagem_recepcao: data.imagem_recepcao || "",
          });
        }
      } catch (error) {
        const mensagem =
          error instanceof Error ? error.message : "Erro desconhecido";

        console.error("Erro ao carregar dados do evento:", mensagem);
        setFeedback({
          tipo: "erro",
          mensagem:
            "Não foi possível carregar as informações do evento. Atualize a página e tente novamente.",
        });
      } finally {
        setLoading(false);
      }
    }

    loadEventData();
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setForm((estadoAtual) => ({
      ...estadoAtual,
      [name]: value,
    }));
  };

  const validarArquivo = (arquivo: File) => {
    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
    const tamanhoMaximo = 8 * 1024 * 1024;

    if (!tiposPermitidos.includes(arquivo.type)) {
      return "Escolha uma imagem JPG, PNG ou WEBP.";
    }

    if (arquivo.size > tamanhoMaximo) {
      return "A imagem deve ter no máximo 8 MB.";
    }

    return null;
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    campo: CampoImagem,
    pasta: "cerimonia" | "recepcao"
  ) => {
    const arquivo = event.target.files?.[0];
    event.target.value = "";

    if (!arquivo) return;

    setFeedback(null);

    const erroValidacao = validarArquivo(arquivo);

    if (erroValidacao) {
      setFeedback({
        tipo: "erro",
        mensagem: erroValidacao,
      });
      return;
    }

    setUploading(campo);

    try {
      const extensao =
        arquivo.name.split(".").pop()?.toLowerCase() ||
        arquivo.type.split("/").pop() ||
        "jpg";

      const nomeArquivo = `${pasta}/${Date.now()}-${crypto.randomUUID()}.${extensao}`;

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(nomeArquivo, arquivo, {
          cacheControl: "3600",
          contentType: arquivo.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(nomeArquivo);

      if (!publicUrlData.publicUrl) {
        throw new Error("Não foi possível gerar a URL pública da imagem.");
      }

      setForm((estadoAtual) => ({
        ...estadoAtual,
        [campo]: publicUrlData.publicUrl,
      }));

      setFeedback({
        tipo: "sucesso",
        mensagem:
          "Imagem enviada. Clique em “Salvar alterações” para publicar no site.",
      });
    } catch (error) {
      const mensagem =
        error instanceof Error ? error.message : "Erro desconhecido";

      console.error("Erro ao enviar imagem:", mensagem);

      setFeedback({
        tipo: "erro",
        mensagem: `Não foi possível enviar a imagem. ${mensagem}`,
      });
    } finally {
      setUploading(null);
    }
  };

  const removerImagem = (campo: CampoImagem) => {
    setForm((estadoAtual) => ({
      ...estadoAtual,
      [campo]: "",
    }));

    setFeedback({
      tipo: "sucesso",
      mensagem:
        "Imagem removida do formulário. Salve as alterações para confirmar.",
    });
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setFeedback(null);
    setSaving(true);

    const payload = {
      titulo_cerimonial: form.titulo_cerimonial.trim(),
      subtitulo_cerimonial: form.subtitulo_cerimonial.trim(),
      cerimonia_data: form.cerimonia_data.trim(),
      cerimonia_hora: form.cerimonia_hora.trim(),
      cerimonia_local: form.cerimonia_local.trim(),
      cerimonia_mapa_url: form.cerimonia_mapa_url.trim(),
      festa_data: form.festa_data.trim(),
      festa_hora: form.festa_hora.trim(),
      festa_local: form.festa_local.trim(),
      festa_mapa_url: form.festa_mapa_url.trim(),
      imagem_cerimonia: form.imagem_cerimonia.trim() || null,
      imagem_recepcao: form.imagem_recepcao.trim() || null,
    };

    try {
      if (form.id) {
        const { error } = await supabase
          .from("configuracoes")
          .update(payload)
          .eq("id", form.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("configuracoes")
          .insert(payload)
          .select("id")
          .single();

        if (error) throw error;

        setForm((estadoAtual) => ({
          ...estadoAtual,
          id: data.id,
        }));
      }

      setFeedback({
        tipo: "sucesso",
        mensagem:
          "Cerimônia, recepção e imagens atualizadas com sucesso.",
      });
    } catch (error) {
      const mensagem =
        error instanceof Error ? error.message : "Erro desconhecido";

      console.error("Erro ao salvar dados do evento:", mensagem);

      setFeedback({
        tipo: "erro",
        mensagem: `Não foi possível salvar as alterações. ${mensagem}`,
      });
    } finally {
      setSaving(false);
    }
  };

  const inputClassName =
    "w-full rounded-xl border border-[#ddd5c7] bg-[#fffdf9] px-4 py-3.5 text-sm text-[#3f4f3c] outline-none transition-all duration-300 placeholder:text-[#9ba397] focus:border-[#7d9476] focus:ring-4 focus:ring-[#dfe7da]/60";

  const labelClassName =
    "text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6d7c68]";

  const ImageUploadCard = ({
    campo,
    titulo,
    descricao,
    pasta,
  }: {
    campo: CampoImagem;
    titulo: string;
    descricao: string;
    pasta: "cerimonia" | "recepcao";
  }) => {
    const imagemUrl = form[campo];
    const estaEnviando = uploading === campo;

    return (
      <div className="overflow-hidden rounded-[22px] border border-[#ded5c5] bg-white shadow-[0_12px_35px_rgba(70,81,65,0.06)]">
        <div className="relative aspect-[16/10] overflow-hidden bg-[#eef2ec]">
          {imagemUrl ? (
            <>
              <img
                src={imagemUrl}
                alt={`Prévia da imagem de ${titulo.toLowerCase()}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#dfe7da] text-[#647b60]">
                <ImagePlus className="h-6 w-6" />
              </div>
              <p className="mt-4 font-serif text-base text-[#52654f]">
                Nenhuma imagem selecionada
              </p>
            </div>
          )}

          <div className="absolute bottom-4 left-4 rounded-full border border-white/45 bg-white/85 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#52654f] backdrop-blur">
            {titulo}
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <h3 className="font-serif text-xl text-[#395138]">{titulo}</h3>
            <p className="mt-1 text-xs leading-relaxed text-[#7a8476]">
              {descricao}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <label
              className={[
                "inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-[10px] font-semibold uppercase tracking-[0.13em] transition-colors",
                estaEnviando
                  ? "cursor-not-allowed bg-[#dfe5dc] text-[#8a9586]"
                  : "bg-[#395138] text-white hover:bg-[#4e694a]",
              ].join(" ")}
            >
              {estaEnviando ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  {imagemUrl ? "Trocar imagem" : "Enviar imagem"}
                </>
              )}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={Boolean(uploading)}
                onChange={(event) =>
                  handleImageUpload(event, campo, pasta)
                }
              />
            </label>

            {imagemUrl && (
              <>
                <a
                  href={imagemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#d8cfbf] bg-white px-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#52654f] transition-colors hover:bg-[#f5f7f2]"
                >
                  <ExternalLink className="h-4 w-4" />
                  Abrir
                </a>

                <button
                  type="button"
                  onClick={() => removerImagem(campo)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-red-600 transition-colors hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Remover
                </button>
              </>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor={`${campo}_url`} className={labelClassName}>
              URL da imagem
            </label>
            <input
              id={`${campo}_url`}
              type="url"
              name={campo}
              value={imagemUrl}
              onChange={handleChange}
              className={inputClassName}
              placeholder="Cole uma URL ou envie uma imagem acima"
            />
          </div>

          <p className="text-[10px] italic leading-relaxed text-[#8a9387]">
            Formatos aceitos: JPG, PNG e WEBP. Tamanho máximo: 8 MB.
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[520px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#6f8669]" />
          <p className="mt-4 font-serif text-sm italic text-[#607d5b]">
            Carregando informações do evento...
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 pb-12">
      <section className="relative overflow-hidden rounded-[28px] border border-[#ded5c5] bg-[#fffdf9] px-6 py-7 shadow-[0_18px_55px_rgba(70,81,65,0.08)] sm:px-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#dfe7da]/55 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9b7a38]">
              <Sparkles className="h-3.5 w-3.5" />
              Cerimônia &amp; recepção
            </span>

            <h1 className="mt-3 font-serif text-3xl text-[#395138] sm:text-4xl">
              Gerencie o grande dia
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#6f796c]">
              Atualize textos, horários, endereços, mapas e as imagens que
              aparecem nos cartões públicos da cerimônia e da recepção.
            </p>
          </div>

          <Button
            type="submit"
            disabled={saving || Boolean(uploading)}
            className="h-12 rounded-xl bg-[#395138] px-6 text-[10px] font-semibold uppercase tracking-[0.15em] text-white shadow-[0_12px_28px_rgba(57,81,56,0.2)] hover:bg-[#4e694a]"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar alterações
              </>
            )}
          </Button>
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

      <section className="rounded-[24px] border border-[#ded5c5] bg-white p-6 shadow-[0_14px_42px_rgba(70,81,65,0.06)] sm:p-7">
        <div className="mb-6">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9b7a38]">
            Textos da seção
          </span>
          <h2 className="mt-1 font-serif text-2xl text-[#395138]">
            Título e apresentação
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="titulo_cerimonial" className={labelClassName}>
              Título da seção
            </label>
            <input
              id="titulo_cerimonial"
              type="text"
              name="titulo_cerimonial"
              value={form.titulo_cerimonial}
              onChange={handleChange}
              className={inputClassName}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="subtitulo_cerimonial" className={labelClassName}>
              Subtítulo
            </label>
            <input
              id="subtitulo_cerimonial"
              type="text"
              name="subtitulo_cerimonial"
              value={form.subtitulo_cerimonial}
              onChange={handleChange}
              className={inputClassName}
              required
            />
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9b7a38]">
            Imagens públicas
          </span>
          <h2 className="mt-1 font-serif text-2xl text-[#395138]">
            Fotos da cerimônia e recepção
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-[#778173]">
            Essas imagens serão usadas diretamente nos cartões da seção
            “Cerimônia &amp; Recepção” do site.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <ImageUploadCard
            campo="imagem_cerimonia"
            titulo="Imagem da Cerimônia"
            descricao="Use uma foto da igreja, altar ou local onde acontecerá a cerimônia."
            pasta="cerimonia"
          />

          <ImageUploadCard
            campo="imagem_recepcao"
            titulo="Imagem da Recepção"
            descricao="Use uma foto do salão, restaurante ou espaço da comemoração."
            pasta="recepcao"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-[24px] border border-[#ded5c5] bg-white p-6 shadow-[0_14px_42px_rgba(70,81,65,0.06)] sm:p-7">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e7eee3] text-[#5f775a]">
              <Calendar className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#395138]">
                Cerimônia
              </h2>
              <p className="mt-1 text-xs text-[#7a8476]">
                Data, horário, endereço e mapa da igreja ou altar.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="cerimonia_data" className={labelClassName}>
                Data da cerimônia
              </label>
              <input
                id="cerimonia_data"
                type="text"
                name="cerimonia_data"
                placeholder="Ex.: Sábado, 21 de novembro de 2026"
                value={form.cerimonia_data}
                onChange={handleChange}
                className={inputClassName}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="cerimonia_hora" className={labelClassName}>
                Horário da cerimônia
              </label>
              <input
                id="cerimonia_hora"
                type="text"
                name="cerimonia_hora"
                placeholder="Ex.: Início às 17h45"
                value={form.cerimonia_hora}
                onChange={handleChange}
                className={inputClassName}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="cerimonia_local" className={labelClassName}>
                Endereço completo
              </label>
              <textarea
                id="cerimonia_local"
                name="cerimonia_local"
                rows={3}
                placeholder="Endereço da cerimônia"
                value={form.cerimonia_local}
                onChange={handleChange}
                className={`${inputClassName} resize-none`}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="cerimonia_mapa_url" className={labelClassName}>
                Link do Google Maps
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b7a38]" />
                <input
                  id="cerimonia_mapa_url"
                  type="url"
                  name="cerimonia_mapa_url"
                  placeholder="https://maps.google.com/..."
                  value={form.cerimonia_mapa_url}
                  onChange={handleChange}
                  className={`${inputClassName} pl-11`}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#ded5c5] bg-white p-6 shadow-[0_14px_42px_rgba(70,81,65,0.06)] sm:p-7">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f3ead7] text-[#9b7a38]">
              <Clock className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#395138]">
                Recepção &amp; Festa
              </h2>
              <p className="mt-1 text-xs text-[#7a8476]">
                Data, horário, endereço e mapa da comemoração.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="festa_data" className={labelClassName}>
                Data da recepção
              </label>
              <input
                id="festa_data"
                type="text"
                name="festa_data"
                placeholder="Ex.: Sábado, 21 de novembro de 2026"
                value={form.festa_data}
                onChange={handleChange}
                className={inputClassName}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="festa_hora" className={labelClassName}>
                Horário da recepção
              </label>
              <input
                id="festa_hora"
                type="text"
                name="festa_hora"
                placeholder="Ex.: Logo após a cerimônia"
                value={form.festa_hora}
                onChange={handleChange}
                className={inputClassName}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="festa_local" className={labelClassName}>
                Endereço completo
              </label>
              <textarea
                id="festa_local"
                name="festa_local"
                rows={3}
                placeholder="Endereço da recepção"
                value={form.festa_local}
                onChange={handleChange}
                className={`${inputClassName} resize-none`}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="festa_mapa_url" className={labelClassName}>
                Link do Google Maps
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b7a38]" />
                <input
                  id="festa_mapa_url"
                  type="url"
                  name="festa_mapa_url"
                  placeholder="https://maps.google.com/..."
                  value={form.festa_mapa_url}
                  onChange={handleChange}
                  className={`${inputClassName} pl-11`}
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={saving || Boolean(uploading)}
          className="h-12 rounded-xl bg-[#395138] px-7 text-[10px] font-semibold uppercase tracking-[0.15em] text-white shadow-[0_12px_28px_rgba(57,81,56,0.2)] hover:bg-[#4e694a]"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar alterações
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
