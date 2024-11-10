import { Day, Slot } from "@prisma/client";
import { google } from 'googleapis';
import { createClient } from 'redis';
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

export async function createGoogleMeetEvent({ email, slots }: { email: string, slots: Slot[] }) {
    // Path to your service account JSON file
    const redis_url = process.env.REDIS_URL;

    const client = createClient({
        url: redis_url,
    });

    const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

    // client.on('error', err => console.log('Redis Client Error', err));
    try {
        await client.connect();

        const value = await client.get("service-json");

        // Authenticate using the service account
        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(value!),
            scopes: [
                "https://www.googleapis.com/auth/calendar",
                "https://www.googleapis.com/auth/gmail.send",
            ],
            clientOptions: {
                subject: "founder@raaziyog.com", // Replace with the email of the user to impersonate
            },
        });

        const calendar = google.calendar({ version: "v3", auth });

        let startDay = new Date();
        let currentDaySlot = slots.find(
            (slot) => slot.day === days[startDay.getDay()]
        );
        while (!currentDaySlot) {
            startDay.setDate(startDay.getDate() + 1);
            currentDaySlot = slots.find(
                (slot) => slot.day === days[startDay.getDay()]
            );
        }


        const startDateTime = startDay;
        startDateTime.setHours(currentDaySlot.from, 0, 0, 0);

        const endDateTime = startDay;
        endDateTime.setHours(currentDaySlot.from+1, 0, 0, 0);

        const event = {
            summary: "Welcome to Your Monthly Yoga Journey!",
            location: "Online",
            description:
                "Congratulations on starting your yoga sessions! This is your first meeting to kickstart a journey towards a healthier and more balanced life. We are excited to have you with us!",
            start: {
                dateTime: startDateTime.toISOString(), // Set your desired start time here
                timeZone: "Asia/Kolkata", // Use 'Asia/Kolkata' for IST
            },
            end: {
                dateTime: endDateTime.toISOString(), // Set your desired end time here
                timeZone: "Asia/Kolkata", // Use 'Asia/Kolkata' for IST
            },
            visibility: "default", // Make the event private
            attendees: [
                {
                    email: email,
                },
            ],
            conferenceData: {
                createRequest: {
                    requestId: `sample-${Date.now()}`,
                    conferenceSolutionKey: {
                        type: "hangoutsMeet",
                    },
                    status: {
                        statusCode: "success",
                    },
                },
            },
            recurrence: slots
                .map(
                    (slot) =>
                        `RRULE:FREQ=WEEKLY;COUNT=4;BYDAY=${slot.day[0] + slot.day[1]};BYHOUR=${slot.from};BYMINUTE=0`
                )

        };

        // Insert the event into the user's primary calendar
        const response = await (calendar as any).events.insert({
            calendarId: "primary",
            resource: event,
            conferenceDataVersion: 1,
            sendUpdates: "all",
        });
        return response.data.hangoutLink;
    } catch (error) {
        console.error("Error creating event:", error);
    } finally {
        // Ensure Redis client disconnects properly to exit the process
        await client.disconnect();
        console.log("Redis connection closed. Exiting...");
        //  process.exit(0); // Explicitly exit the process
    }
}

export async function sendWelcomeEmail (email : string, name:string, meetingLink:string) {
    try {
        const redis_url = process.env.REDIS_URL;

        const client = createClient({
            url: redis_url,
        });
        await client.connect();

        const value = await client.get("service-json");
        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(value!),
            scopes: [
                "https://www.googleapis.com/auth/calendar",
                "https://www.googleapis.com/auth/gmail.send",
            ],
            clientOptions: {
                subject: "founder@raaziyog.com", // Replace with the email of the user to impersonate
            },
        });
        const gmail = google.gmail({ version: "v1", auth });

        const emailContent = [
            'From: "RaaziYog" <founder@raaziyog.com>',
            `To: ${email}`,
            "Subject: Welcome to Your Monthly Yoga Journey with RaaziYog!",
            'Content-Type: text/html; charset="UTF-8"',
            "",
            `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                background-color: #f4f4f4;
                padding: 20px;
                margin: 0;
            }
            .header {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #333;
                text-align: left;
            }
            .content {
                margin-bottom: 20px;
                color: #555;
                text-align: left;
            }
            .content p {
                margin: 10px 0;
            }
            .content ul {
                padding-left: 20px;
            }
            .content ul li {
                margin-bottom: 10px;
            }
            .footer {
                font-size: 14px;
                color: #777;
                text-align: left;
            }
            .footer p {
                margin: 5px 0;
            }
            .footer a {
                color: #1a73e8;
                text-decoration: none;
            }
            .footer a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="header">Welcome to Your Yoga Journey with RaaziYog!</div>
        <div class="content">
            <p>Dear ${name},</p>
            <p>Congratulations on starting your yoga sessions with RaaziYog! We are thrilled to have you join our community and embark on this journey towards a healthier and more balanced life.</p>
            <p>Our classes, led by Ms. Abhishita Varma, an internationally certified Yoga Instructor and esteemed National Yoga Player, are designed to harmonize your mind, body, and spirit. With a deep expertise in Ashtanga Yoga and a commitment to wellness, Abhishita has dedicated herself to helping individuals achieve their fitness and wellness goals.</p>
            <p>Here’s what you can expect from your sessions:</p>
            <ul>
                <li>A blend of asanas, kriyas, pranayama, relaxation techniques, and valuable health and diet tips.</li>
                <li>Classes offered from Monday to Sunday, ensuring a holistic approach to yoga.</li>
                <li>A supportive and inspiring environment, whether you're a beginner or an experienced practitioner.</li>
            </ul>
            <p>Your first session is scheduled for:</p>
            <p>Date: 2024-11-07<br>Time: 10:00 AM IST<br>Location: Online (Google Meet link: ${meetingLink})</p>
            <p>Please make sure to join the session on time and have a comfortable space ready for your practice. If you have any questions or need further assistance, feel free to reach out to us at founder@raaziyog.com or +91 93993 28872.</p>
            <p>We look forward to seeing you in class and supporting you on your yoga journey!</p>
        </div>
        <div class="footer">
            <p>Warm regards,<br>The RaaziYog Team</p>
            <p>Follow us on:</p>
            <p><a href="https://youtube.com/@raaziyog12">YouTube</a> | <a href="https://www.instagram.com/raaziyog">Instagram</a></p>
        </div>
    </body>
    </html>
    `,
        ].join("\n");
        // Properly encode the email for Gmail API
        const base64EncodedEmail = Buffer.from(emailContent)
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");

        // Send the email
        await gmail.users.messages.send({
            userId: "me",
            requestBody: {
                raw: base64EncodedEmail,
            },
        });
    } catch (error) {
        console.error("Error sending email:", error);
    }
};
