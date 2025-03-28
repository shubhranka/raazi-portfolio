import {
  addAttendeesToEvent,
  createGoogleMeetEvent,
  sendWelcomeEmail,
} from "@/app/actions";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { body } = await req.json();

    // Parse the incoming request body
    const { razorpay_payment_link_id } = body;

    const instance = new Razorpay({
      key_id: process.env.RAZ_KEY_ID || "",
      key_secret: process.env.RAZ_KEY_SECRET,
      headers: { "Content-Type": "application/json" },
    });

    const paymentInfo = await instance.paymentLink.fetch(
      razorpay_payment_link_id
    );

    if (!paymentInfo) {
      return NextResponse.json(
        { success: false, message: "Payment not found" },
        { status: 404 }
      );
    }

    const booking = await prisma.booking.findFirst({
      where: {
        payment_link: razorpay_payment_link_id as string,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.status !== "PENDING") {
      return NextResponse.json(
        { success: false, message: "Payment not created" },
        { status: 400 }
      );
    }

    if (paymentInfo.status === "paid") {
      if (true) {
      //   await prisma.booking.update({
      //     where: {
      //       id: booking!.id,
      //     },
      //     data: {
      //       status: "PAID",
      //     },
      //   });
      //   const slots = await prisma.slot.findMany({
      //     where: {
      //       bookingId: booking!.id,
      //     },
      //   });
      //   const gmeetEventId = await prisma.groupMeetingLink.findFirst({
      //     where: {
      //       slotId: slots[0].id,
      //     },
      //   });
      //   const sadhak = await prisma.sadhak.findFirst({
      //     where: {
      //       id: booking!.sadhakId,
      //     },
      //   });

      //   const gmeetLink = await addAttendeesToEvent(gmeetEventId!.eventId, [
      //     sadhak!.email,
      //   ]);
      //   await sendWelcomeEmail(sadhak!.email, sadhak!.name, gmeetLink);

      //   return NextResponse.json(
      //     {
      //       success: true,
      //       message: "Payment verified successfully",
      //       amount: paymentInfo.amount_paid,
      //       bookingId: booking!.id,
      //     },
      //     { status: 200 }
      //   );
      // } else {
      //   await prisma.slot.updateMany({
      //     where: {
      //       bookingId: booking!.id,
      //       plan: Plan.PRIVATE,
      //     },
      //     data: {
      //       available: false,
      //     },
      //   });

      //   const slots = await prisma.slot.findMany({
      //     where: {
      //       bookingId: booking!.id,
      //       plan: Plan.PRIVATE,
      //     },
      //   });

        const sadhak = await prisma.sadhak.findFirst({
          where: {
            id: booking!.sadhakId,
          },
        });
        const course = await prisma.course.findFirst({
          where: {
            id: booking!.courseId,
          },
        });
        // Create a gmeet link
        const gmeetLink = await createGoogleMeetEvent({
          email: sadhak!.email,
          days: course!.days,
          from: course!.from,
          to: course!.to
        });
        // Send Welcome Email
        await sendWelcomeEmail(sadhak!.email, sadhak!.name, gmeetLink);
        // and whatsapp
        // Verification succeeded

        await prisma.booking.update({
          where: {
            id: booking!.id,
          },
          data: {
            status: "PAID",
          },
        });
      }

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
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
