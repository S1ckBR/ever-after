import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseAdmin();
    const payload = await request.json();
    const orderNsu = typeof payload?.order_nsu === "string" ? payload.order_nsu : "";
    const transactionNsu = typeof payload?.transaction_nsu === "string" ? payload.transaction_nsu : "";
    const invoiceSlug = typeof payload?.invoice_slug === "string" ? payload.invoice_slug : "";
    const amountCents = Number(payload?.amount);

    if (
      !orderNsu ||
      !transactionNsu ||
      !invoiceSlug ||
      !Number.isSafeInteger(amountCents) ||
      amountCents < 1
    ) {
      return NextResponse.json({ success: false, message: "Payload de pagamento inválido." }, { status: 400 });
    }

    const handle = process.env.INFINITEPAY_HANDLE?.trim().replace(/^\$/, "");
    if (!handle) {
      console.error("Webhook InfinitePay recebido sem INFINITEPAY_HANDLE configurado.");
      return NextResponse.json({ success: false, message: "Checkout não configurado." }, { status: 503 });
    }

    const { data: order, error: orderError } = await supabase
      .from("checkout_pedidos")
      .select("order_nsu, valor_centavos, status, transaction_nsu, invoice_slug")
      .eq("order_nsu", orderNsu)
      .maybeSingle();

    if (orderError) {
      console.error("Erro ao buscar pedido InfinitePay:", orderError.message);
      return NextResponse.json({ success: false, message: "Erro ao consultar pedido." }, { status: 500 });
    }
    if (!order) {
      return NextResponse.json({ success: false, message: "Pedido não encontrado." }, { status: 400 });
    }
    if (order.status === "paid") {
      // Only acknowledge a retry for the exact transaction already recorded.
      if (order.transaction_nsu === transactionNsu && order.invoice_slug === invoiceSlug) {
        return NextResponse.json({ success: true, message: null });
      }
      return NextResponse.json({ success: false, message: "Pedido já confirmado com outra transação." }, { status: 400 });
    }
    if (order.status !== "pending" || Number(order.valor_centavos) !== amountCents) {
      return NextResponse.json({ success: false, message: "Pedido ou valor não corresponde." }, { status: 400 });
    }

    // Never trust the webhook alone: ask InfinitePay to confirm this exact order and transaction.
    const verifyResponse = await fetch("https://api.checkout.infinitepay.io/payment_check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        handle,
        order_nsu: orderNsu,
        transaction_nsu: transactionNsu,
        slug: invoiceSlug,
      }),
      signal: AbortSignal.timeout(10000),
    });
    const verification = await verifyResponse.json().catch(() => null);

    if (
      !verifyResponse.ok ||
      verification?.success !== true ||
      verification?.paid !== true ||
      Number(verification?.amount) !== amountCents
    ) {
      console.error("A confirmação do pagamento InfinitePay não foi aprovada para o pedido:", orderNsu);
      return NextResponse.json({ success: false, message: "Pagamento ainda não confirmado." }, { status: 400 });
    }

    const { data: result, error: confirmError } = await supabase.rpc("confirm_infinitepay_checkout", {
      p_order_nsu: orderNsu,
      p_transaction_nsu: transactionNsu,
      p_invoice_slug: invoiceSlug,
      p_amount_cents: amountCents,
    });

    if (confirmError) {
      console.error("Erro ao registrar pagamento InfinitePay:", confirmError.message);
      return NextResponse.json({ success: false, message: "Não foi possível registrar o pagamento." }, { status: 500 });
    }

    if (!result?.ok) {
      console.error("Pagamento InfinitePay não foi registrado:", result?.reason || "motivo desconhecido");
      return NextResponse.json({ success: false, message: "Não foi possível reconciliar o pedido." }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: null });
  } catch (error) {
    console.error("Erro no webhook InfinitePay:", error instanceof Error ? error.message : "erro desconhecido");
    return NextResponse.json({ success: false, message: "Erro ao processar webhook." }, { status: 500 });
  }
}
