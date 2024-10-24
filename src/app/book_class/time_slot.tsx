"use server"

import { Plan, PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

interface TimeSlotProps {
    // slots: TimeSlot[]
    plan: string
    sessionType: string
    day?: string | undefined
}
interface TimeSlot {
    time: string
    available: boolean
}

const generateTimeSlots = (start: number, end: number): TimeSlot[] => {
    const slots: TimeSlot[] = []
    for (let i = start; i < end; i++) {
        const meridian = i < 12 ? "AM" : "PM"
        const hour = i % 12 || 12
        slots.push({ time: `${hour}:00 ${meridian} - ${hour + 1}:00 ${meridian}`, available: true })
    }
    return slots
}


export default async function TimeSlot({plan, sessionType, day }: TimeSlotProps) {

    let slots;

    if (plan === 'group') {
        slots = await prisma.slot.findFirst({
            where: {
                plan: Plan.GROUP,
            }
        })
    } else {
        slots = generateTimeSlots(9, 17)
    }

    return (
        <>
        hi
        {/* <Label className="text-gray-700 mb-2 block">Time Slot</Label>
        <div className="grid grid-cols-3 gap-2">
          {groupType === 'weekday' ? (
            groupWeekdaySlots.map((slot) => (
              <Button
                key={slot.time}
                variant={selectedTime === slot.time ? "default" : "outline"}
                onClick={() => handleTimeSelection(slot.time)}
                disabled={!isTimeSlotAvailable(slot.time) || paymentStarted}
                className="w-full text-xs py-1"
              >
                {slot.time}
              </Button>
            ))
          ) : (
            groupWeekendSlots.map((slot) => (
              <Button
                key={slot.time}
                variant={selectedTime === slot.time ? "default" : "outline"}
                onClick={() => handleTimeSelection(slot.time)}
                disabled={!isTimeSlotAvailable(slot.time) || paymentStarted}
                className="w-full text-xs py-1"
              >
                {slot.time}
              </Button>
            ))
          )}
        </div> */}
        </>
    )

}