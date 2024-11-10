import { createGoogleMeetEvent, sendWelcomeEmail } from "@/app/actions";
import { Booking, Plan, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { body } = await req.json();

    // Parse the incoming request body
    const { razorpay_payment_link_id } = body;

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "",
      key_secret: process.env.RAZORPAY_SECRET,
      headers: { "Content-Type": "application/json" },
    });

    const paymentInfo = await instance.paymentLink.fetch(
      razorpay_payment_link_id
    );
    const booking = await prisma.booking.findFirst({
      where: {
        payment_link: razorpay_payment_link_id as string,
      },
    });
    
    if (paymentInfo.status === "paid") {
    await prisma.slot.updateMany({
      where: {
        bookingId: booking!.id,
        plan: Plan.PRIVATE,
      },
      data: {
        available: false,
      },
    });

    const slots = await prisma.slot.findMany({
      where: {
        bookingId: booking!.id,
        plan: Plan.PRIVATE,
      },
    });

    const sadhak = await prisma.sadhak.findFirst({
      where: {
        id: booking!.sadhakId,
      },
    });

        // Create a gmeet link
        const gmeetLink = await createGoogleMeetEvent({
          email: sadhak!.email,
          slots
        });
        // Send Welcome Email
        await sendWelcomeEmail(
          sadhak!.email,
          sadhak!.name,
          gmeetLink
        );
      // and whatsapp
      // Verification succeeded
      return NextResponse.json(
        {
          success: true,
          message: "Payment verified successfully",
          amount: paymentInfo.amount_paid,
          bookingId: booking!.id,
        },
        { status: 200 }
      );
    } else {
      // Verification failed
      return NextResponse.json(
        { success: false, message: "Payment verification failed" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
