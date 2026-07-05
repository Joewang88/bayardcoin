-- BayardCoin CMS Supabase schema
-- Run this in Supabase > SQL Editor.

create table if not exists public.products (
  id text primary key,
  item_number text,
  sku text,
  category text not null,
  status text not null default 'available',
  featured boolean not null default false,
  title text not null,
  country text,
  province text,
  denomination text,
  year text,
  variety text,
  certification text,
  grading_service text,
  grade text,
  cert_number text,
  cert_link text,
  price numeric,
  currency text default 'USD',
  description text,
  images jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "Public can view products" on public.products;
create policy "Public can view products" on public.products for select using (true);

drop policy if exists "Authenticated admin can insert products" on public.products;
create policy "Authenticated admin can insert products" on public.products for insert to authenticated with check (true);

drop policy if exists "Authenticated admin can update products" on public.products;
create policy "Authenticated admin can update products" on public.products for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated admin can delete products" on public.products;
create policy "Authenticated admin can delete products" on public.products for delete to authenticated using (true);

create or replace function public.set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end; $$ language plpgsql;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products for each row execute function public.set_updated_at();

insert into public.products (
  id, item_number, sku, category, status, featured, title, country, province,
  denomination, year, variety, certification, grading_service, grade, cert_number,
  cert_link, price, currency, images, description
) values (
  '00001', '00001', '00001', 'chinese-machine-struck-coins', 'available', true,
  'CHINA. Yunnan. Tael, ND (1943–44)', 'China', 'Yunnan', 'Tael', 'ND (1943–44)',
  'Small stag''s head', 'PCGS', 'PCGS', 'AU-58', '42439997',
  'https://www.pcgs.com/cert/42439997', 6000.00, 'USD',
  '["assets/products/chinese-machine-struck/00001-1.jpg", "assets/products/chinese-machine-struck/00001-2.jpg", "assets/products/chinese-machine-struck/00001-3.jpg"]'::jsonb,
  'Variety with small stag''s head. A lovely Mint State Tael, displaying softly glowing luster and attractive, balanced coloration. Strong cartwheel luster radiates across both surfaces, enhancing the overall eye appeal.'
) on conflict (id) do update set
  title = excluded.title,
  category = excluded.category,
  status = excluded.status,
  featured = excluded.featured,
  images = excluded.images;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images" on storage.objects for select using (bucket_id = 'product-images');

drop policy if exists "Authenticated admin can upload product images" on storage.objects;
create policy "Authenticated admin can upload product images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images');

drop policy if exists "Authenticated admin can update product images" on storage.objects;
create policy "Authenticated admin can update product images" on storage.objects for update to authenticated using (bucket_id = 'product-images') with check (bucket_id = 'product-images');

drop policy if exists "Authenticated admin can delete product images" on storage.objects;
create policy "Authenticated admin can delete product images" on storage.objects for delete to authenticated using (bucket_id = 'product-images');
