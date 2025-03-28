import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const prisma = new PrismaClient();

async function getPaymentsLink(courseId: string, phone: string) {

    const course = await prisma.course.findUnique({
        where: {
            id: courseId
        }
    })
    if (!course) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }
    const sadhak = await prisma.sadhak.findFirst({
        where: {
            number: phone
        }
    });
    if (!sadhak) {
        return NextResponse.json({ error: "Sadhak not found" }, { status: 404 })
    }
    const existingBooking = await prisma.booking.findFirst({
        where: {
            course: {
                id: course.id
            },
            sadhak: {
                id: sadhak.id
            }
        }
    })
    if (existingBooking) {
        return NextResponse.json({ error: "You have already booked this course" }, { status: 409 })
    }
    const booking = await prisma.booking.create({
        data: {
            course: {
                connect: {
                    id: course!.id
                }
            },
            sadhak: {
                connect: {
                    id: sadhak!.id
                }
            },
            status: "PENDING"
        }
    })
    const reference_id = booking.id;
    const linkResponse = await getPaymentLinkReponse(course.price*100, reference_id, course.name, phone, sadhak.email);
    await prisma.booking.update({
        where: {
            id: booking.id
        },
        data: {
            payment_link: linkResponse.id
        }
    });
    return linkResponse.short_url;

}

const getPaymentLinkReponse = async (amount: number, reference_id: string, name: string, phone: string, email: string) => {
    const data = makeData(amount, reference_id, name, phone, email, process.env.CALLBACK_URL || "");
    const instance = new Razorpay({ key_id: process.env.RAZ_KEY_ID || "", key_secret: process.env.RAZ_KEY_SECRET || "" });

    const response = await instance.paymentLink.create(data)
    return response;
}

const makeData = (amount: number, reference_id: string, name: string, phone: string, email: string, callback_url: string) => ({
    "amount": amount,
    "currency": "INR",
    "accept_partial": false,
    "reference_id": reference_id,
    "description": "Fees for the course",
    "customer": {
        "name": name,
        "contact": phone,
        "email": email,
    },
    "callback_url": callback_url,
    "callback_method": "get",
    "expire_by": Date.now() + 300000
});

export async function POST(
    requestt: Request,
) {
    const { phone, courseId } = await requestt.json();
    const link = await getPaymentsLink(courseId, phone);
    return NextResponse.json({ link });
}