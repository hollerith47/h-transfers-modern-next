"use server";

import {z} from 'zod';
import {prisma} from "@/lib/prisma";
import {
    AccountIdSchema,
    AddAccountSchema,
    AddClientSchema,
    AddTransactionSchema, AddUserToDBSchema,
    ByEmailSchema,
    DeleteClientSchema,
    DeleteTransactionSchema, UpdateAccountSchema,
    UpdateTransactionSchema
} from "@/schema";
import {Account, ClientResponse, TransactionStatus} from "@/types";
import {mapAccount} from "@/utils/prismaMappers";
import {assertExists} from "@/utils/ensureSufficientFunds";
import {getThisMonthDates} from "@/utils/dateUtils";

export async function AddUserToDB(data: z.infer<typeof AddUserToDBSchema>) {
    const validated = AddUserToDBSchema.safeParse(data);
    if (!validated.success) {
        throw new Error('Invalid email format');
    }
    const {email, name} = validated.data;
    const adminEmail = process.env.ADMIN_EMAIL;
    const role = email === adminEmail ? "admin" : "manager";

    // upsert crée ou met à jour en une seule opération
    await prisma.user.upsert({
        where: { email },
        create: { email, name, role },
        update: { name },
    });
}

// export async function getUserRole(formData: z.infer<typeof ByEmailSchema>): Promise<GetUserResponse | null>{
//     const { success, data } = ByEmailSchema.safeParse(formData);
//     if (!success) throw new Error("Get user Role Data Validation failed");
//     const {email} = data;
//     return prisma.user.findUnique({where: {email}});
// }
export async function AddAccount(formData: z.infer<typeof AddAccountSchema>) {
    const { success, data } = AddAccountSchema.safeParse(formData);
    if (!success) throw new Error("Add Account Data Validation failed");

    const {email, name, amount, emoji, currency} = data;
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

export async function updateAccountData(formData: z.infer<typeof UpdateAccountSchema>){
    const {success, data} = UpdateAccountSchema.safeParse(formData);
    if (!success) throw new Error("Update Account Data Validation failed");

    const {email, name, accountId, emoji} = data;
    const user = await prisma.user.findUnique({where: {email}});
    if (!user) {
        throw new Error('User not found');
    }

    await prisma.account.update({
        where: {id: accountId},
        data: {
            name,
            emoji
        },
    });
}

export async function getAccountsByUser(data: z.infer<typeof ByEmailSchema>): Promise<Account[]> {
    const validated = ByEmailSchema.safeParse(data);
    if (!validated.success) {
        throw new Error('Invalid email format');
    }
    const {email} = validated.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    // const {startOfMonth,startOfNextMonth} = getThisMonthDates();
    // const sorted = {
    //     gte: startOfMonth,
    //     lt: startOfNextMonth
    // }

    const accountWhere = user.role === "admin" ? {} : {userId: user.id};

    const accounts = await prisma.account.findMany({
        where: accountWhere,
        include: {
            transactions: true // sortTransact
        }
    })
   // const sortTransact = {
   //      where:  {
   //          createdAt: {
   //              gte: startOfMonth,
   //                  lt: startOfNextMonth
   //          },
   //      }
   //  }
    /*
    let accounts;
    if (user.role === "admin"){
        accounts = await prisma.account.findMany({
            include: { transactions: true },
        });
    }else{
        accounts = await prisma.account.findMany({
            where: { userId: user.id },
            include: { transactions: true },
        });
    }*/
    return accounts.map((acct) => mapAccount(acct));
}


export async function getTransactionsByAccountId(data: z.infer<typeof AccountIdSchema>): Promise<Account> {
    const validated = AccountIdSchema.safeParse(data);
    if (!validated.success) {
        throw new Error('Invalid email format');
    }
    const {accountId} = validated.data;

    const {startOfMonth,startOfNextMonth} = getThisMonthDates()

    const account = await prisma.account.findUnique({
        where: {
            id: accountId
        },
        include: {
            transactions: {
                where:  {
                    createdAt: {
                        gte: startOfMonth,
                        lt: startOfNextMonth
                    },
                }
            }
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
        // console.log(validated.error)
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
        status,
        clientAmount,
        clientId,
        emoji,
    } = validated.data;
    const {startOfMonth,startOfNextMonth} = getThisMonthDates()

    const rawAccount = await prisma.account.findUnique({
        where: {
            id: accountId
        },
        include: {
            transactions: {
                where:  {
                    createdAt: {
                        gte: startOfMonth,
                        lt: startOfNextMonth
                    },
                }
            }
        }
    });

    assertExists(rawAccount, "Account not found");

    const payload = {
        description,
        amount,
        commission,
        clientAmount,
        paidAmount,
        paidCurrency,
        type,
        status,
        accountId,
        clientId,
        emoji,
    };

    await prisma.transaction.create({ data: payload });
}

export async function updateTransaction(data: z.infer<typeof UpdateTransactionSchema>){
    const validated = UpdateTransactionSchema.safeParse(data);
    if (!validated.success) {
        console.error(validated.error);
        throw new Error("Error while validating transaction update data");
    }
    const {
        id,
        isAdmin,
        amount: newAmount,
        description,
        commission,
        clientAmount,
        paidAmount,
        paidCurrency,
        type: newType,
        status,
        clientId,
        emoji,
    } = validated.data;


    // On récupère la transaction existante
    const existingTx= await prisma.transaction.findUnique({
        where: { id },
    });
    if (!existingTx) {
        throw new Error("Transaction not found");
    }
    if (!isAdmin && (newAmount !== existingTx.amount || newType !== existingTx.type)){
        throw new Error(
            "Vous n'avez pas le droit requis pour modifier le prix " +
            "et le type de transaction."
        );
    }

    await prisma.transaction.update({
        where: { id },
        data: {
            description,
            commission,
            clientAmount,
            paidAmount,
            paidCurrency,
            clientId,
            emoji,
            status: status as TransactionStatus,
            ...(isAdmin ?
                    {
                        amount:newAmount,
                        type:newType
                    }
                    : {}
            )
        },
    });
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

export async function DeleteClient(formData: z.infer<typeof DeleteClientSchema>) {
    const validated = DeleteClientSchema.safeParse(formData);
    if (!validated.success) {
        console.error(validated.error);
        throw new Error("Deleting client Validation failed");
    }
    const { clientId } = validated.data;
    await prisma.client.delete({
        where: { id: clientId },
    });
}
export async function DeleteTransaction(formData: z.infer<typeof DeleteTransactionSchema>) {
    const validated = DeleteTransactionSchema.safeParse(formData);
    if (!validated.success) {
        console.error(validated.error);
        throw new Error("Deleting transaction Validation failed");
    }
    const { transactionId } = validated.data;

    await prisma.transaction.delete({
        where: { id: transactionId },
    });
}

export async function getClients():Promise<ClientResponse[]> {
    return prisma.client.findMany();
}

