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

create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_slug text,
  sanity_product_id text,
  product_title_snapshot text not null,
  product_image_snapshot text,
  customer_id uuid,
  customer_name text not null,
  customer_email text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  recommendation text not null default 'yes' check (recommendation in ('yes', 'no')),
  headline text not null,
  body text not null,
  status text not null default 'pending' check (status in ('pending', 'published', 'hidden')),
  helpful_yes integer not null default 0,
  helpful_no integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_review_replies (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.product_reviews(id) on delete cascade,
  admin_id uuid,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists product_reviews_slug_idx
  on public.product_reviews(product_slug);

create index if not exists product_reviews_status_idx
  on public.product_reviews(status);

create index if not exists product_reviews_created_at_idx
  on public.product_reviews(created_at desc);

create index if not exists product_review_replies_review_id_idx
  on public.product_review_replies(review_id);

drop trigger if exists product_reviews_set_updated_at on public.product_reviews;
create trigger product_reviews_set_updated_at
before update on public.product_reviews
for each row
execute function public.set_current_timestamp_updated_at();

drop trigger if exists product_review_replies_set_updated_at on public.product_review_replies;
create trigger product_review_replies_set_updated_at
before update on public.product_review_replies
for each row
execute function public.set_current_timestamp_updated_at();
