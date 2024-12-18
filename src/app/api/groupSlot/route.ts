export const dynamic = 'force-static'
import { Day, Plan, PrismaClient, Slot } from "@prisma/client"


const generateTimeSlots = (slots: Slot[]) => {
    const timeSlots = slots.map(slot => {
        const meridian = slot.from < 12 ? "AM" : "PM"
        const hour = slot.from % 12 || 12
        return {
            ...slot,
            time: `${hour}:00 ${meridian} - ${hour + 1}:00 ${meridian}`,
        }
    })

    return timeSlots
}

const prisma = new PrismaClient()


export async function GET() {

    const slotWeekday = await prisma.slot.findMany({
        where: {
            plan: Plan.GROUP,
            day: Day.WEEKDAY
        }
    })

    const slotWeekend = await prisma.slot.findMany({
        where: {
            plan: Plan.GROUP,
            day: Day.WEEKEND
        }
    })

    // sort the slots by from
    slotWeekday.sort((a, b) => a.from - b.from)
    slotWeekend.sort((a, b) => a.from - b.from)


    return Response.json({
        weekdaySlots: generateTimeSlots(slotWeekday),
        weekendSlots: generateTimeSlots(slotWeekend)
    })
}