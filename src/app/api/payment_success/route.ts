import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const prisma = new PrismaClient();

export async function POST(req: Request) {

  const { body } = await req.json();

  // Parse the incoming request body
  const { razorpay_payment_link_id } = body;

  const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID || "", key_secret: process.env.RAZORPAY_SECRET, headers: { 'Content-Type': 'application/json' } })

  const paymentInfo = await instance.paymentLink.fetch(razorpay_payment_link_id)
  const booking = await prisma.booking.findFirst({
    where: {
      payment_link: razorpay_payment_link_id as string
    }
  })

  // Step 2: Compare the generated signature with the provided one
  try {
    if (paymentInfo.status === 'paid') {
      // Verification succeeded
      return NextResponse.json({ success: true, message: 'Payment verified successfully', amount: paymentInfo.amount_paid, bookingId:booking!.id }, { status: 200 });
    } else {
      // Verification failed
      return NextResponse.json({ success: false, message: 'Payment verification failed' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}