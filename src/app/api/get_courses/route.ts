import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET() {
  const courses = await prisma.course.findMany({
    orderBy: {
        price: "desc"
    }
  });
  return new Response(JSON.stringify(courses));
}