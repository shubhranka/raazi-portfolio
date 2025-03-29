import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const body = await req.json();
    const { token } = body;

    const user:any= jwt.verify(token, process.env.JWT_SECRET!);
    if (!user) {
        return NextResponse.json({ message: 'Invalid token.' }, { status: 400 });
    }

    const sadhak = await prisma.sadhak.findFirst({
        where: {
            AND: [
                { email: user?.email },
                { number: user?.number }
            ]
        }
    })
    const bookedCourses = await prisma.booking.findMany({
        where: {
            sadhakId: sadhak?.id
        }
    })
    const courseIds = bookedCourses.map((booking) => booking.courseId);
    

    const updatedToken = jwt.sign({ name: user?.name, email: user?.email, number: user?.number, bookedCourses: courseIds }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ name: user?.name, email: user?.email, number: user?.number, bookedCourses: courseIds }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '2d' });
    
    return NextResponse.json({ token: updatedToken, refreshToken }, { status: 200 });
}