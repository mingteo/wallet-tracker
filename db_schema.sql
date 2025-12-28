-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Table: wallet_groups (Reference for grouping wallets like 'Cash', 'Bank', 'E-Wallet')
create table public.wallet_groups (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  icon text, -- e.g. 'bank', 'wallet', 'credit-card' (lucide icon name or emoji)
  created_at timestamptz default now()
);

-- Insert default groups
insert into public.wallet_groups (name, icon) values 
('Cash', 'banknote'),
('Bank Account', 'landmark'),
('E-Wallet', 'smartphone'),
('Credit Card', 'credit-card'),
('Investment', 'trending-up'),
('Others', 'more-horizontal');

-- Enable RLS for wallet_groups (Read-only for everyone, or authenticated)
alter table public.wallet_groups enable row level security;
create policy "Wallet groups are viewable by everyone" on public.wallet_groups for select using (true);


-- 2. Table: wallets
create table public.wallets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  group_id uuid references public.wallet_groups,
  name text not null,
  balance numeric default 0,
  currency text default 'IDR',
  color text default '#22c55e', -- Hex color for UI
  icon text, -- Custom icon if needed
  is_archived boolean default false,
  exclude_from_stats boolean default false, -- e.g. for investment accounts
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.wallets enable row level security;

create policy "Users can view their own wallets" on public.wallets for select using (auth.uid() = user_id);
create policy "Users can insert their own wallets" on public.wallets for insert with check (auth.uid() = user_id);
create policy "Users can update their own wallets" on public.wallets for update using (auth.uid() = user_id);
create policy "Users can delete their own wallets" on public.wallets for delete using (auth.uid() = user_id);


-- 3. Table: categories
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  type text not null check (type in ('income', 'expense')),
  icon text, -- Icon identifier
  color text, -- Hex code
  created_at timestamptz default now()
);

alter table public.categories enable row level security;

create policy "Users can view their own categories" on public.categories for select using (auth.uid() = user_id);
create policy "Users can insert their own categories" on public.categories for insert with check (auth.uid() = user_id);
create policy "Users can update their own categories" on public.categories for update using (auth.uid() = user_id);
create policy "Users can delete their own categories" on public.categories for delete using (auth.uid() = user_id);

-- Optional: Add default categories trigger (advanced) or just let frontend handle default creation.


-- 4. Table: transactions
create table public.transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null, -- Denormalized for simpler RLS
  wallet_id uuid references public.wallets not null,
  target_wallet_id uuid references public.wallets, -- Only for transfers
  category_id uuid references public.categories, -- Nullable for transfers
  amount numeric not null,
  note text,
  date timestamptz not null default now(),
  type text not null check (type in ('income', 'expense', 'transfer')),
  image_path text, -- For receipt attachments
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.transactions enable row level security;

create policy "Users can view their own transactions" on public.transactions for select using (auth.uid() = user_id);
create policy "Users can insert their own transactions" on public.transactions for insert with check (auth.uid() = user_id);
create policy "Users can update their own transactions" on public.transactions for update using (auth.uid() = user_id);
create policy "Users can delete their own transactions" on public.transactions for delete using (auth.uid() = user_id);

-- Indexes for performance
create index idx_wallets_user on public.wallets(user_id);
create index idx_transactions_user on public.transactions(user_id);
create index idx_transactions_wallet on public.transactions(wallet_id);
create index idx_transactions_date on public.transactions(date);
