import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'


const prisma = new PrismaClient();


export async function POST(req: Request) {
    const body = await req.json();
    const { token } = body;
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
                    { number: response.users[0].phoneNumber }
                ]
            }
        })
        if (existingUser) {

            const bookedCourses = await prisma.booking.findMany({
                where: {
                    sadhakId: existingUser.id
                }
            })
            const courseIds = bookedCourses.map((booking) => booking.courseId);


            const token = jwt.sign({ name: existingUser.name, email: existingUser.email, number: existingUser.number, bookedCourses: courseIds }, process.env.JWT_SECRET!, { expiresIn: '1d' });

            const refreshToken = jwt.sign({ name: existingUser.name, email: existingUser.email, number: existingUser.number, bookedCourses: courseIds }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '2d' });

            return NextResponse.json({ token, refreshToken }, { status: 200 });
        }

        return NextResponse.json({ message: 'User not found' }, { status: 404 });

    } catch (error) {
        console.error('Error verifying token:', error);
        return NextResponse.json({ error: 'Invalid token.' }, { status: 500 });
    }
}