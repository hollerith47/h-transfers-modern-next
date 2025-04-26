"use server";

import {prisma} from "@/lib/prisma";

export async function AddUserToDB(email: string | undefined) {
    if (!email) return
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const role = email === adminEmail ? "admin" : "manager";
        const existingUser = await prisma.user.findUnique({
            where: {email}
        });
        if (!existingUser) {
            await prisma.user.create({
                data: {
                    email, role
                }
            })
            console.log("user added to prisma database successfully")
        }else{
            console.log("user already exists in prisma database")
        }


    } catch (error) {
        console.error("error while adding user to prisma database", error)
    }
}

export async function AddAccount(email: string, name: string, amount: number, selectedEmoji: string, currency: string) {
    try {
        const user = await prisma.user.findUnique({where: {email}});
        if (!user){
            throw new Error("user not found");
        }
        await prisma.account.create({
            data: {
                userId: user.id,
                name,
                amount,
                emoji: selectedEmoji,
                currency
            }
        })
        console.log("account added to prisma database successfully")

    }catch (error) {
        console.error("error while creating account to prisma database", error);
        throw error;
    }
}