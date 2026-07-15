import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    // 1. O Mercado Pago envia o ID do pagamento no corpo da requisição ou na URL (query string)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("data.id") || searchParams.get("id");
    const type = searchParams.get("type");

    // Nós só queremos processar notificações do tipo 'payment' (pagamento)
    if (type !== "payment" && !id) {
      return NextResponse.json({ received: true });
    }

    // 2. Busca o Access Token do Mercado Pago salvo nas Configurações Gerais
    const { data: config, error: configError } = await supabase
      .from("configuracoes")
      .select("mp_access_token")
      .single();

    if (configError || !config?.mp_access_token) {
      return NextResponse.json({ error: "Token MP não configurado" }, { status: 500 });
    }

    // 3. Inicializa o cliente do Mercado Pago para buscar os detalhes reais deste pagamento
    const client = new MercadoPagoConfig({ accessToken: config.mp_access_token });
    const payment = new Payment(client);

    const paymentData = await payment.get({ id: String(id) });

    // 4. Verifica se o pagamento foi realmente APROVADO
    if (paymentData.status === "approved") {
      const { metadata } = paymentData;

      if (metadata && metadata.presente_id && metadata.quantidade_cotas) {
        const presenteId = metadata.presente_id;
        const quantidadeComprada = Number(metadata.quantidade_cotas);
        const nomeConvidado = metadata.nome_convidado || "Convidado Anônimo";

        // Busca a quantidade atual de cotas compradas daquele presente
        const { data: presente, error: fetchError } = await supabase
          .from("presentes")
          .select("cotas_compradas, total_cotas")
          .eq("id", presenteId)
          .single();

        if (fetchError || !presente) {
          console.error("Presente não encontrado para atualizar:", presenteId);
          return NextResponse.json({ error: "Presente não encontrado" }, { status: 404 });
        }

        // Calcula a nova quantidade de cotas sem ultrapassar o limite total
        const novasCotasCompradas = Math.min(
          presente.cotas_compradas + quantidadeComprada,
          presente.total_cotas
        );

        // Atualiza a quantidade de cotas no Supabase
        const { error: updateError } = await supabase
          .from("presentes")
          .update({ cotas_compradas: novasCotasCompradas })
          .eq("id", presenteId);

        if (updateError) {
          console.error("Erro ao atualizar cotas no Supabase:", updateError);
          return NextResponse.json({ error: "Erro ao atualizar cotas" }, { status: 500 });
        }

        console.log(`Sucesso: ${quantidadeComprada} cota(s) adicionada(s) ao presente ID ${presenteId} por ${nomeConvidado}.`);
      }
    }

    // O Mercado Pago exige que retornemos status 200 ou 201 para confirmar o recebimento do aviso
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error("Erro no Webhook do Mercado Pago:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}