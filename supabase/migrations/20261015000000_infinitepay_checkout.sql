-- InfinitePay checkout support. Pending orders are private and only accessed by server-side service_role.
create table if not exists public.checkout_pedidos (
  id uuid primary key default gen_random_uuid(),
  order_nsu text not null unique,
  presente_id uuid not null references public.presentes(id) on delete restrict,
  nome_convidado text not null,
  email_convidado text not null,
  quantidade_cotas integer not null check (quantidade_cotas > 0),
  valor_centavos integer not null check (valor_centavos > 0),
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  transaction_nsu text unique,
  invoice_slug text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

alter table public.checkout_pedidos enable row level security;
revoke all on table public.checkout_pedidos from anon, authenticated;
grant select, insert, update, delete on table public.checkout_pedidos to service_role;

create index if not exists checkout_pedidos_presente_status_idx
  on public.checkout_pedidos (presente_id, status, created_at desc);

create or replace function public.confirm_infinitepay_checkout(
  p_order_nsu text,
  p_transaction_nsu text,
  p_invoice_slug text,
  p_amount_cents integer
)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  pedido public.checkout_pedidos%rowtype;
  presente public.presentes%rowtype;
  receipt_id uuid;
begin
  select * into pedido
  from public.checkout_pedidos
  where order_nsu = p_order_nsu
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'reason', 'order_not_found');
  end if;

  if pedido.status = 'paid' then
    if pedido.transaction_nsu = p_transaction_nsu then
      return jsonb_build_object('ok', true, 'duplicate', true);
    end if;
    return jsonb_build_object('ok', false, 'reason', 'order_already_paid');
  end if;

  if pedido.status <> 'pending' then
    return jsonb_build_object('ok', false, 'reason', 'order_not_pending');
  end if;

  if pedido.valor_centavos <> p_amount_cents then
    return jsonb_build_object('ok', false, 'reason', 'amount_mismatch');
  end if;

  select * into presente
  from public.presentes
  where id = pedido.presente_id
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'reason', 'gift_not_found');
  end if;

  insert into public.presentes_recebidos (
    presente_id,
    nome_convidado,
    email_convidado,
    quantidade_cotas,
    valor_pago,
    mp_payment_id
  )
  values (
    pedido.presente_id,
    pedido.nome_convidado,
    pedido.email_convidado,
    pedido.quantidade_cotas,
    p_amount_cents::numeric / 100,
    'infinitepay:' || p_transaction_nsu
  )
  on conflict (mp_payment_id) do nothing
  returning id into receipt_id;

  if receipt_id is null then
    return jsonb_build_object('ok', false, 'reason', 'transaction_already_registered');
  end if;

  update public.presentes
  set cotas_compradas = least(
    coalesce(cotas_compradas, 0) + pedido.quantidade_cotas,
    total_cotas
  )
  where id = pedido.presente_id;

  update public.checkout_pedidos
  set status = 'paid',
      transaction_nsu = p_transaction_nsu,
      invoice_slug = p_invoice_slug,
      paid_at = now()
  where id = pedido.id;

  return jsonb_build_object('ok', true, 'duplicate', false);
end;
$$;

revoke all on function public.confirm_infinitepay_checkout(text, text, text, integer) from public, anon, authenticated;
grant execute on function public.confirm_infinitepay_checkout(text, text, text, integer) to service_role;
