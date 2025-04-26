import {z} from "zod";

export const AddAccountSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    amount: z.number().positive(),
    emoji: z.string().min(1),
    currency: z.string().min(1),
});

export const GetAccountsSchema = z.object({
    email: z.string().email(),
});

export const AddUserSchema = z.object({
    email: z.string().email(),
});


export interface Budget {
    id: string;
    createdAt: Date;
    name: string;
    amount: number;
    emoji: string | null;
    transactions?: Transaction[];
}

export interface Transaction {
    id: string;
    amount: number;
    emoji: string | null;
    description: string
    createdAt: Date;
    budgetName?: string;
    budgetId?: string | null;
}