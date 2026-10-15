import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

const appUrl = () =>
  (process.env.NEXT_PUBLIC_APP_URL || "https://www.casamentotk.com.br").replace(/\/$/, "");

export async function POST(request: Request) {
  let orderNsu: string | null = null;
  let supabase: ReturnType<typeof getSupabaseAdmin> | null = null;

  try {
    supabase = getSupabaseAdmin();
    const body = await request.json();
    const presenteId = typeof body.presenteId === "string" ? body.presenteId : "";
    const nomeConvidado = typeof body.nomeConvidado === "string" ? body.nomeConvidado.trim() : "";
    const emailConvidado = typeof body.emailConvidado === "string" ? body.emailConvidado.trim().toLowerCase() : "";
    const quantidadeCotas = Number(body.quantidadeCotas);

    if (
      !presenteId ||
      nomeConvidado.length < 2 ||
      nomeConvidado.length > 160 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailConvidado) ||
      emailConvidado.length > 254 ||
      !Number.isInteger(quantidadeCotas) ||
      quantidadeCotas < 1 ||
      quantidadeCotas > 100
    ) {
      return NextResponse.json({ error: "Confira o nome, e-mail e quantidade de cotas." }, { status: 400 });
    }

    const handle = process.env.INFINITEPAY_HANDLE?.trim().replace(/^\$/, "");
    if (!handle) {
      return NextResponse.json({ error: "O checkout InfinitePay ainda não foi configurado." }, { status: 503 });
    }

    orderNsu = randomUUID();
    const { data: orderResult, error: orderError } = await supabase.rpc("create_infinitepay_order", {
      p_order_nsu: orderNsu,
      p_presente_id: presenteId,
      p_nome_convidado: nomeConvidado,
      p_email_convidado: emailConvidado,
      p_quantidade_cotas: quantidadeCotas,
    });

    if (orderError) {
      console.error("Erro ao reservar cotas para InfinitePay:", orderError.message);
      return NextResponse.json({ error: "Não foi possível iniciar o pagamento. Tente novamente." }, { status: 500 });
    }

    if (!orderResult?.ok) {
      const status = orderResult?.reason === "gift_not_found" ? 404 : 409;
      const message = orderResult?.reason === "not_enough_quotas"
        ? "Não há cotas suficientes disponíveis para esse presente."
        : orderResult?.reason === "gift_not_found"
          ? "Presente não encontrado."
          : "Confira os dados informados e tente novamente.";
      return NextResponse.json({ error: message }, { status });
    }

    const amountCents = Number(orderResult.amount_cents);
    if (!Number.isInteger(amountCents) || amountCents < 1) {
      await supabase.from("checkout_pedidos").update({ status: "failed" }).eq("order_nsu", orderNsu);
      return NextResponse.json({ error: "Valor de pagamento inválido." }, { status: 500 });
    }

    const origin = appUrl();
    const response = await fetch("https://api.checkout.infinitepay.io/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        handle,
        order_nsu: orderNsu,
        redirect_url: `${origin}/?payment=processing`,
        webhook_url: `${origin}/api/webhooks/infinitepay`,
        customer: { name: nomeConvidado, email: emailConvidado },
        items: [{
          quantity: 1,
          price: amountCents,
          description: `Presente: ${presenteId} — ${quantidadeCotas} cota(s)`,
        }],
      }),
      signal: AbortSignal.timeout(15000),
    });

    const providerData = await response.json().catch(() => null);
    const checkoutUrl = providerData?.url;

    if (!response.ok || typeof checkoutUrl !== "string") {
      console.error("InfinitePay não criou o link de checkout:", response.status);
      await supabase.from("checkout_pedidos").update({ status: "failed" }).eq("order_nsu", orderNsu);
      return NextResponse.json({ error: "A InfinitePay não conseguiu gerar o link. Tente novamente." }, { status: 502 });
    }

    const parsedUrl = new URL(checkoutUrl);
    if (parsedUrl.protocol !== "https:" || !["checkout.infinitepay.com.br"].includes(parsedUrl.hostname)) {
      console.error("InfinitePay retornou uma URL de checkout inesperada.");
      await supabase.from("checkout_pedidos").update({ status: "failed" }).eq("order_nsu", orderNsu);
      return NextResponse.json({ error: "Não foi possível validar o link de pagamento." }, { status: 502 });
    }

    return NextResponse.json({ checkout_url: checkoutUrl });
  } catch (error) {
    console.error("Erro ao criar checkout InfinitePay:", error instanceof Error ? error.message : "erro desconhecido");
    if (orderNsu && supabase) {
      await supabase.from("checkout_pedidos").update({ status: "failed" }).eq("order_nsu", orderNsu);
    }
    return NextResponse.json({ error: "Erro interno ao iniciar o pagamento." }, { status: 500 });
  }
}
