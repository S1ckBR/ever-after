import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("data.id") || searchParams.get("id");
    let type = searchParams.get("type") || searchParams.get("topic");

    if (!id) {
      try {
        const body = await request.json();
        id = body?.data?.id || body?.id;
        type = body?.type || body?.topic;
      } catch (e) {
        // Ignora erro se o body vier vazio
      }
    }

    if (type !== "payment" || !id) {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const { data: config, error: configError } = await supabase
      .from("configuracoes")
      .select("mp_access_token")
      .single();

    if (configError || !config?.mp_access_token) {
      return NextResponse.json({ error: "Token MP não configurado" }, { status: 500 });
    }

    const client = new MercadoPagoConfig({ accessToken: config.mp_access_token });
    const payment = new Payment(client);
    const paymentData = await payment.get({ id: String(id) });

    if (paymentData.status === "approved") {
      const { metadata } = paymentData;

      if (metadata && metadata.presente_id && metadata.quantidade_cotas) {
        const presenteId = metadata.presente_id;
        const quantidadeComprada = Number(metadata.quantidade_cotas);
        const nomeConvidado = metadata.nome_convidado || "Convidado Anônimo";
        const emailConvidado = paymentData.payer?.email || "";
        const valorPago = paymentData.transaction_amount || 0;

        // 1. Atualiza a quantidade de cotas no presente
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

        // 2. REGISTRA QUEM DEU O PRESENTE NA NOVA TABELA
        const { error: insertError } = await supabase
          .from("presentes_recebidos")
          .insert({
            presente_id: presenteId,
            nome_convidado: nomeConvidado,
            email_convidado: emailConvidado,
            quantidade_cotas: quantidadeComprada,
            valor_pago: valorPago,
            mp_payment_id: String(id)
          });

        if (insertError) {
          console.error("Erro ao registrar o recibo do presente:", insertError);
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error("Erro no Webhook:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}