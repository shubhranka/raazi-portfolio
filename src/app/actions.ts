import { Day, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface TimeSlot {
    time: string
    available: boolean
}


export async function handleCost(weekdays: number, weekends: number, sadhaks: number) {
    const days = weekdays + weekends
    let price = 0;
    const oneWeekendCharge = 250;
    const twoWeekendCharge = 400;
    switch (days) {
        case 1: price = 2000; break;
        case 2: price = 3500; break;
        case 3: price = 4500; break;
        case 4: price = 5000; break;
        case 5: price = 5500; break;
        case 6: price = 6000; break;
        case 7: price = 6500; break
    }
    price += oneWeekendCharge * weekends + twoWeekendCharge * Math.floor(weekends / 2);
    price = (Math.ceil(sadhaks / 2) + 1) / (sadhaks + 1) * price;
    return price;
}

export const generateGroupSlots = async (weekend: boolean) => {
    const slots = await prisma.slot.findMany({
        where: {
            day: (weekend ? {
                notIn: [Day.SATURDAY, Day.SUNDAY]
            } : {
                in: [Day.SATURDAY, Day.SUNDAY]
            })
        }
    })

    const from = slots[0].from
    const to = slots[0].to
    return generateTimeSlots(from, to)
}

export const generateTimeSlots = (start: number, end: number): TimeSlot[] => {
    const slots: TimeSlot[] = []
    for (let i = start; i < end; i++) {
        const meridian = i < 12 ? "AM" : "PM"
        const hour = i % 12 || 12
        slots.push({ time: `${hour}:00 ${meridian} - ${hour + 1}:00 ${meridian}`, available: true })
    }
    return slots
}
