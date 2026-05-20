import type { Budget, Transaction } from "./types.js";

type CreateBudgetInput = Omit<Budget, "id" | "createdAt">;
type CreateTransactionInput = Omit<Transaction, "id" | "createdAt">;

export class InMemoryStore {
  private budgets: Budget[] = [];
  private transactions: Transaction[] = [];

  createBudget(input: CreateBudgetInput): Budget {
    const budget: Budget = {
      id: `bud_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      ...input
    };

    this.budgets.unshift(budget);
    return budget;
  }

  getCurrentBudget(): Budget | null {
    return this.budgets[0] ?? null;
  }

  createTransaction(input: CreateTransactionInput): Transaction {
    const transaction: Transaction = {
      id: `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      ...input
    };

    this.transactions.unshift(transaction);

    const budget = this.budgets.find((item) => item.id === input.budgetId);
    if (budget) {
      budget.spentSoFar += Math.abs(input.amount);
    }

    return transaction;
  }

  listTransactions(budgetId?: string): Transaction[] {
    if (!budgetId) {
      return this.transactions;
    }

    return this.transactions.filter((item) => item.budgetId === budgetId);
  }
}
