import {ByEmailSchema } from "@/schema";
import prisma from "@/lib/prisma";
import {NextResponse} from "next/server";

export async function POST(req: Request){
    const formData = await req.json();
    const parsed = ByEmailSchema.safeParse(formData);
    if (!parsed.success) NextResponse.error();
    const  email = parsed.data?.email;
    if (email) {
        const user = await prisma.user.findUnique({where: {email}});
        if (!user) return NextResponse.json(null);

        return NextResponse.json({role: user.role});
    }
    return NextResponse.error();

}