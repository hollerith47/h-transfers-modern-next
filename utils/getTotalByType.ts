import {Transaction} from "@/types";

export function getTotalByType(transactions: Transaction[] | undefined, type: "income" | "outcome"): string {
    const result = transactions?.reduce((sum: number, transaction: Transaction) => {
        return transaction.type === type ? sum + transaction.amount : sum;
    }, 0) || 0;

    return result.toFixed(2);
}