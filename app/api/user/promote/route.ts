import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const {userId: targetId} = await req.json();

    if (!targetId) {
        return NextResponse.json({error: "L’ID de l’utilisateur est requis."});
    }
    const currentUser = await prisma.user.findUnique({where: {id: targetId}});
    if (!currentUser) {
        return NextResponse.json({error: "Utilisateur introuvable."});
    }
    const adminEmail = process.env.ADMIN_EMAIL;
    const isGrantUser = currentUser.email === adminEmail;
    if (isGrantUser) {
        return NextResponse.json({error: "Vous ne pouvez pas vous promouvoir cet utilisateur ou le rétrograder."});
    }
    const newRole = currentUser.role === "admin" ? "manager" : "admin";
    // Applique la mise à jour
    const updated = await prisma.user.update({
        where: { id: targetId },
        data: { role: newRole },
    });
    // await prisma.user.update({where: {id: targetId}, data: {role: newRole }});
    return NextResponse.json({success: true, role: updated.role, isGrantUser});
}