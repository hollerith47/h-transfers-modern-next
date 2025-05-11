import {z} from "zod";
import {AccountIdSchema, DeleteTransactionSchema} from "@/schema";

export type UserRole = "admin" | "manager";
export interface User {
    id: string
    email: string
    createdAt: Date,
    accounts: Account[]
    role: UserRole
}

export interface GetUserRole extends Omit<User, "accounts">{}
export interface GetUserResponse extends Omit<User, "accounts" | "role">{}
export interface Account {
    id: string;
    name: string;
    amount: number;
    currency: string;
    emoji: string | null;
    createdAt: Date;
    transactions?: Transaction[];
}
export type DeleteAccountResponse = { success: true };
export type DeleteAccountPayload = z.infer<typeof AccountIdSchema>;
export type AccountIdType = z.infer<typeof AccountIdSchema>;
export type TransactionIdType = z.infer<typeof DeleteTransactionSchema>;
export interface Client {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    createdAt: Date;
    transactions?: Transaction[];
}

export interface ClientResponse {
    email: string | null;
    id: string;
    name: string;
    phone: string | null;
    createdAt: Date
}

export type TransactionStatus = "pending" | "completed";
export type TransactionType = "income" | "outcome";
export type Currency = "USD" | "EUR" | "RUB";


export interface Transaction {
    id: string;
    description: string;
    amount: number;         // montant brut
    commission?: number | null | undefined;     // frais
    clientAmount: number;   // amount - commission
    paidAmount?: number;    // versé au client
    paidCurrency?: string;  // devise de paidAmount
    type: TransactionType;
    status: TransactionStatus,
    emoji?: string | null;
    createdAt: Date;

    accountId?: string | null;
    clientId?: string | null;

    // Relations
    accountName?: string;   // si tu veux exposer le nom du compte
    clientName?: string;    // pour afficher le nom du client
    accountCurrency?: string;    // pour afficher le nom du client
}

export type PeriodStats = {
    yesterday: number;
    today: number;
    change: number;
    pctChange: number | null;
    income: number;
    outcome: number;
};

export type CurrencyStats = {
    currency: string;
    day: PeriodStats;
    week: PeriodStats;
    month: PeriodStats;
};

export type AccountStats = {
    id: string;
    name: string;
    currency: string;
    day: PeriodStats;
    week: PeriodStats;
    month: PeriodStats;
};


export type DashboardEntry = {
    account: Account;
    stats: AccountStat;
};

export type AccountStat = {
    transactionCount: number;
    totalIncomeTransactions: number;
    totalOutcomeTransactions: number;
    startingAmount: number;
    rawBalance: number;
    balance: number;
    accountCurrency: string;
};

// DashboardData
export type CardInfo = {
    label: string;
    value: number;
    locale?: string;
    pctChange: number;
    symbol: string;
    color: string;
    accountName?: string;
};

export type ChartPoint = {
    currency: string;
    yesterday: number;
    today: number;
};

export type ChartConfig = {
    title: string;
    data: ChartPoint[];
};