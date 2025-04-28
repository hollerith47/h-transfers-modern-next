import {z} from "zod";

export const AddAccountSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    amount: z.number().positive(),
    emoji: z.string().min(1),
    currency: z.string().min(1),
});

export const ByEmailSchema = z.object({
    email: z.string().email(),
});

export const AccountIdSchema = z.object({
    accountId: z.string(),
});

export const TransactionTypeSchema = z.enum(["income", "outcome"]);
export const AddTransactionSchema = z.object({
    accountId: z.string(),
    description: z.string().min(1, "Description requise"),
    amount: z.number().nonnegative("Le montant doit être ≥ 0"),
    commission: z.number().nonnegative("La commission doit быть ≥ 0").default(0),
    clientAmount: z.number().nonnegative("La commission doit быть ≥ 0").default(0),
    paidAmount: z.number().nonnegative("Le montant payé doit être ≥ 0").optional(),
    paidCurrency: z.string().min(1).optional(),
    type: TransactionTypeSchema,
    clientId: z.string().uuid().optional(),
    emoji: z.string().min(1).optional(),
})

export const TransactionFormSchema = AddTransactionSchema.omit({ accountId: true });