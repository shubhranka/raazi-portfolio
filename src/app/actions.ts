import { Day, PrismaClient, Slot } from "@prisma/client";
import axios from "axios";
import Razorpay from "razorpay";
const prisma = new PrismaClient();

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