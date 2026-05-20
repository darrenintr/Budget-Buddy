export type Currency = "TWD" | "USD";

export type Budget = {
  id: string;
  plannedIncome: number;
  reservedBills: number;
  reservedGoals: number;
  spentSoFar: number;
  currency: Currency;
  createdAt: string;
};

export type TransactionSource = "manual" | "import" | "bank_sync";

export type Transaction = {
  id: string;
  budgetId: string;
  amount: number;
  currency: string;
  merchant: string;
  occurredOn: string;
  categoryId: string;
  note?: string;
  source: TransactionSource;
  createdAt: string;
};
