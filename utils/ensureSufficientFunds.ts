import {Account} from "@/types";
import {getTotalByType} from "@/utils/getTotalByType";

export function ensureSufficientFunds(account: Account, amountToSpend: number) {
    const totalIn = parseFloat(getTotalByType(account.transactions, "income"));
    const totalOut = parseFloat(getTotalByType(account.transactions, "outcome"));

    // On utilise directement account.amount, avec un fallback à 0 si jamais
    const available = (account.amount ?? 0) + totalIn - totalOut;

    if (amountToSpend > available) {
        throw new Error("Not enough funds");
    }
}

export function assertExists<T>(
    val: T | null | undefined,
    message = "Value not found"
): asserts val is T {
    if (val === null || val === undefined) {
        throw new Error(message);
    }
}