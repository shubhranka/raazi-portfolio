import { Day, PrismaClient, Slot } from "@prisma/client";
const prisma = new PrismaClient();


export async function GET (
    {params}: {params: Promise<{
        day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY"
    }>}
) {

    const {day} = await params;
    const slots = await prisma.slot.findMany({
        where: {
            day: Day[day],
            plan: "PRIVATE",
            available: true
        }
    });

    slots.sort((a, b) => a.from - b.from)

    return Response.json(generateTimeSlots(slots))
}

const generateTimeSlots = (slots: Slot[]) => {
    const timeSlots = slots.map(slot => {
        const meridian = slot.from < 12 ? "AM" : "PM"
        const hour = slot.from % 12 || 12
        return { time: `${hour}:00 ${meridian} - ${hour + 1}:00 ${meridian}`, available: true }
    })

    return timeSlots
}