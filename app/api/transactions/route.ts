import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const {email} = await req.json();
    // console.log(email)
    if (!email) {
        return NextResponse.json({error: "user email is required"})
    }

    const dbUser = await prisma.user.findUnique({where: {email}});
    if (!dbUser){
        return NextResponse.json({error: "User not found in database"})
    }

    const whereClause = dbUser.role  === "admin" ? {} :{account: {userId: dbUser.id}}
    const transactions = await prisma.transaction.findMany({
        where: whereClause,
        include: {
            account: true,
            client: true,
        }
    });

    const result = transactions.map((tx) => ({
        id:           tx.id,
        description:  tx.description,
        amount:       tx.amount,
        commission:   tx.commission,
        clientAmount: tx.clientAmount,
        paidAmount:   tx.paidAmount,
        paidCurrency: tx.paidCurrency,
        type:         tx.type,
        status:       tx.status,
        emoji:        tx.emoji,
        createdAt:    tx.createdAt,
        accountId:  tx.account?.id ?? "",
        accountName:  tx.account?.name ?? "",
        clientName:   tx.client?.name ?? "",
        accountCurrency: tx.account?.currency  ?? "",
    }));

    return NextResponse.json(result);
}