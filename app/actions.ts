"use server";

import {z} from 'zod';
import {prisma} from "@/lib/prisma";
import {AccountIdSchema, AddAccountSchema, AddTransactionSchema, ByEmailSchema} from "@/schema";
import {Account, Transaction} from "@/types";
import {getTotalByType} from "@/utils/getTotalByType";

export async function AddUserToDB(data: z.infer<typeof ByEmailSchema>) {
    const validated = ByEmailSchema.safeParse(data);
    if (!validated.success) {
        throw new Error('Invalid email format');
    }
    const {email} = validated.data;
    const adminEmail = process.env.ADMIN_EMAIL;
    const role = email === adminEmail ? "admin" : "manager";

    const existingUser = await prisma.user.findUnique({
        where: {email},
    });
    if (existingUser) return;

    await prisma.user.create({
        data: {
            email, role
        }
    });
}


export async function AddAccount(formData: z.infer<typeof AddAccountSchema>) {
    const validated = AddAccountSchema.safeParse(formData);
    if (!validated.success) {
        throw new Error('Validation failed');
    }
    const {email, name, amount, emoji, currency} = validated.data;
    const user = await prisma.user.findUnique({where: {email}});
    if (!user) {
        throw new Error('User not found');
    }
    await prisma.account.create({
        data: {
            userId: user.id,
            name,
            amount,
            emoji,
            currency,
        },
    });

}

export async function getAccountsByUser(data: z.infer<typeof ByEmailSchema>): Promise<Account[]> {
    const validated = ByEmailSchema.safeParse(data);
    if (!validated.success) {
        throw new Error('Invalid email format');
    }
    const {email} = validated.data;
    const user = await prisma.user.findUnique({
        where: {email},
        include: {
            accounts: {
                include: {
                    transactions: true
                },
            },
        },
    });

    if (!user) {
        throw new Error('User not found');
    }

    return user.accounts.map((acct) => ({
        id: acct.id,
        name: acct.name,
        amount: acct.amount,
        currency: acct.currency,
        emoji: acct.emoji,
        createdAt: acct.createdAt,
        transactions: acct.transactions.map((tx): Transaction => ({
            id: tx.id,
            description: tx.description,
            amount: tx.amount,
            commission: tx.commission ?? 0,
            clientAmount: tx.clientAmount,
            paidAmount: tx.paidAmount ?? 0,
            paidCurrency: tx.paidCurrency ?? "",
            type: tx.type,            // "income" | "outcome"
            emoji: tx.emoji,
            createdAt: tx.createdAt,
            accountId: tx.accountId,
            accountName: acct.name,   // le nom du compte parent
            clientId: tx.clientId,
            // clientName: tx.client?.name ?? "",
        })),
    }));
}


export async function getTransactionsByAccountId(data: z.infer<typeof AccountIdSchema>): Promise<Account> {
    const validated = AccountIdSchema.safeParse(data);
    if (!validated.success) {
        throw new Error('Invalid email format');
    }
    const {accountId} = validated.data;
    const account = await prisma.account.findUnique({
        where: {
            id: accountId
        },
        include: {
            transactions: true
        }
    });


    if (!account) {
        throw new Error('Account not found');
    }

    return {
        id: account.id,
        name: account.name,
        amount: account.amount,
        currency: account.currency,
        emoji: account.emoji,
        createdAt: account.createdAt,
        transactions: account.transactions.map((tx): Transaction => ({
                id: tx.id,
                description: tx.description,
                amount: tx.amount,
                commission: tx.commission ?? 0,
                clientAmount: tx.clientAmount,
                paidAmount: tx.paidAmount ?? 0,
                paidCurrency: tx.paidCurrency ?? "",
                type: tx.type,
                emoji: tx.emoji,
                createdAt: tx.createdAt,
                accountId: tx.accountId,
                clientId: tx.clientId,
                accountName: account.name, // bonus : tu ajoutes le nom du compte parent
            })),
    };
}

export async function createTransaction(data: z.infer<typeof AddTransactionSchema>): Promise<Transaction> {
    const validated = AddTransactionSchema.safeParse(data);
    if (!validated.success) {
        console.log(validated.error)
        throw new Error('Error while validating transaction data');
    }

    const {
        accountId,
        description,
        amount,
        commission,
        paidAmount,
        paidCurrency,
        type,
        clientAmount,
        clientId,
        emoji,
    } = validated.data;

    const account = await prisma.account.findUnique({
        where: {
            id: accountId
        },
        include: {
            transactions: true,
        }
    });

    if (!account) {
        throw new Error('Account not found');
    }

    if (type === "outcome") {
        const totalIncomeTransactions = getTotalByType(account.transactions, "income");
        const totalOutcomeTransactions = getTotalByType(account.transactions, "outcome");
        const startingAmount = account.amount ?? 0;
        const remainingAmount = startingAmount + totalIncomeTransactions - totalOutcomeTransactions;

        console.log({remainingAmount, amount})
        if (amount > remainingAmount) {
            throw new Error("Not enough funds");
        }
        await prisma.transaction.create({
            data: {
                description,
                amount,
                commission,
                clientAmount,
                paidAmount,
                paidCurrency,
                type,
                accountId,
                clientId,
                emoji,
            }
        });
    } else {
        await prisma.transaction.create({
            data: {
                description,
                amount,
                commission,
                clientAmount,
                paidAmount,
                paidCurrency,
                type,
                accountId,
                clientId,
                emoji,
            }
        });
    }
}