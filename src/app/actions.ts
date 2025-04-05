import { Day, Time } from "@prisma/client";
import jwt from "jsonwebtoken";
import axios from "axios";
  

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

// export const calculatePrice = (slots: TimeSlot[]) => {
//     if (slots.length === 0) {
//         return 0;
//     }
//     if (slots[0].plan === "PRIVATE") {
//         const weekdays = slots.filter(slot => !(slot.day === Day.SATURDAY || slot.day === Day.SUNDAY)).length;
//         const weekends = slots.filter(slot => slot.day === Day.SATURDAY || slot.day === Day.SUNDAY).length;
//         return handleCost(weekdays, weekends, 1);
//     } else if (slots[0].day === Day.WEEKDAY) {
//         return 1500;
//     } else {
//         return 600;
//     }

// }

export async function createGoogleMeetEvent({ email, days, from, to, period=1 }: { email: string, days: Day[], from: Time, to: Time, period?: number }) {
    
    const dayArray: Day[] = [Day.MONDAY, Day.TUESDAY, Day.WEDNESDAY, Day.THURSDAY, Day.FRIDAY, Day.SATURDAY, Day.SUNDAY];
    try {
        const token = await getAccessToken();

        let startDay = new Date();
        // let currentDaySlot = days.find(
        //     (day) => day === days[startDay.getDay()]
        // );
        // while (!currentDaySlot) {
        //     startDay.setDate(startDay.getDate() + 1);
        //     currentDaySlot = days.find(
        //         (day) => day === days[startDay.getDay()]
        //     );
        // }
        while(!days.includes(dayArray[startDay.getDay()])) {
            startDay.setDate(startDay.getDate() + 1);
        }

        const startDateTime = new Date(startDay);
        startDateTime.setHours(Number(from.hour), Number(from.minute), 0, 0);

        const endDateTime = new Date(startDay);
        endDateTime.setHours(Number(to.hour), Number(to.minute), 0, 0);

        const event = {
            summary: "Welcome to Your Monthly Yoga Journey!",
            location: "Online",
            description:
                "Congratulations on starting your yoga sessions! This is your meeting to kickstart a journey towards a healthier and more balanced life. We are excited to have you with us!",
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
            recurrence: 
          [`RRULE:FREQ=WEEKLY;BYDAY=${days.map(day => day[0] + day[1]).join(',')};BYHOUR=${from.hour};BYMINUTE=${from.minute};COUNT=${period*4}`]

        };
        const { data } = await axios.post(
            "https://www.googleapis.com/calendar/v3/calendars/primary/events",
            event,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              params: { conferenceDataVersion: 1, sendUpdates: "all" },
            }
          );
        return data.hangoutLink;
    } catch (error) {
        console.error("Error creating event:", error);
    } finally {

    }
}

export async function sendWelcomeEmail (email : string, name:string, meetingLink:string, from: Time) {
    try {

        const token = await getAccessToken();

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
            <p>Date: 2024-11-07<br>Time: ${from.hour}:${from.minute} AM IST<br>Location: Online (Google Meet link: ${meetingLink})</p>
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
        await axios.post(
            "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
            { raw: base64EncodedEmail },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

export async function addAttendeesToEvent(eventId: string, newEmails: string[]) {
    try {
        const token = await getAccessToken();

        // // 1. Fetch the existing event details
        // const eventUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`;
        // const { data: eventData } = await axios.get(eventUrl, {
        //     headers: {
        //         Authorization: `Bearer ${token}`,
        //     },
        // });

        // 2. Add new attendees to the existing list of attendees
        const updatedAttendees = [
            // ...eventData.attendees,  // Existing attendees
            ...newEmails.map((email) => ({ email, responseStatus: "accepted" }))  // New attendees
        ];

        // 3. Update the event with the new list of attendees
        const updatedEvent = {
            // ...eventData,
            attendees: updatedAttendees,
        };

        const updateUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`;
        const response = await axios.patch(updateUrl, updatedEvent, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        return response.data.hangoutLink;
    } catch (error) {
        console.error("Error adding attendees to event:", error);
    }
}

// Function to send email notification to new attendee
export async function sendEmailNotification(email:string, meetingLink: string) {
    try {
        const token = await getAccessToken();

        // Prepare email content
        const emailContent = [
            'From: "RaaziYog" <founder@raaziyog.com>',
            `To: ${email}`,
            "Subject: You're Invited to a Yoga Class!",
            'Content-Type: text/html; charset="UTF-8"',
            "",
            `<!DOCTYPE html>
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
                    .footer {
                        font-size: 14px;
                        color: #777;
                        text-align: left;
                    }
                    .footer p {
                        margin: 5px 0;
                    }
                </style>
            </head>
            <body>
                <div class="header">You're Invited to a Yoga Class with RaaziYog!</div>
                <div class="content">
                    <p>Dear Participant,</p>
                    <p>We are excited to have you join our Yoga sessions with RaaziYog. Your session has been scheduled online, and we are thrilled to have you with us!</p>
                    <p>Here are the details for your upcoming class:</p>
                    <p><strong>Join via Google Meet:</strong> <a href="${meetingLink}">${meetingLink}</a></p>
                    <p>Please make sure to join the session on time. If you have any questions, feel free to reach out to us.</p>
                </div>
                <div class="footer">
                    <p>Warm regards,<br>The RaaziYog Team</p>
                </div>
            </body>
            </html>`,
        ].join("\n");

        // Properly encode the email for Gmail API
        const base64EncodedEmail = Buffer.from(emailContent)
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");

        // Send the email
        await axios.post(
            "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
            { raw: base64EncodedEmail },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error) {
        console.error("Error sending email notification:", error);
    }
}

const getAccessToken = async () => {
// Helper function to get an access token
  const token = jwt.sign(
    {
      iss: process.env.GOOGLE_CLIENT_EMAIL,
      scope: "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/gmail.send",
      sub: "founder@raaziyog.com",
      aud: "https://oauth2.googleapis.com/token",
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
      iat: Math.floor(Date.now() / 1000),
    },
    process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    { algorithm: "RS256" }
  );

  const { data } = await axios.post("https://oauth2.googleapis.com/token", {
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: token,
  });

  return data.access_token;
}

    