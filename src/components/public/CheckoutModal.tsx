"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, CreditCard, ArrowRight } from "lucide-react";

interface Presente {
  id: string;
  nome: string;
  descricao?: string;
  valor_total: number;
  total_cotas: number;
  cotas_compradas: number;
}

interface CheckoutModalProps {
  presente: Presente;
  onClose: () => void;
}

export default function CheckoutModal({ presente, onClose }: CheckoutModalProps) {
  const [loading, setLoading] = useState(false);

  // Dados do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cotas, setCotas] = useState(1);

  const valorCotaUnitaria = presente.valor_total / presente.total_cotas;
  const valorTotal = valorCotaUnitaria * cotas;
  const cotasRestantes = presente.total_cotas - presente.cotas_compradas;

  const handlePagar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          presenteId: presente.id,
          nomeConvidado: nome,
          emailConvidado: email,
          quantidadeCotas: cotas,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao gerar checkout.");
      }

      // Redireciona o convidado diretamente para a tela de pagamento segura do Mercado Pago
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        throw new Error("Link de pagamento inválido.");
      }

    } catch (err: any) {
      alert(err.message || "Ocorreu um erro ao processar o seu pagamento.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md bg-white border border-[#e1e9dc] p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#607d5b] hover:text-[#3b5336] p-1 cursor-pointer transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <form onSubmit={handlePagar} className="space-y-4">
          <div className="text-center space-y-1.5">
            <span className="text-[10px] tracking-wider uppercase text-[#607d5b] font-semibold">Você escolheu presentear</span>
            <h3 className="font-serif text-xl text-[#3b5336] font-light">{presente.nome}</h3>
            
            {/* Descrição do Presente */}
            {presente.descricao && (
              <p className="text-xs text-[#607d5b] font-serif italic bg-[#f7f9f5] p-3 border border-[#e1e9dc] my-2 text-left leading-relaxed">
                &ldquo;{presente.descricao}&rdquo;
              </p>
            )}

            <p className="text-xs text-[#607d5b] font-serif italic">
              Cota unitária: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valorCotaUnitaria)}
            </p>
          </div>

          <div className="h-[1px] bg-[#f4f6f3]" />

          <div className="space-y-3">
            {/* Nome */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-[#607d5b]">Seu Nome Completo</label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: João da Silva"
                className="w-full text-sm border border-[#e1e9dc] p-3 rounded-none focus:outline-none focus:border-[#3b5336]"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-[#607d5b]">Seu E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: joao@email.com"
                className="w-full text-sm border border-[#e1e9dc] p-3 rounded-none focus:outline-none focus:border-[#3b5336]"
              />
            </div>

            {/* Quantidade de Cotas */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase tracking-wider text-[#607d5b]">Quantidade de Cotas</label>
                <span className="text-[10px] text-[#607d5b] italic">{cotasRestantes} cota(s) restante(s)</span>
              </div>
              <input
                type="number"
                min={1}
                max={cotasRestantes}
                required
                value={cotas}
                onChange={(e) => setCotas(Number(e.target.value))}
                className="w-full text-sm border border-[#e1e9dc] p-3 rounded-none focus:outline-none focus:border-[#3b5336]"
              />
            </div>
          </div>

          <div className="bg-[#f7f9f5] p-3 flex justify-between items-center border border-[#e1e9dc]">
            <span className="text-xs text-[#607d5b] uppercase tracking-wider font-semibold">Valor Total:</span>
            <span className="font-serif text-lg text-[#3b5336] font-bold">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valorTotal)}
            </span>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3b5336] hover:bg-[#4e6b48] text-white rounded-none py-6 text-xs tracking-widest uppercase font-semibold flex items-center justify-center gap-2 cursor-pointer"
          >
            <CreditCard className="h-4 w-4" />
            {loading ? "Redirecionando..." : "Pagar com Cartão ou Pix"} <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}