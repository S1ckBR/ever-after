import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("data.id") || searchParams.get("id");

    // Se não achou na URL, tenta ler o Corpo (Body) da requisição
    if (!id) {
      try {
        const body = await request.json();
        id = body?.data?.id || body?.id;
      } catch (e) {
        // Ignora erro se o body vier vazio
      }
    }

    // Se chegou aqui sem ID, responde 200 para o MP não ficar travado
    if (!id) {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // 2. Busca o Access Token do Mercado Pago salvo nas Configurações Gerais
    const { data: config, error: configError } = await supabase
      .from("configuracoes")
      .select("mp_access_token")
      .single();

    if (configError || !config?.mp_access_token) {
      console.error("Erro: Token MP não configurado no Supabase.");
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
        const emailConvidado = paymentData.payer?.email || "";
        const valorPago = paymentData.transaction_amount || 0;

        // Busca a quantidade atual de cotas compradas daquele presente
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

          // Atualiza as cotas no presente
          await supabase
            .from("presentes")
            .update({ cotas_compradas: novasCotasCompradas })
            .eq("id", presenteId);
        }

        // Registra o recibo na tabela
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