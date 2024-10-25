"use server";

import { Day, Plan, PrismaClient, Slot } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
    request: Request,
  { params }: { params: Promise<{ day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY" }> }
) {
  const { day } = await params;

  console.log(day)

  // Fetch slots from the database where the day matches and slots are available
  const slots = await prisma.slot.findMany({
    where: {
      day: day as Day, // Use the enum directly
      plan: Plan.PRIVATE,
      available: true,
    },
  });

  // Sort the slots based on the 'from' time
  slots.sort((a, b) => a.from - b.from);

  // Generate time slots
  const timeSlots = generateTimeSlots(slots);

  // Return JSON response using NextResponse
  return NextResponse.json(timeSlots);
}

// Helper function to generate readable time slots
const generateTimeSlots = (slots: Slot[]) => {
  const timeSlots = slots.map(slot => {
    const meridian = slot.from < 12 ? "AM" : "PM";
    const hour = slot.from % 12 || 12;
    return {
        ...slot,
        time: `${hour}:00 ${meridian} - ${hour + 1}:00 ${meridian}`,
    }
  });

  return timeSlots;
};
