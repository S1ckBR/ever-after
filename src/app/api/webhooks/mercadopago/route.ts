import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    let id: string | null = null;
    const url = new URL(request.url);
    
    id = url.searchParams.get("data.id") || url.searchParams.get("id");

    if (!id) {
      try {
        const body = await request.json();
        id = body?.data?.id || body?.id || body?.resource;
      } catch (e) {
        console.error("Erro ao ler body:", e);
      }
    }

    if (!id || (typeof id === "string" && id.startsWith("PAY0"))) {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const { data: config, error: configError } = await supabase
      .from("configuracoes")
      .select("mp_access_token")
      .single();

    if (configError || !config?.mp_access_token) {
      return NextResponse.json({ error: "Token não configurado" }, { status: 500 });
    }

    const client = new MercadoPagoConfig({ accessToken: config.mp_access_token });
    const payment = new Payment(client);

    const paymentData = await payment.get({ id: String(id) });

    if (paymentData && paymentData.status === "approved") {
      // Verifica se este pagamento já foi registrado para evitar duplicidade
      const { data: existingReceipt } = await supabase
        .from("presentes_recebidos")
        .select("id")
        .eq("mp_payment_id", String(id))
        .single();

      if (!existingReceipt) {
        const metadata = paymentData.metadata || {};
        const presenteId = metadata.presente_id;
        const quantidadeComprada = Number(metadata.quantidade_cotas || 1);
        const nomeConvidado = metadata.nome_convidado || "Convidado Anônimo";
        const emailConvidado = paymentData.payer?.email || "";
        const valorPago = paymentData.transaction_amount || 0;

        if (presenteId) {
          // 1. Busca e atualiza a quantidade de cotas no presente
          const { data: presente } = await supabase
            .from("presentes")
            .select("cotas_compradas, total_cotas")
            .eq("id", presenteId)
            .single();

          if (presente) {
            const novasCotasCompradas = Math.min(
              presente.cotas_compradas + quantidadeComprada,
              presente.total_cotas
            );

            await supabase
              .from("presentes")
              .update({ cotas_compradas: novasCotasCompradas })
              .eq("id", presenteId);
          }

          // 2. Insere o nome e os dados na tabela de recebidos
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
            console.error("Erro ao inserir em presentes_recebidos:", insertError);
          }
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error("Erro no webhook:", error);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}