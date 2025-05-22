import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const {email} = await req.json();

    if (!email) {
        return NextResponse.json({error: "user email is required"})
    }
    const user = await prisma.user.findUnique({where: {email}});
    if (!user){
        return NextResponse.json({error: "User not found in database"})
    }
    if (user.role !== "admin"){
        return NextResponse.json({error: "Only admins can get all users"})
    }
    const users = await prisma.user.findMany({
        include: {accounts: true}
    });
    return NextResponse.json({users})
}