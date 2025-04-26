import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prismaClientSingleton = () => {
    return new PrismaClient().$extends(withAccelerate());
};

const globalForPrisma = globalThis as unknown as {
    prismaGlobal?: ReturnType<typeof prismaClientSingleton>;
};

export const prisma = globalForPrisma.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prismaGlobal = prisma;
}

export default prisma;
