export type SafeToSpendInput = {
  remainingIncome: number;
  reservedBills: number;
  reservedGoals: number;
  spentSoFar: number;
  daysLeft: number;
};

export type SafeToSpendBreakdown = SafeToSpendInput & {
  distributable: number;
};

export type SafeToSpendResult = {
  amount: number;
  breakdown: SafeToSpendBreakdown;
};

export function calculateSafeToSpend(input: SafeToSpendInput): SafeToSpendResult {
  if (input.daysLeft <= 0) {
    throw new Error("daysLeft must be greater than 0");
  }

  const distributable =
    input.remainingIncome - input.reservedBills - input.reservedGoals - input.spentSoFar;

  const amount = Number((distributable / input.daysLeft).toFixed(2));

  return {
    amount,
    breakdown: {
      ...input,
      distributable
    }
  };
}
