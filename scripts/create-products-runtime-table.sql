create extension if not exists pgcrypto;

create or replace function public.set_current_timestamp_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.products_runtime (
  id uuid primary key default gen_random_uuid(),
  sanity_product_id text,
  product_id text,
  slug text,
  sku text,
  price numeric,
  compare_at_price numeric,
  stock integer not null default 0 check (stock >= 0),
  inventory integer,
  sales_count integer not null default 0 check (sales_count >= 0),
  status text not null default 'publish' check (status in ('publish', 'unpublish', 'draft', 'archived')),
  is_available boolean not null default true,
  featured boolean not null default false,
  channels text[] not null default '{}',
  display_variants jsonb not null default '[]'::jsonb,
  variants jsonb not null default '[]'::jsonb,
  display_category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_runtime_sanity_product_id_idx
  on public.products_runtime(sanity_product_id);

create index if not exists products_runtime_product_id_idx
  on public.products_runtime(product_id);

create index if not exists products_runtime_slug_idx
  on public.products_runtime(slug);

create index if not exists products_runtime_sku_idx
  on public.products_runtime(sku);

create index if not exists products_runtime_status_idx
  on public.products_runtime(status);

drop trigger if exists products_runtime_set_updated_at on public.products_runtime;
create trigger products_runtime_set_updated_at
before update on public.products_runtime
for each row
execute function public.set_current_timestamp_updated_at();

alter table public.products_runtime enable row level security;

drop policy if exists "products_runtime_select" on public.products_runtime;
create policy "products_runtime_select"
on public.products_runtime
for select
to anon, authenticated
using (true);

drop policy if exists "products_runtime_insert" on public.products_runtime;
create policy "products_runtime_insert"
on public.products_runtime
for insert
to anon, authenticated
with check (true);

drop policy if exists "products_runtime_update" on public.products_runtime;
create policy "products_runtime_update"
on public.products_runtime
for update
to anon, authenticated
using (true)
with check (true);

grant select, insert, update on public.products_runtime to anon, authenticated;

do $$
begin
  alter publication supabase_realtime add table public.products_runtime;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;

notify pgrst, 'reload schema';
