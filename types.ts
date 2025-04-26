
export interface Account {
    id: string;
    name: string;
    amount: number;
    currency: string;
    emoji: string | null;
    createdAt: Date;
    transactions?: Transaction[];
}

export interface Transaction {
    id: string;
    amount: number;
    type: string;
    emoji: string | null;
    description: string
    createdAt: Date;
    accountName?: string;
    accountId?: string | null;
}