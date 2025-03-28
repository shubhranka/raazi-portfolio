import { PrismaClient } from "@prisma/client";
// import * as admin from 'firebase-admin';
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient();


export async function POST(req: Request) {
    const body = await req.json();
    const { token, name, email } = body;

    if (!token || !name || !email) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    try {
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.FIREBASE_API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idToken: token
            })
        })
            .then(response => response.json())
            .then(data => {
                return data;
            })
        const existingUser = await prisma.sadhak.findFirst({
            where: {
                OR: [
                    { email },
                    { number: response.users[0].phoneNumber }
                ]
            }
        })

        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 409 });
        }
        const user = await prisma.sadhak.create({
            data: {
                email,
                name,
                number: response.users[0].phoneNumber
            }
        })
        
        const jwttoken = jwt.sign({ name, email, number: response.users[0].phoneNumber }, process.env.JWT_SECRET!, { expiresIn: '1d' });

        const refreshToken = jwt.sign({ name, email, number: response.users[0].phoneNumber }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '2d' });

        return NextResponse.json({ token: jwttoken, refreshToken }, { status: 200 });

    } catch (error) {
        console.error('Error verifying token:', error);
        return NextResponse.json({ error: 'Invalid token.' }, { status: 500 });
    }
}