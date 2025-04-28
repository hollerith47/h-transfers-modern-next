"use server";

import {z} from 'zod';
import {prisma} from "@/lib/prisma";
import {AccountIdSchema, AddAccountSchema, AddClientSchema, AddTransactionSchema, ByEmailSchema} from "@/schema";
import {Account, Client} from "@/types";
import {getTotalByType} from "@/utils/getTotalByType";
import {mapAccount} from "@/utils/prismaMappers";

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

    return user.accounts.map((acct) => mapAccount(acct));
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

    return mapAccount(account);
}

export async function createTransaction(data: z.infer<typeof AddTransactionSchema>){
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
        ensureSufficientFunds(mapAccount(account), amount);
    }
    const payload = {
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
    };

    await prisma.transaction.create({ data: payload });
}

function ensureSufficientFunds(account: Account, amountToSpend: number) {
    const totalIn = getTotalByType(account.transactions, "income");
    const totalOut = getTotalByType(account.transactions, "outcome");
    const available = (account.amount ?? 0) + totalIn - totalOut;
    if (amountToSpend > available) {
        throw new Error("Not enough funds");
    }
}

export async function AddClient(formData: z.infer<typeof AddClientSchema>) {
    const validated = AddClientSchema.safeParse(formData);
    if (!validated.success) {
        console.log(validated.error)
        throw new Error('Validation failed');
    }
    const {name, email, phone} = validated.data;

    await prisma.client.create({
        data: {
            name,
            email,
            phone,
        },
    });
}

export async function getClients():Promise<Client[]> {
    return prisma.client.findMany();
}