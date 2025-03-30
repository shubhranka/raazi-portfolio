import { PrismaClient } from "@prisma/client";
// import * as admin from 'firebase-admin';
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient();


export async function POST(req: Request) {
    const body = await req.json();
    const { token, phone } = body;

    if (!token) {
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
        });
        const data = await response.json();
        let user = await prisma.sadhak.findFirst({
            where: {
                OR: [
                    { email: data.users[0].email },
                ]
            }
        })
        if (!user) {
            if(!data.users[0].phoneNumber && !phone) {
                return NextResponse.json({ message: 'Missing phone number', requirePhone: true }, { status: 400 });
            }
            const phoneNumber = data.users[0].phoneNumber || phone;
            user = await prisma.sadhak.create({
                data: {
                    email: data.users[0].email,
                    name: data.users[0].displayName,
                    phone: phoneNumber
                }
            })
        }

        const bookings = await prisma.booking.findMany({
            where: {
                sadhakId: user.id
            }
        })

        const courseIds = bookings.map((booking) => booking.courseId);
        
        const jwttoken = jwt.sign({ name: data.users[0].displayName, email: data.users[0].email, bookedCourses: courseIds, phone: user.phone }, process.env.JWT_SECRET!, { expiresIn: '1d' });

        return NextResponse.json({ token: jwttoken }, { status: 200 });

    } catch (error) {
        console.error('Error verifying token:', error);
        return NextResponse.json({ error: 'Invalid token.' }, { status: 500 });
    }
}