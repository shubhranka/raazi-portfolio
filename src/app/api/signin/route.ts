import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'


const prisma = new PrismaClient();


export async function POST(req: Request) {
    const body = await req.json();
    const { token } = body;
    try {
       const userData = jwt.verify(token, process.env.JWT_SECRET!);

        if(!userData) {
            return NextResponse.json({ message: 'Invalid token.' }, { status: 400 });
        }

        return NextResponse.json(userData, { status: 200 })

    } catch (error) {
        console.error('Error verifying token:', error);
        return NextResponse.json({ error: 'Invalid token.' }, { status: 500 });
    }
}