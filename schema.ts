import {z} from "zod";

export const AddAccountSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    amount: z.number().positive(),
    emoji: z.string().min(1),
    currency: z.string().min(1),
});

export const UpdateAccountSchema = AddAccountSchema.extend({
    accountId: z.string().uuid(),
}).omit({amount: true, currency: true});

export const InitialAccountData = UpdateAccountSchema.omit({email: true});

export const AddClientSchema = z.object({
    name: z.string().min(1),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
})

export const DeleteClientSchema = z.object({clientId: z.string().uuid()});
export const UpdateClientSchema = AddClientSchema.extend({
    id: z.string().uuid(),
});
export const ByEmailSchema = z.object({
    email: z.string().email(),
});

export const AddUserToDBSchema = ByEmailSchema.extend({
    name: z.string().optional().or(z.literal(""))
})

export const AccountIdSchema = z.object({
    accountId: z.string(),
});

export const UserIDSchema = z.object({
    userId: z.string().uuid(),
})
export const TransactionTypeSchema = z.enum(["income", "outcome"]);
export const TransactionStatusSchema = z.enum(["pending", "completed"]);
export const AddTransactionSchema = z.object({
    accountId: z.string(),
    description: z.string().min(1, "Description requise"),
    amount: z.number().nonnegative("Le montant doit être ≥ 0"),
    commission: z.number().nonnegative("La commission doit être ≥ 0").default(0),
    clientAmount: z.number().nonnegative("La commission doit être ≥ 0").default(0),
    paidAmount: z.number().nonnegative("Le montant payé doit être ≥ 0").optional(),
    paidCurrency: z.string().min(1).optional().or(z.literal("")),
    type: TransactionTypeSchema,
    status: TransactionStatusSchema.default("pending"),
    clientId: z.string().uuid().optional(),
    emoji: z.string().min(1).optional(),
})

export const TransactionFormSchema = AddTransactionSchema.omit({accountId: true});
export const UpdateTransactionSchema = AddTransactionSchema
    .extend({id: z.string().uuid(), isAdmin: z.boolean()})
    .omit({accountId: true});

export const DeleteTransactionSchema = z.object({transactionId: z.string().uuid()});

export const TransactionInitialData = AddTransactionSchema.omit({accountId: true, emoji: true});

export const UserSchema = {
    id: z.string(),
    email: z.string().email(),
    createdAt: z.date(),
    role: z.string()
}