
export interface Account {
    id: string;
    name: string;
    amount: number;
    currency: string;
    emoji: string | null;
    createdAt: Date;
    transactions?: Transaction[];
}
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

export type TransactionType = "income" | "outcome";
export type Currency = "USD" | "EUR" | "RUB";

// export interface Transaction {
//     id: string;
//     amount: number;
//     type: string;
//     emoji: string | null;
//     description: string
//     createdAt: Date;
//     accountName?: string;
//     accountId?: string | null;
// }

export interface Transaction {
    id: string;
    description: string;
    amount: number;         // montant brut
    commission?: number | null | undefined;     // frais
    clientAmount: number;   // amount - commission
    paidAmount?: number;    // versé au client
    paidCurrency?: string;  // devise de paidAmount
    type: TransactionType;
    emoji?: string | null;
    createdAt: Date;

    accountId?: string | null;
    clientId?: string | null;

    // Relations
    accountName?: string;   // si tu veux exposer le nom du compte
    clientName?: string;    // pour afficher le nom du client
}