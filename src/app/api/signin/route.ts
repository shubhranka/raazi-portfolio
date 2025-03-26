import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const { name, email, phone, otp } = await req.json();
    const sadhak = prisma.sadhak.create({
        
    })
} 