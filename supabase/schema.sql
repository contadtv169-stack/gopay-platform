-- GoPay Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text not null,
  business_name text,
  phone text,
  document text,
  avatar_url text,
  plan text default 'starter',
  balance bigint default 0,
  available_balance bigint default 0,
  pending_balance bigint default 0,
  total_revenue bigint default 0,
  total_transactions int default 0,
  two_factor_enabled boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Payment links table
create table if not exists payment_links (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  description text,
  amount bigint not null,
  type text default 'fixed',
  slug text unique not null,
  clicks int default 0,
  conversions int default 0,
  revenue bigint default 0,
  status text default 'active',
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Checkouts table
create table if not exists checkouts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  products jsonb not null default '[]',
  order_bump jsonb,
  upsell jsonb,
  status text default 'active',
  conversions int default 0,
  revenue bigint default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Landing pages table
create table if not exists landing_pages (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  slug text unique not null,
  template text default 'saas',
  content jsonb default '{}',
  status text default 'draft',
  views int default 0,
  conversions int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Digital plates table
create table if not exists digital_plates (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  business_name text not null,
  pix_key text not null,
  theme text default 'neon-blue',
  amount bigint,
  plate_type text default 'loja',
  logo_url text,
  social_links jsonb default '[]',
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Transactions table
create table if not exists transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  type text not null,
  description text not null,
  amount bigint not null,
  status text default 'pending',
  payment_method text,
  reference_id text,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- Webhooks table
create table if not exists webhooks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  url text not null,
  events jsonb default '["payment.completed", "payment.pending"]',
  active boolean default true,
  created_at timestamptz default now()
);

-- API keys table
create table if not exists api_keys (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  key text unique not null default ('gopay_sk_' || encode(gen_random_bytes(32), 'hex')),
  name text default 'Default',
  active boolean default true,
  created_at timestamptz default now()
);

-- Row Level Security (RLS)
alter table profiles enable row level security;
alter table payment_links enable row level security;
alter table checkouts enable row level security;
alter table landing_pages enable row level security;
alter table digital_plates enable row level security;
alter table transactions enable row level security;
alter table webhooks enable row level security;
alter table api_keys enable row level security;

-- Profiles policies
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Payment links policies
create policy "Users can view own payment links" on payment_links for select using (auth.uid() = user_id);
create policy "Users can create payment links" on payment_links for insert with check (auth.uid() = user_id);
create policy "Users can update own payment links" on payment_links for update using (auth.uid() = user_id);
create policy "Users can delete own payment links" on payment_links for delete using (auth.uid() = user_id);
create policy "Public can view active payment links" on payment_links for select using (status = 'active');

-- Checkouts policies
create policy "Users can manage own checkouts" on checkouts for all using (auth.uid() = user_id);

-- Landing pages policies
create policy "Users can manage own landing pages" on landing_pages for all using (auth.uid() = user_id);
create policy "Public can view published landing pages" on landing_pages for select using (status = 'published');

-- Digital plates policies
create policy "Users can manage own plates" on digital_plates for all using (auth.uid() = user_id);

-- Transactions policies
create policy "Users can view own transactions" on transactions for select using (auth.uid() = user_id);
create policy "Users can insert own transactions" on transactions for insert with check (auth.uid() = user_id);

-- Webhooks policies
create policy "Users can manage own webhooks" on webhooks for all using (auth.uid() = user_id);

-- API keys policies
create policy "Users can manage own api keys" on api_keys for all using (auth.uid() = user_id);

-- Functions
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, name, email, business_name)
  values (new.id, new.raw_user_meta_data->>'name', new.email, new.raw_user_meta_data->>'business_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger on new user signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Function to update balance on payment
create or replace function process_payment()
returns trigger as $$
declare
  fee_amount bigint;
  net_amount bigint;
begin
  if new.type = 'income' and new.status = 'completed' then
    fee_amount := (new.amount * 5) / 100;
    net_amount := new.amount - fee_amount;
    
    update profiles
    set
      balance = balance + net_amount,
      available_balance = available_balance + net_amount,
      total_revenue = total_revenue + new.amount,
      total_transactions = total_transactions + 1
    where id = new.user_id;
    
    -- Insert fee transaction
    insert into transactions (user_id, type, description, amount, status, created_at)
    values (new.user_id, 'fee', 'Taxa GoPay (5%)', -fee_amount, 'completed', now());
  end if;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_transaction_completed
  after insert on transactions
  for each row execute procedure process_payment();

-- Indexes
create index idx_payment_links_user_id on payment_links(user_id);
create index idx_payment_links_slug on payment_links(slug);
create index idx_checkouts_user_id on checkouts(user_id);
create index idx_landing_pages_user_id on landing_pages(user_id);
create index idx_landing_pages_slug on landing_pages(slug);
create index idx_digital_plates_user_id on digital_plates(user_id);
create index idx_transactions_user_id on transactions(user_id);
create index idx_transactions_created_at on transactions(created_at desc);
