import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  let courses = await prisma.course.findMany();
  
  courses.forEach((course) => {
    course.from.minute = course.from.minute.toString().split(' ')[0];
    course.to.minute = course.to.minute.toString().split(' ')[0];
    course.to.hour = course.to.hour.toString().trim();
    course.to.median = course.from.median
  });
  
  // console.log(courses);
  courses.forEach(async (course) => {
    await prisma.course.update({
      where: {
        id: course.id
      },
      data: {
        // from: {
        //   hour: Number(course.from.hour),
        //   minute: Number(course.from.minute),
        //   second: 0,
        //   median: course.from.median,
        // },
        // to: {
        //   hour: Number(course.to.hour),
        //   minute: Number(course.to.minute),
        //   median: course.to.median,
        //   second: 0
        // }
        from: course.from,
        to: course.to
      }
    })
  })
};

main();
