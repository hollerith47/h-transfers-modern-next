import {NextRequest, NextResponse} from "next/server";
import {AccountIdSchema} from "@/schema";
import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest){
    const body = await req.json();
    const parsed = AccountIdSchema.safeParse(body);
    if (!parsed.success){
        return NextResponse.json(parsed.error.format());
    }
    const { accountId } = parsed.data;
    try {
        await prisma.account.delete({ where: { id: accountId } });
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("delete account error", err);
        return NextResponse.json(
            { error: "Impossible de supprimer le compte" },
        );
    }
}

// export async function GET(req: NextRequest){}