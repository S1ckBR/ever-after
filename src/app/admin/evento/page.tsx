"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Clock, Save } from "lucide-react";

export default function EventoAdmin() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    id: "",
    titulo_cerimonial: "",
    subtitulo_cerimonial: "",
    cerimonia_data: "",
    cerimonia_hora: "",
    cerimonia_local: "",
    cerimonia_mapa_url: "",
    festa_data: "",
    festa_hora: "",
    festa_local: "",
    festa_mapa_url: "",
  });

  useEffect(() => {
    async function loadEventData() {
      try {
        const { data, error } = await supabase
          .from("configuracoes")
          .select("*")
          .single();

        if (error) throw error;

        if (data) {
          setForm({
            id: data.id,
            titulo_cerimonial: data.titulo_cerimonial || "O Grande Dia",
            subtitulo_cerimonial: data.subtitulo_cerimonial || "Onde e Quando acontecerá",
            cerimonia_data: data.cerimonia_data || "",
            cerimonia_hora: data.cerimonia_hora || "",
            cerimonia_local: data.cerimonia_local || "",
            cerimonia_mapa_url: data.cerimonia_mapa_url || "",
            festa_data: data.festa_data || "",
            festa_hora: data.festa_hora || "",
            festa_local: data.festa_local || "",
            festa_mapa_url: data.festa_mapa_url || "",
          });
        }
      } catch (err) {
        console.error("Erro ao carregar dados do evento:", err);
      } finally {
        setLoading(false);
      }
    }

    loadEventData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from("configuracoes")
        .update({
          titulo_cerimonial: form.titulo_cerimonial,
          subtitulo_cerimonial: form.subtitulo_cerimonial,
          cerimonia_data: form.cerimonia_data,
          cerimonia_hora: form.cerimonia_hora,
          cerimonia_local: form.cerimonia_local,
          cerimonia_mapa_url: form.cerimonia_mapa_url,
          festa_data: form.festa_data,
          festa_hora: form.festa_hora,
          festa_local: form.festa_local,
          festa_mapa_url: form.festa_mapa_url,
        })
        .eq("id", form.id);

      if (error) throw error;

      alert("Local e horários do evento atualizados com sucesso!");
      router.refresh();
    } catch (err) {
      console.error("Erro ao salvar dados do evento:", err);
      alert("Erro ao salvar dados do evento.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-sm text-[#607d5b] font-serif italic">
        Carregando informações do evento...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-[#3b5336]">Gerenciar Cerimônia & Festa</h2>
          <p className="text-xs text-[#607d5b] mt-1">Configure os locais, horários, mapas e o título da seção.</p>
        </div>
        <Button 
          type="submit" 
          disabled={saving}
          className="bg-[#3b5336] hover:bg-[#4e6b48] text-white rounded-none uppercase text-xs tracking-widest px-6 py-5 cursor-pointer flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Card: Cabeçalho da Seção */}
        <Card className="rounded-none border-[#e1e9dc] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-base font-medium text-[#3b5336]">Textos de Destaque</CardTitle>
            <CardDescription className="text-[11px]">Como o título aparecerá no site público para os convidados</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#607d5b]">Título da Seção</label>
              <input
                type="text"
                name="titulo_cerimonial"
                value={form.titulo_cerimonial}
                onChange={handleChange}
                className="w-full text-sm border border-[#e1e9dc] p-3 rounded-none focus:outline-none focus:border-[#3b5336]"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#607d5b]">Subtítulo</label>
              <input
                type="text"
                name="subtitulo_cerimonial"
                value={form.subtitulo_cerimonial}
                onChange={handleChange}
                className="w-full text-sm border border-[#e1e9dc] p-3 rounded-none focus:outline-none focus:border-[#3b5336]"
                required
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card: Dados da Cerimônia */}
          <Card className="rounded-none border-[#e1e9dc] bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3 border-b border-[#f4f6f3] pb-4">
              <Calendar className="h-5 w-5 text-[#8fa883]" />
              <div>
                <CardTitle className="font-serif text-base font-medium text-[#3b5336]">Cerimônia</CardTitle>
                <CardDescription className="text-[11px]">Data, hora e localização da igreja/altar</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-[#607d5b]">Data da Cerimônia</label>
                <input
                  type="text"
                  name="cerimonia_data"
                  placeholder="Ex: Sábado, 21 de Novembro de 2026"
                  value={form.cerimonia_data}
                  onChange={handleChange}
                  className="w-full text-sm border border-[#e1e9dc] p-3 rounded-none focus:outline-none focus:border-[#3b5336]"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-[#607d5b]">Horário da Cerimônia</label>
                <input
                  type="text"
                  name="cerimonia_hora"
                  placeholder="Ex: Início às 18:00h"
                  value={form.cerimonia_hora}
                  onChange={handleChange}
                  className="w-full text-sm border border-[#e1e9dc] p-3 rounded-none focus:outline-none focus:border-[#3b5336]"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-[#607d5b]">Endereço Completo</label>
                <textarea
                  name="cerimonia_local"
                  rows={2}
                  placeholder="Endereço da cerimônia"
                  value={form.cerimonia_local}
                  onChange={handleChange}
                  className="w-full text-sm border border-[#e1e9dc] p-3 rounded-none focus:outline-none focus:border-[#3b5336] resize-none"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-[#607d5b]">Link do Google Maps</label>
                <input
                  type="url"
                  name="cerimonia_mapa_url"
                  placeholder="https://maps.google.com/..."
                  value={form.cerimonia_mapa_url}
                  onChange={handleChange}
                  className="w-full text-sm border border-[#e1e9dc] p-3 rounded-none focus:outline-none focus:border-[#3b5336]"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Card: Dados da Recepção / Festa */}
          <Card className="rounded-none border-[#e1e9dc] bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3 border-b border-[#f4f6f3] pb-4">
              <Clock className="h-5 w-5 text-[#8fa883]" />
              <div>
                <CardTitle className="font-serif text-base font-medium text-[#3b5336]">Recepção & Festa</CardTitle>
                <CardDescription className="text-[11px]">Local e hora da comemoração principal</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-[#607d5b]">Data da Festa</label>
                <input
                  type="text"
                  name="festa_data"
                  placeholder="Ex: Sábado, 21 de Novembro de 2026"
                  value={form.festa_data}
                  onChange={handleChange}
                  className="w-full text-sm border border-[#e1e9dc] p-3 rounded-none focus:outline-none focus:border-[#3b5336]"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-[#607d5b]">Horário da Festa</label>
                <input
                  type="text"
                  name="festa_hora"
                  placeholder="Ex: Logo após a cerimônia"
                  value={form.festa_hora}
                  onChange={handleChange}
                  className="w-full text-sm border border-[#e1e9dc] p-3 rounded-none focus:outline-none focus:border-[#3b5336]"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-[#607d5b]">Endereço Completo</label>
                <textarea
                  name="festa_local"
                  rows={2}
                  placeholder="Endereço do espaço/festa"
                  value={form.festa_local}
                  onChange={handleChange}
                  className="w-full text-sm border border-[#e1e9dc] p-3 rounded-none focus:outline-none focus:border-[#3b5336] resize-none"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-[#607d5b]">Link do Google Maps</label>
                <input
                  type="url"
                  name="festa_mapa_url"
                  placeholder="https://maps.google.com/..."
                  value={form.festa_mapa_url}
                  onChange={handleChange}
                  className="w-full text-sm border border-[#e1e9dc] p-3 rounded-none focus:outline-none focus:border-[#3b5336]"
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}