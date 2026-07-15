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

    // 2. Busca o Access Token do Mercado Pago salvo nas Configurações Gerais
    const { data: config, error: configError } = await supabase
      .from("configuracoes")
      .select("mp_access_token")
      .single();

    if (configError || !config?.mp_access_token) {
      return NextResponse.json(
        { error: "Integração com o Mercado Pago não configurada no painel administrativo." },
        { status: 500 }
      );
    }

    // Calcula o valor unitário da cota e o valor total a ser pago
    const valorUnitarioCota = Number(presente.valor_total) / presente.total_cotas;
    const valorTotalPagamento = valorUnitarioCota * Number(quantidadeCotas);

    // 3. Inicializa o cliente do Mercado Pago
    const client = new MercadoPagoConfig({ accessToken: config.mp_access_token });
    const preference = new Preference(client);

    // Pegamos a URL base do seu site para redirecionar o convidado de volta após o pagamento
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // 4. Cria a preferência de checkout com suporte a Cartão e Pix
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
        // Configura as URLs de retorno para voltar ao site do casamento após pagar
        back_urls: {
          success: `${appUrl}/`,
          pending: `${appUrl}/`,
          failure: `${appUrl}/`,
        },
        // Removemos o auto_return para evitar a validação rígida de HTTPS localmente
        metadata: {
          presente_id: presenteId,
          quantidade_cotas: quantidadeCotas,
          nome_convidado: nomeConvidado,
        }
      }
    });

    // Retorna o link de pagamento do Mercado Pago (init_point)
    return NextResponse.json({
      id: preferenceResponse.id,
      init_point: preferenceResponse.init_point, // Link para redirecionar o convidado
    });

  } catch (error: any) {
    console.error("Erro ao gerar checkout:", error);
    return NextResponse.json({ error: error.message || "Erro interno do servidor." }, { status: 500 });
  }
}