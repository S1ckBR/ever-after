-- Keep the existing admin UI working through authenticated Supabase clients,
-- while requiring a trusted app_metadata role for database administration.
-- Set app_metadata.role = 'admin' for the account whose ID is ADMIN_USER_ID
-- before applying this migration. Never use user_metadata for authorization.

-- The public homepage reads safe configuration fields through a server-only
-- Supabase client. Public clients must not query this table directly.
revoke all on table public.configuracoes from public, anon, authenticated;
grant select, insert, update on table public.configuracoes to authenticated;
grant select (
  id, nome_noiva, nome_noivo, data_casamento, cor_principal, cor_secundaria,
  cor_botoes, imagem_hero, texto_historia, imagem_historia_1, imagem_historia_2,
  data_limite_rsvp, titulo_cerimonial, subtitulo_cerimonial, imagem_cerimonia,
  cerimonia_data, cerimonia_hora, hora_cerimonia, cerimonia_local, local_cerimonia,
  cerimonia_mapa_url, imagem_recepcao, festa_data, festa_hora, hora_recepcao,
  festa_local, local_recepcao, festa_mapa_url
) on table public.configuracoes to anon;

revoke all on table public.presentes from public, anon, authenticated;
grant select on table public.presentes to anon, authenticated;
grant insert, update, delete on table public.presentes to authenticated;

revoke all on table public.rsvp from public, anon, authenticated;
grant insert on table public.rsvp to anon, authenticated;
grant select, delete on table public.rsvp to authenticated;

revoke all on table public.mensagens from public, anon, authenticated;
grant select, insert on table public.mensagens to anon, authenticated;
grant update, delete on table public.mensagens to authenticated;

revoke all on table public.presentes_recebidos from public, anon, authenticated;
grant select on table public.presentes_recebidos to authenticated;

alter table public.configuracoes enable row level security;
alter table public.presentes enable row level security;
alter table public.rsvp enable row level security;
alter table public.mensagens enable row level security;
alter table public.presentes_recebidos enable row level security;

create policy configuracoes_public_read_safe
  on public.configuracoes
  for select
  to anon
  using (true);

create policy configuracoes_admin_all
  on public.configuracoes
  for all
  to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy presentes_public_read
  on public.presentes
  for select
  to anon, authenticated
  using (true);

create policy presentes_admin_write
  on public.presentes
  for all
  to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy rsvp_public_insert
  on public.rsvp
  for insert
  to anon, authenticated
  with check (true);

create policy rsvp_admin_select
  on public.rsvp
  for select
  to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy rsvp_admin_delete
  on public.rsvp
  for delete
  to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy mensagens_public_read_approved
  on public.mensagens
  for select
  to anon, authenticated
  using (aprovado is true);

create policy mensagens_public_insert_approved
  on public.mensagens
  for insert
  to anon, authenticated
  with check (aprovado is true);

create policy mensagens_admin_all
  on public.mensagens
  for all
  to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy presentes_recebidos_admin_read
  on public.presentes_recebidos
  for select
  to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- checkout_pedidos remains RLS-enabled with direct access limited to service_role.

