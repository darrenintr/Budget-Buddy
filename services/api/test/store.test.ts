import { describe, expect, it } from "vitest";
import { InMemoryStore } from "../src/store.js";

describe("InMemoryStore", () => {
  it("creates and returns current budget", () => {
    const store = new InMemoryStore();
    const budget = store.createBudget({
      plannedIncome: 10000,
      reservedBills: 3000,
      reservedGoals: 1000,
      spentSoFar: 0,
      currency: "TWD"
    });

    expect(store.getCurrentBudget()?.id).toBe(budget.id);
  });

  it("adds absolute expense to spentSoFar", () => {
    const store = new InMemoryStore();
    const budget = store.createBudget({
      plannedIncome: 10000,
      reservedBills: 3000,
      reservedGoals: 1000,
      spentSoFar: 0,
      currency: "TWD"
    });

    store.createTransaction({
      budgetId: budget.id,
      amount: -200,
      currency: "TWD",
      merchant: "Test",
      occurredOn: "2026-05-20",
      categoryId: "cat_food",
      source: "manual"
    });

    expect(store.getCurrentBudget()?.spentSoFar).toBe(200);
  });
});
