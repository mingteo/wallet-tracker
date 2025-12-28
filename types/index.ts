export type WalletGroup = {
  id: string;
  name: string;
  icon: string | null;
  created_at: string;
};

export type Wallet = {
  id: string;
  user_id: string;
  group_id: string | null;
  name: string;
  balance: number;
  currency: string;
  color: string;
  icon: string | null;
  is_archived: boolean;
  exclude_from_stats: boolean;
  created_at: string;
  updated_at: string;
  wallet_groups?: WalletGroup; // Relation
};

export type Category = {
  id: string;
  user_id: string;
  name: string;
  type: "income" | "expense";
  icon: string | null;
  color: string | null;
  created_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  wallet_id: string;
  target_wallet_id: string | null;
  category_id: string | null;
  amount: number;
  note: string | null;
  date: string;
  type: "income" | "expense" | "transfer";
  image_path: string | null;
  created_at: string;
  updated_at: string;
  wallets?: Wallet; // Relation
  categories?: Category; // Relation
};
