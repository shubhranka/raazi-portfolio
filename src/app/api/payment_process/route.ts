import { handleCost } from "@/app/actions";
import { Day, PrismaClient, Slot } from "@prisma/client";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const prisma = new PrismaClient();

interface TimeSlot extends Slot {
    time: string
    available: boolean
}


const calculatePrice = (slots: TimeSlot[]) => {
    if (slots[0].plan === "PRIVATE") {
        const weekdays = slots.filter(slot => !(slot.day === Day.SATURDAY || slot.day === Day.SUNDAY)).length;
        const weekends = slots.filter(slot => slot.day === Day.SATURDAY || slot.day === Day.SUNDAY).length;
        return handleCost(weekdays, weekends, 1);
    } else if (slots[0].day === Day.WEEKDAY) {
        return 1500;
    } else {
        return 600;
    }

}



async function getPaymentsLink(slots: TimeSlot[], name: string, email: string, phone: string) {
    const price = calculatePrice(slots)*100;

    const sadhak = await prisma.sadhak.create({
        data: {
            name,
            email,
            number: phone,
        }
    });
    const booking = await prisma.booking.create({
        data: {
            plan: slots[0].plan,
            slots: {
                connect: slots.map(slot => ({ id: slot.id }))
            },
            sadhak: {
                connect: {
                    id: sadhak.id
                }
            },
            status: "PENDING",
            payment_link: "",
            fees: price

        }
    })
    const reference_id = booking.id;
    const linkResponse = await getPaymentLinkReponse(price, reference_id, name, phone, email);
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
    const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID || "", key_secret: process.env.RAZORPAY_SECRET || "" });

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
    const { slots, name, email, phone } = await requestt.json();
    const link = await getPaymentsLink(slots, name, email, phone);
    return NextResponse.json({ link });
}