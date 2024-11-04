import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const body = await req.json();

    const {name, email, message } = body;

    console.log(name, email, message)

    const query = await prisma.queries.create({
        data: {
            name,
            email,
            message
        }
    })

    return new NextResponse("Success", { status: 200 });
    
}