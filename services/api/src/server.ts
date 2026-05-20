import Fastify from "fastify";
import { z } from "zod";
import { calculateSafeToSpend } from "./safeToSpend.js";
import { InMemoryStore } from "./store.js";

const app = Fastify({ logger: true });
const store = new InMemoryStore();

const budgetSchema = z.object({
  plannedIncome: z.number().nonnegative(),
  reservedBills: z.number().nonnegative(),
  reservedGoals: z.number().nonnegative(),
  currency: z.enum(["TWD", "USD"]).default("TWD")
});

const createTransactionSchema = z.object({
  budgetId: z.string().min(1),
  amount: z.number(),
  currency: z.string().length(3),
  merchant: z.string().min(1),
  occurredOn: z.string(),
  categoryId: z.string().min(1),
  note: z.string().optional(),
  source: z.enum(["manual", "import", "bank_sync"])
});

app.get("/health", async () => ({ status: "ok" }));

app.post("/v1/budgets", async (request, reply) => {
  const payload = budgetSchema.parse(request.body);
  const budget = store.createBudget({
    ...payload,
    spentSoFar: 0
  });

  return reply.code(201).send({
    status: "created",
    budget
  });
});

app.get("/v1/budgets/current", async (request, reply) => {
  const budget = store.getCurrentBudget();
  if (!budget) {
    return reply.code(404).send({ message: "No budget found" });
  }

  return { budget };
});

app.post("/v1/transactions", async (request, reply) => {
  const payload = createTransactionSchema.parse(request.body);
  const budget = store.getCurrentBudget();

  if (!budget || budget.id !== payload.budgetId) {
    return reply.code(400).send({ message: "Invalid budgetId" });
  }

  const transaction = store.createTransaction(payload);

  return reply.code(201).send({
    ...transaction,
    status: "created",
    isRecurringCandidate: false,
    safeToSpendRecomputed: true
  });
});

app.get("/v1/transactions", async (request) => {
  const querySchema = z.object({
    budgetId: z.string().optional()
  });

  const query = querySchema.parse(request.query);
  const data = store.listTransactions(query.budgetId);

  return {
    count: data.length,
    data
  };
});

app.get("/v1/safe-to-spend", async (request, reply) => {
  const querySchema = z.object({
    daysLeft: z.coerce.number().int().positive()
  });

  const query = querySchema.parse(request.query);
  const budget = store.getCurrentBudget();

  if (!budget) {
    return reply.code(404).send({ message: "No budget found" });
  }

  const result = calculateSafeToSpend({
    remainingIncome: budget.plannedIncome,
    reservedBills: budget.reservedBills,
    reservedGoals: budget.reservedGoals,
    spentSoFar: budget.spentSoFar,
    daysLeft: query.daysLeft
  });

  return {
    date: new Date().toISOString().slice(0, 10),
    safeToSpendAmount: result.amount,
    currency: budget.currency,
    breakdown: result.breakdown,
    explanation: "你今天建議可花金額已根據收入、保留款與已花費重新計算。"
  };
});

const start = async () => {
  const port = Number(process.env.PORT || 3000);
  await app.listen({ port, host: "0.0.0.0" });
};

start().catch((error) => {
  app.log.error(error);
  process.exit(1);
});
