import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { presenteId, nomeConvidado, emailConvidado, quantidadeCotas } = await request.json();

    // 1. Busca os dados do presente no banco de dados
    const { data: presente, error: presenteError } = await supabase
      .from("presentes")
      .select("*")
      .eq("id", presenteId)
      .single();

    if (presenteError || !presente) {
      return NextResponse.json({ error: "Presente não encontrado." }, { status: 404 });
    }

    // 2. Busca o Access Token do Mercado Pago
    const { data: config, error: configError } = await supabase
      .from("configuracoes")
      .select("mp_access_token")
      .single();

    if (configError || !config?.mp_access_token) {
      return NextResponse.json(
        { error: "Integração com o Mercado Pago não configurada." },
        { status: 500 }
      );
    }

    // Calcula o valor
    const valorUnitarioCota = Number(presente.valor_total) / presente.total_cotas;
    const valorTotalPagamento = valorUnitarioCota * Number(quantidadeCotas);

    // 3. Inicializa o Mercado Pago
    const client = new MercadoPagoConfig({ accessToken: config.mp_access_token });
    const preference = new Preference(client);

    // URL base oficial do seu site configurada diretamente
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.casamentotk.com.br";

    // 4. Cria a preferência de checkout
    const preferenceResponse = await preference.create({
      body: {
        items: [
          {
            id: presenteId,
            title: `Presente: ${presente.nome} (${quantidadeCotas} cota(s))`,
            quantity: 1,
            unit_price: Number(valorTotalPagamento.toFixed(2)),
            currency_id: "BRL"
          }
        ],
        payer: {
          name: nomeConvidado.split(" ")[0],
          surname: nomeConvidado.split(" ").slice(1).join(" ") || "Convidado",
          email: emailConvidado,
        },
        back_urls: {
          success: `${appUrl}/?status=success`,
          pending: `${appUrl}/?status=pending`,
          failure: `${appUrl}/?status=failure`,
        },
        auto_return: "approved", 
        notification_url: `${appUrl}/api/webhooks/mercadopago`,
        metadata: {
          presente_id: presenteId,
          quantidade_cotas: quantidadeCotas,
          nome_convidado: nomeConvidado,
        }
      }
    });

    return NextResponse.json({
      id: preferenceResponse.id,
      init_point: preferenceResponse.init_point,
    });

  } catch (error: any) {
    console.error("Erro ao gerar checkout:", error);
    return NextResponse.json({ error: error.message || "Erro interno." }, { status: 500 });
  }
}