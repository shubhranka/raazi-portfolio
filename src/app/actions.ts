import { Day, Slot } from "@prisma/client";

interface TimeSlot extends Slot {
    time: string
  }
  

export function handleCost(weekdays: number, weekends: number, sadhaks: number) {
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

export const calculatePrice = (slots: TimeSlot[]) => {
    if (slots.length === 0) {
        return 0;
    }
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