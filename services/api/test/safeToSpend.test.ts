import { describe, expect, it } from "vitest";
import { calculateSafeToSpend } from "../src/safeToSpend.js";

describe("calculateSafeToSpend", () => {
  it("returns daily safe-to-spend amount", () => {
    const result = calculateSafeToSpend({
      remainingIncome: 18200,
      reservedBills: 9200,
      reservedGoals: 2500,
      spentSoFar: 6019.5,
      daysLeft: 13
    });

    expect(result.amount).toBeCloseTo(36.96, 2);
  });

  it("throws when daysLeft is zero", () => {
    expect(() =>
      calculateSafeToSpend({
        remainingIncome: 100,
        reservedBills: 0,
        reservedGoals: 0,
        spentSoFar: 0,
        daysLeft: 0
      })
    ).toThrow("daysLeft must be greater than 0");
  });
});
