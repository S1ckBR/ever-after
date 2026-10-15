"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, CreditCard, ArrowRight, ChevronLeft, ShieldCheck, WalletCards } from "lucide-react";

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

type Provedor = "mercadopago" | "infinitepay";

const formatarMoeda = (valor: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

export default function CheckoutModal({ presente, onClose }: CheckoutModalProps) {
  const [loading, setLoading] = useState<Provedor | null>(null);
  const [etapa, setEtapa] = useState<"dados" | "checkout">("dados");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cotas, setCotas] = useState(1);
  const [erro, setErro] = useState("");

  const valorCotaUnitaria = presente.valor_total / presente.total_cotas;
  const valorTotal = Math.round((Number(presente.valor_total) * 100 * cotas) / presente.total_cotas) / 100;
  const cotasRestantes = Math.max(0, presente.total_cotas - presente.cotas_compradas);

  const handleEscolherCheckout = async (provedor: Provedor) => {
    setLoading(provedor);
    setErro("");

    try {
      const endpoint = provedor === "mercadopago" ? "/api/checkout" : "/api/checkout/infinitepay";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          presenteId: presente.id,
          nomeConvidado: nome.trim(),
          emailConvidado: email.trim(),
          quantidadeCotas: cotas,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Não foi possível iniciar o pagamento.");
      }

      const checkoutUrl = provedor === "mercadopago" ? data.init_point : data.checkout_url;
      if (typeof checkoutUrl !== "string" || !checkoutUrl.startsWith("https://")) {
        throw new Error("O provedor não retornou um link de pagamento válido.");
      }

      window.location.assign(checkoutUrl);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Ocorreu um erro ao iniciar o pagamento.");
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md bg-white border border-[#e1e9dc] p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 text-[#607d5b] hover:text-[#3b5336] p-1 cursor-pointer transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center space-y-1.5 pr-5 pl-5">
          <span className="text-[10px] tracking-wider uppercase text-[#607d5b] font-semibold">
            Você escolheu presentear
          </span>
          <h3 className="font-serif text-xl text-[#3b5336] font-light">{presente.nome}</h3>
          {presente.descricao && etapa === "dados" && (
            <p className="text-xs text-[#607d5b] font-serif italic bg-[#f7f9f5] p-3 border border-[#e1e9dc] my-2 text-left leading-relaxed">
              &ldquo;{presente.descricao}&rdquo;
            </p>
          )}
          <p className="text-xs text-[#607d5b] font-serif italic">
            Cota unitária: {formatarMoeda(valorCotaUnitaria)}
          </p>
        </div>

        <div className="h-px bg-[#f4f6f3]" />

        {etapa === "dados" ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setErro("");
              setEtapa("checkout");
            }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-[#607d5b]">Seu nome completo</label>
              <input
                type="text"
                required
                minLength={2}
                maxLength={160}
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                autoComplete="name"
                placeholder="Ex: João da Silva"
                className="w-full text-sm border border-[#e1e9dc] p-3 rounded-none focus:outline-none focus:border-[#3b5336]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-[#607d5b]">Seu e-mail</label>
              <input
                type="email"
                required
                maxLength={254}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                placeholder="Ex: joao@email.com"
                className="w-full text-sm border border-[#e1e9dc] p-3 rounded-none focus:outline-none focus:border-[#3b5336]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center gap-3">
                <label className="text-xs uppercase tracking-wider text-[#607d5b]">Quantidade de cotas</label>
                <span className="text-[10px] text-[#607d5b] italic">{cotasRestantes} restante(s)</span>
              </div>
              <input
                type="number"
                min={1}
                max={cotasRestantes}
                required
                value={cotas}
                onChange={(event) => setCotas(Number(event.target.value))}
                className="w-full text-sm border border-[#e1e9dc] p-3 rounded-none focus:outline-none focus:border-[#3b5336]"
              />
            </div>

            <div className="bg-[#f7f9f5] p-3 flex justify-between items-center border border-[#e1e9dc]">
              <span className="text-xs text-[#607d5b] uppercase tracking-wider font-semibold">Valor total</span>
              <span className="font-serif text-lg text-[#3b5336] font-bold">{formatarMoeda(valorTotal)}</span>
            </div>

            <Button
              type="submit"
              disabled={cotasRestantes < 1 || !Number.isInteger(cotas) || cotas < 1 || cotas > cotasRestantes}
              className="w-full bg-[#3b5336] hover:bg-[#4e6b48] text-white rounded-none py-6 text-xs tracking-widest uppercase font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              Escolher forma de pagamento <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="bg-[#f7f9f5] p-3 flex justify-between items-center border border-[#e1e9dc]">
              <span className="text-xs text-[#607d5b] uppercase tracking-wider font-semibold">
                {cotas} cota(s)
              </span>
              <span className="font-serif text-lg text-[#3b5336] font-bold">{formatarMoeda(valorTotal)}</span>
            </div>

            <p className="text-center text-xs text-[#607d5b]">Escolha onde deseja concluir seu pagamento:</p>

            <button
              type="button"
              disabled={loading !== null}
              onClick={() => handleEscolherCheckout("mercadopago")}
              className="w-full border border-[#d9e2d3] p-4 text-left hover:border-[#3b5336] hover:bg-[#f7f9f5] disabled:opacity-60 transition-colors"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center bg-[#e6eee2] text-[#3b5336]">
                  {loading === "mercadopago" ? <span className="animate-spin">◌</span> : <CreditCard className="h-5 w-5" />}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-[#3b5336]">Mercado Pago</span>
                  <span className="block text-xs text-[#71806d] mt-1">Cartão de crédito e Pix</span>
                </span>
                <ArrowRight className="h-4 w-4 text-[#71806d]" />
              </span>
            </button>

            <button
              type="button"
              disabled={loading !== null}
              onClick={() => handleEscolherCheckout("infinitepay")}
              className="w-full border border-[#d9e2d3] p-4 text-left hover:border-[#3b5336] hover:bg-[#f7f9f5] disabled:opacity-60 transition-colors"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center bg-[#e6eee2] text-[#3b5336]">
                  {loading === "infinitepay" ? <span className="animate-spin">◌</span> : <WalletCards className="h-5 w-5" />}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-[#3b5336]">InfinitePay</span>
                  <span className="block text-xs text-[#71806d] mt-1">Cartão de crédito e Pix</span>
                </span>
                <ArrowRight className="h-4 w-4 text-[#71806d]" />
              </span>
            </button>

            <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#71806d]">
              <ShieldCheck className="h-3.5 w-3.5" /> Pagamento processado em ambiente seguro
            </p>

            {erro && <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 p-3">{erro}</p>}

            <button
              type="button"
              disabled={loading !== null}
              onClick={() => { setErro(""); setEtapa("dados"); }}
              className="w-full flex items-center justify-center gap-2 text-xs text-[#607d5b] hover:text-[#3b5336] py-2 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" /> Voltar e editar os dados
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
