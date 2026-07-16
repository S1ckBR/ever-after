"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Settings, ImageIcon } from "lucide-react";
import AuthGuard from "@/components/admin/AuthGuard"; // Importando o protetor

export default function AdminConfiguracoes() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    id: "",
    nome_noiva: "",
    nome_noivo: "",
    data_casamento: "",
    data_limite_rsvp: "",
    local_cerimonia: "",
    hora_cerimonia: "",
    local_recepcao: "",
    hora_recepcao: "",
    mp_access_token: "",
    imagem_hero: "",
    imagem_historia_1: "",
    imagem_historia_2: "",
    texto_historia: "",
  });

  const loadConfig = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("configuracoes")
        .select("*")
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setConfig({
          id: data.id || "",
          nome_noiva: data.nome_noiva || "",
          nome_noivo: data.nome_noivo || "",
          data_casamento: data.data_casamento || "",
          data_limite_rsvp: data.data_limite_rsvp || "",
          local_cerimonia: data.local_cerimonia || "",
          hora_cerimonia: data.hora_cerimonia || "",
          local_recepcao: data.local_recepcao || "",
          hora_recepcao: data.hora_recepcao || "",
          mp_access_token: data.mp_access_token || "",
          imagem_hero: data.imagem_hero || "",
          imagem_historia_1: data.imagem_historia_1 || "",
          imagem_historia_2: data.imagem_historia_2 || "",
          texto_historia: data.texto_historia || "",
        });
      }
    } catch (err) {
      console.error("Erro ao carregar configurações:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${fieldName}-${Date.now()}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('imagens-casamento')
        .upload(fileName, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('imagens-casamento')
        .getPublicUrl(fileName);

      setConfig((prev) => ({ ...prev, [fieldName]: publicUrlData.publicUrl }));
      alert("Imagem enviada com sucesso!");
    } catch (err: any) {
      console.error(err);
      alert("Erro ao enviar imagem: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let error;
      const payload = {
        nome_noiva: config.nome_noiva,
        nome_noivo: config.nome_noivo,
        data_casamento: config.data_casamento,
        data_limite_rsvp: config.data_limite_rsvp || null,
        local_cerimonia: config.local_cerimonia,
        hora_cerimonia: config.hora_cerimonia,
        local_recepcao: config.local_recepcao,
        hora_recepcao: config.hora_recepcao,
        mp_access_token: config.mp_access_token,
        imagem_hero: config.imagem_hero,
        imagem_historia_1: config.imagem_historia_1,
        imagem_historia_2: config.imagem_historia_2,
        texto_historia: config.texto_historia,
      };

      if (config.id) {
        const { error: updateError } = await supabase
          .from("configuracoes")
          .update(payload)
          .eq("id", config.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("configuracoes")
          .insert(payload);
        error = insertError;
      }

      if (error) throw error;
      alert("Configurações salvas com sucesso!");
      loadConfig();
    } catch (err: any) {
      console.error(err);
      alert("Erro ao salvar configurações: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px] text-sm text-[#607d5b] font-serif italic">Carregando dados...</div>;
  }

  return (
    <AuthGuard>
      <div className="space-y-8 max-w-4xl pb-12">
        <div>
          <h2 className="font-serif text-2xl text-[#3b5336] flex items-center gap-2">
            <Settings className="h-6 w-6 text-[#8fa883]" /> Configurações Gerais
          </h2>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          
          <Card className="rounded-none border-[#e1e9dc] bg-white shadow-sm">
            <CardHeader className="border-b border-[#f4f6f3] pb-4"><CardTitle className="font-serif text-base text-[#3b5336]">Informações do Casal</CardTitle></CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-xs uppercase text-[#607d5b]">Nome da Noiva</label><input type="text" name="nome_noiva" value={config.nome_noiva} onChange={handleChange} className="w-full text-sm border p-3 rounded-none" /></div>
                <div className="space-y-1.5"><label className="text-xs uppercase text-[#607d5b]">Nome do Noivo</label><input type="text" name="nome_noivo" value={config.nome_noivo} onChange={handleChange} className="w-full text-sm border p-3 rounded-none" /></div>
            </CardContent>
          </Card>

          <Card className="rounded-none border-[#e1e9dc] bg-white shadow-sm">
            <CardHeader className="border-b border-[#f4f6f3] pb-4"><CardTitle className="font-serif text-base text-[#3b5336] flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Personalização Visual</CardTitle></CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase text-[#607d5b]">Imagem Principal (Hero)</label>
                <div className="flex gap-2">
                  <input type="text" name="imagem_hero" value={config.imagem_hero} onChange={handleChange} className="w-full text-sm border p-3 rounded-none" placeholder="URL ou faça upload" />
                  <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'imagem_hero')} className="hidden" id="upload-hero" />
                  <label htmlFor="upload-hero" className="cursor-pointer bg-[#e1e9dc] p-3 text-xs flex items-center hover:bg-[#d0dcd0]">{saving ? "..." : "Upload"}</label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase text-[#607d5b]">Imagem História 1</label>
                  <div className="flex gap-2">
                    <input type="text" name="imagem_historia_1" value={config.imagem_historia_1} onChange={handleChange} className="w-full text-sm border p-3 rounded-none" />
                    <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'imagem_historia_1')} className="hidden" id="upload-hist1" />
                    <label htmlFor="upload-hist1" className="cursor-pointer bg-[#e1e9dc] p-3 text-xs flex items-center hover:bg-[#d0dcd0]">Upload</label>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs uppercase text-[#607d5b]">Imagem História 2</label>
                  <div className="flex gap-2">
                    <input type="text" name="imagem_historia_2" value={config.imagem_historia_2} onChange={handleChange} className="w-full text-sm border p-3 rounded-none" />
                    <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'imagem_historia_2')} className="hidden" id="upload-hist2" />
                    <label htmlFor="upload-hist2" className="cursor-pointer bg-[#e1e9dc] p-3 text-xs flex items-center hover:bg-[#d0dcd0]">Upload</label>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5"><label className="text-xs uppercase text-[#607d5b]">Texto da Nossa História</label><textarea name="texto_historia" rows={5} value={config.texto_historia} onChange={handleChange} className="w-full text-sm border p-3 rounded-none" /></div>
            </CardContent>
          </Card>

          <Card className="rounded-none border-[#e1e9dc] bg-white shadow-sm">
            <CardHeader className="border-b border-[#f4f6f3] pb-4"><CardTitle className="font-serif text-base text-[#3b5336]">Data e Locais</CardTitle></CardHeader>
            <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5"><label className="text-xs uppercase text-[#607d5b]">Data</label><input type="date" name="data_casamento" value={config.data_casamento} onChange={handleChange} className="w-full text-sm border p-3 rounded-none" /></div>
                  <div className="space-y-1.5"><label className="text-xs uppercase text-[#607d5b]">Hora Cerimônia</label><input type="time" name="hora_cerimonia" value={config.hora_cerimonia} onChange={handleChange} className="w-full text-sm border p-3 rounded-none" /></div>
                  <div className="space-y-1.5"><label className="text-xs uppercase text-[#607d5b]">Hora Recepção</label><input type="time" name="hora_recepcao" value={config.hora_recepcao} onChange={handleChange} className="w-full text-sm border p-3 rounded-none" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-[#f4f6f3]">
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase text-[#607d5b]">Prazo para Confirmação (RSVP)</label>
                    <input type="date" name="data_limite_rsvp" value={config.data_limite_rsvp} onChange={handleChange} className="w-full text-sm border p-3 rounded-none" />
                    <p className="text-[10px] text-[#607d5b] italic">Essa é a data limite mostrada aos convidados para confirmarem presença.</p>
                  </div>
                </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={saving} className="bg-[#3b5336] hover:bg-[#4e6b48] text-white rounded-none px-8 py-6 text-xs tracking-widest uppercase font-semibold flex items-center gap-2">
              <Save className="h-4 w-4" /> {saving ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </div>
        </form>
      </div>
    </AuthGuard>
  );
}
