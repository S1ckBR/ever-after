"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadPresenteImagem } from "@/lib/upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Gift, Trash2, Plus, Upload, X, Save, User } from "lucide-react";
import Image from "next/image";

export default function AdminPresentes() {
  const [presentes, setPresentes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Estados do formulário
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    valor_total: "",
    total_cotas: "1",
    categoria: "Geral",
  });

  // Carrega todos os presentes E a lista de quem comprou
  const loadPresentes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("presentes")
        // O Supabase entende a relação e traz os compradores como um array dentro de cada presente
        .select("*, presentes_recebidos(*)") 
        .order("created_at", { ascending: true });

      if (error) throw error;
      setPresentes(data || []);
    } catch (err) {
      console.error("Erro ao carregar presentes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPresentes();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let finalImageUrl = "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=600";

      if (imageFile) {
        const uploadedUrl = await uploadPresenteImagem(imageFile);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }

      const { error } = await supabase
        .from("presentes")
        .insert({
          nome: form.nome,
          descricao: form.descricao,
          valor_total: parseFloat(form.valor_total),
          total_cotas: parseInt(form.total_cotas),
          cotas_compradas: 0,
          imagem_url: finalImageUrl,
          categoria: form.categoria,
        });

      if (error) throw error;

      alert("Presente cadastrado com sucesso!");
      
      setForm({ nome: "", descricao: "", valor_total: "", total_cotas: "1", categoria: "Geral" });
      setImageFile(null);
      setImagePreview(null);
      setShowForm(false);
      loadPresentes();
    } catch (err) {
      console.error("Erro ao salvar presente:", err);
      alert("Erro ao salvar o presente.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este presente da lista?")) return;

    try {
      const { error } = await supabase
        .from("presentes")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      alert("Presente removido com sucesso!");
      loadPresentes();
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert("Erro ao deletar presente.");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl pb-12">
      {/* Topo do painel */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-[#3b5336]">Gerenciar Lista de Presentes</h2>
          <p className="text-xs text-[#607d5b] mt-1">Crie, visualize e remova presentes ou cotas do site público.</p>
        </div>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-[#3b5336] hover:bg-[#4e6b48] text-white rounded-none uppercase text-xs tracking-widest px-6 py-5 cursor-pointer flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Novo Presente
          </Button>
        )}
      </div>

      {/* Formulário de Cadastro */}
      {showForm && (
        <Card className="rounded-none border-[#e1e9dc] bg-white shadow-sm max-w-2xl">
          <form onSubmit={handleSubmit}>
            <CardHeader className="flex flex-row items-center justify-between border-b border-[#f4f6f3] pb-4">
              <div>
                <CardTitle className="font-serif text-base font-medium text-[#3b5336]">Cadastrar Novo Presente</CardTitle>
                <CardDescription className="text-[11px]">Insira os detalhes e divida em cotas se preferir</CardDescription>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowForm(false);
                  setImagePreview(null);
                  setImageFile(null);
                }}
                className="h-8 w-8 p-0 rounded-none hover:bg-[#f4f6f3]"
              >
                <X className="h-4 w-4 text-[#607d5b]" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-[#607d5b]">Nome do Presente</label>
                  <input
                    type="text"
                    name="nome"
                    placeholder="Ex: Jantar Romântico na Itália"
                    value={form.nome}
                    onChange={handleInputChange}
                    className="w-full text-sm border border-[#e1e9dc] p-3 rounded-none focus:outline-none focus:border-[#3b5336]"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-[#607d5b]">Categoria</label>
                  <select
                    name="categoria"
                    value={form.categoria}
                    onChange={handleInputChange}
                    className="w-full text-sm border border-[#e1e9dc] p-3 bg-white rounded-none focus:outline-none focus:border-[#3b5336]"
                  >
                    <option value="Geral">Geral</option>
                    <option value="Viagem">Viagem</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Hospedagem">Hospedagem</option>
                    <option value="Cotas">Cotas de Casa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-[#607d5b]">Valor Total (R$)</label>
                  <input
                    type="number"
                    name="valor_total"
                    placeholder="Ex: 1500"
                    step="0.01"
                    value={form.valor_total}
                    onChange={handleInputChange}
                    className="w-full text-sm border border-[#e1e9dc] p-3 rounded-none focus:outline-none focus:border-[#3b5336]"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-[#607d5b]">Quantidade de Cotas</label>
                  <input
                    type="number"
                    name="total_cotas"
                    placeholder="Ex: 10"
                    min="1"
                    value={form.total_cotas}
                    onChange={handleInputChange}
                    className="w-full text-sm border border-[#e1e9dc] p-3 rounded-none focus:outline-none focus:border-[#3b5336]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-[#607d5b]">Descrição</label>
                <textarea
                  name="descricao"
                  rows={3}
                  placeholder="Deixe uma mensagem carinhosa explicando por que esse presente é especial."
                  value={form.descricao}
                  onChange={handleInputChange}
                  className="w-full text-sm border border-[#e1e9dc] p-3 rounded-none focus:outline-none focus:border-[#3b5336] resize-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-[#607d5b] block">Foto do Presente</label>
                <div className="flex gap-4 items-center border border-[#e1e9dc] p-4 bg-[#fbfcfb]">
                  {imagePreview ? (
                    <div className="relative h-20 w-20 border border-[#e1e9dc] overflow-hidden">
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center border border-dashed border-[#e1e9dc] bg-white text-[#607d5b]">
                      <Gift className="h-6 w-6" />
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="cursor-pointer bg-white border border-[#3b5336] text-[#3b5336] px-4 py-2 hover:bg-[#3b5336] hover:text-[#fdfcf9] uppercase text-[10px] tracking-widest font-semibold inline-flex items-center gap-2 transition-all">
                      <Upload className="h-3 w-3" /> Escolher Foto
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="text-[10px] text-[#607d5b] mt-1">Formatos suportados: JPG, PNG ou WEBP.</p>
                  </div>
                </div>
              </div>

            </CardContent>
            <CardFooter className="border-t border-[#f4f6f3] p-6 flex justify-end gap-3 bg-[#fbfcfb]">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setImagePreview(null);
                  setImageFile(null);
                }}
                className="border-[#e1e9dc] text-[#607d5b] rounded-none px-6 uppercase text-xs tracking-widest"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#3b5336] hover:bg-[#4e6b48] text-white rounded-none px-6 uppercase text-xs tracking-widest flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? "Salvando..." : "Salvar Presente"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Listagem de Presentes Cadastrados */}
      {loading ? (
        <div className="text-center text-sm text-[#607d5b] font-serif italic py-12">
          Carregando lista de presentes...
        </div>
      ) : presentes.length === 0 ? (
        <div className="text-center border border-dashed border-[#e1e9dc] p-12 bg-white">
          <p className="text-sm text-[#607d5b] font-serif italic">Nenhum presente cadastrado na lista.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {presentes.map((p) => (
            <Card key={p.id} className="rounded-none border-[#e1e9dc] bg-white shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-40 w-full">
                  <Image src={p.imagem_url} alt={p.nome} fill className="object-cover" />
                </div>
                <CardHeader className="p-4 pb-1">
                  <div className="flex justify-between items-start">
                    <CardTitle className="font-serif text-lg text-[#3b5336] font-light">{p.nome}</CardTitle>
                    <span className="text-[9px] uppercase tracking-wider bg-[#eef2ed] text-[#3b5336] px-2 py-0.5 font-semibold">
                      {p.categoria}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-1 space-y-3">
                  <p className="text-xs text-[#607d5b] font-serif italic line-clamp-2">{p.descricao}</p>
                  
                  <div className="flex justify-between text-xs text-[#607d5b] border-t border-[#f4f6f3] pt-2">
                    <span>Valor Total:</span>
                    <span className="font-semibold text-[#3b5336]">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(p.valor_total)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-xs text-[#607d5b]">
                    <span>Cotas:</span>
                    <span className="font-semibold text-[#3b5336]">
                      {p.cotas_compradas} de {p.total_cotas} ({p.total_cotas - p.cotas_compradas} restantes)
                    </span>
                  </div>

                  {/* SESSÃO NOVA: QUEM PRESENTEOU */}
                  {p.presentes_recebidos && p.presentes_recebidos.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[#f4f6f3]">
                      <h4 className="text-[10px] uppercase tracking-wider text-[#607d5b] mb-2 font-semibold flex items-center gap-1">
                        <User className="h-3 w-3" /> Quem Presenteou:
                      </h4>
                      <ul className="space-y-1.5 max-h-24 overflow-y-auto pr-1 custom-scrollbar">
                        {p.presentes_recebidos.map((rec: any) => (
                          <li key={rec.id} className="text-[11px] text-[#3b5336] flex justify-between bg-[#f4f6f3] p-1.5 px-2">
                            <span className="font-medium truncate mr-2" title={rec.nome_convidado}>
                              {rec.nome_convidado}
                            </span>
                            <span className="whitespace-nowrap font-semibold">
                              {rec.quantidade_cotas} cota(s)
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </CardContent>
              </div>
              <CardFooter className="p-4 pt-0 border-t border-[#f4f6f3] flex justify-end bg-[#fbfcfb]">
                <Button
                  onClick={() => handleDelete(p.id)}
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-none h-9 px-3 flex items-center gap-2 uppercase text-[10px] tracking-widest font-semibold cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remover
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}