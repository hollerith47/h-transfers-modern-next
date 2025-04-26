"use server";

import {z} from 'zod';
import {prisma} from "@/lib/prisma";
import {AddAccountSchema, AddUserSchema, GetAccountsSchema} from "@/schema";
import {Account} from "@/types";

export async function AddUserToDB(data: z.infer<typeof AddUserSchema>) {
    const validated = AddUserSchema.safeParse(data);
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

export async function getAccountsByUser(data: z.infer<typeof GetAccountsSchema>):Promise<Account[]> {
    const validated = GetAccountsSchema.safeParse(data);
    if (!validated.success) {
        throw new Error('Invalid email format');
    }
    const { email } = validated.data;
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            accounts: {
                include: {
                    transactions: true,
                },
            },
        },
    });

    if (!user) {
        throw new Error('User not found');
    }
    return user.accounts.map((account) => ({
        id: account.id,
        name: account.name,
        amount: account.amount,
        currency: account.currency,
        emoji: account.emoji,
        createdAt: account.createdAt,
        transactions: account.transactions?.map((transaction) => ({
            id: transaction.id,
            amount: transaction.amount,
            type: transaction.type,
            emoji: transaction.emoji,
            description: transaction.description,
            createdAt: transaction.createdAt,
            accountName: transaction.accountName, // ou undefined selon besoin
            accountId: transaction.accountId,
        })),
    }));
}
