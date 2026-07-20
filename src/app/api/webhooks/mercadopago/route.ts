import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("data.id") || searchParams.get("id");

    if (!id) {
      try {
        const body = await request.json();
        id = body?.data?.id || body?.id;
      } catch (e) {
        // Ignora erro se o body vier vazio
      }
    }

    // Se não veio ID ou se for um ID de simulação do painel do MP (começa com PAY0), responde 200 direto
    if (!id || (typeof id === "string" && id.startsWith("PAY0"))) {
      return NextResponse.json({ received: true, simulated: true }, { status: 200 });
    }

    const { data: config, error: configError } = await supabase
      .from("configuracoes")
      .select("mp_access_token")
      .single();

    if (configError || !config?.mp_access_token) {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const client = new MercadoPagoConfig({ accessToken: config.mp_access_token });
    const payment = new Payment(client);

    let paymentData;
    try {
      paymentData = await payment.get({ id: String(id) });
    } catch (err) {
      // Se o ID real não for encontrado na API, apenas retorna 200 para evitar loop de erro
      return NextResponse.json({ received: true }, { status: 200 });
    }

    if (paymentData && paymentData.status === "approved") {
      const { metadata } = paymentData;

      if (metadata && metadata.presente_id && metadata.quantidade_cotas) {
        const presenteId = metadata.presente_id;
        const quantidadeComprada = Number(metadata.quantidade_cotas);
        const nomeConvidado = metadata.nome_convidado || "Convidado Anônimo";
        const emailConvidado = paymentData.payer?.email || "";
        const valorPago = paymentData.transaction_amount || 0;

        const { data: presente, error: fetchError } = await supabase
          .from("presentes")
          .select("cotas_compradas, total_cotas")
          .eq("id", presenteId)
          .single();

        if (!fetchError && presente) {
          const novasCotasCompradas = Math.min(
            presente.cotas_compradas + quantidadeComprada,
            presente.total_cotas
          );

          await supabase
            .from("presentes")
            .update({ cotas_compradas: novasCotasCompradas })
            .eq("id", presenteId);
        }

        await supabase
          .from("presentes_recebidos")
          .insert({
            presente_id: presenteId,
            nome_convidado: nomeConvidado,
            email_convidado: emailConvidado,
            quantidade_cotas: quantidadeComprada,
            valor_pago: valorPago,
            mp_payment_id: String(id)
          });
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error("Erro no Webhook:", error);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}