import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { removeAttendeesFromEvent } from "@/app/actions";

const prisma = new PrismaClient();

export async function GET() {
    const bookings = await prisma.booking.findMany({
        where: {
            status: "PAID"
        }
    });
    for(const booking of bookings){
        const course = await prisma.course.findUnique({
            where: {
                id: booking.courseId
            }
        });
        const classesDone = booking.classesDone;
        const totalClasses = (course?.days?.length || 0) * (course?.period || 1) * 4;
        if (!classesDone || !totalClasses) {
            return NextResponse.json({"message":"Classes are not completed"}, {status: 200})
        }
        const sadhak = await prisma.sadhak.findUnique({
            where: {
                id: booking.sadhakId
            }
        });
        await prisma.booking.update({
            where: {
                id: booking.id
            },
            data: {
                status: "COMPLETED"
            }
        });
        await removeAttendeesFromEvent(course?.eventId!, [sadhak!.email]);
        return NextResponse.json({"message":"Classes are completed"}, {status: 200})
    }
}