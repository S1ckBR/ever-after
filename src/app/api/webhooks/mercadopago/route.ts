import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    // 1. O Mercado Pago pode enviar os dados na URL ou no Corpo (Body) do POST
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("data.id") || searchParams.get("id");
    let type = searchParams.get("type") || searchParams.get("topic");

    // Se não achou na URL, tenta ler o Body da requisição (padrão dos Webhooks do MP)
    if (!id) {
      try {
        const body = await request.json();
        id = body?.data?.id || body?.id;
        type = body?.type || body?.topic;
      } catch (e) {
        // Ignora erro se o body vier vazio
      }
    }

    // Se não for uma notificação de pagamento válida, devolve 200 para o MP parar de insistir
    if (type !== "payment" || !id) {
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

    // 5. O Mercado Pago exige que retornemos status 200 para confirmar o recebimento do aviso
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error("Erro no Webhook do Mercado Pago:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}