// src/utils/prismaMappers.ts
import type {
    Account as PrismaAccount,
    Transaction as PrismaTransaction,
} from "@prisma/client";
import type { Account as ApiAccount, Transaction as ApiTransaction, TransactionType } from "@/types";

export function mapTransaction(
    tx: PrismaTransaction,
    accountName?: string
): ApiTransaction {
    return {
        id: tx.id,
        description: tx.description,
        amount: tx.amount,
        commission: tx.commission ?? 0,
        clientAmount: tx.clientAmount,
        paidAmount: tx.paidAmount ?? 0,
        paidCurrency: tx.paidCurrency ?? "",
        type: tx.type as TransactionType,
        emoji: tx.emoji,
        createdAt: tx.createdAt,
        accountId: tx.accountId,
        clientId: tx.clientId,
        accountName,
    };
}

export function mapAccount(
    acct: PrismaAccount & { transactions: PrismaTransaction[] }
): ApiAccount {
    return {
        id: acct.id,
        name: acct.name,
        amount: acct.amount,
        currency: acct.currency,
        emoji: acct.emoji,
        createdAt: acct.createdAt,
        transactions: acct.transactions.map((tx) =>
            mapTransaction(tx, acct.name)
        ),
    };
}
