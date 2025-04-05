import { Day, PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();
const prisma = new PrismaClient();

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
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      { algorithm: "RS256" }
    );
  
    const { data } = await axios.post("https://oauth2.googleapis.com/token", {
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: token,
    });
  
    return data.access_token;
  }
    

async function createGoogleMeetEvent({ summary  , days, from, to, period=1 }) {

  if(from.median === "PM" && from.hour !== "12") {
    from.hour = Number(from.hour) + 12;
  }
  if(to.median === "PM" && to.hour !== "12") {
    to.hour = Number(to.hour) + 12;
  }
    
  const dayArray = [Day.SUNDAY,Day.MONDAY, Day.TUESDAY, Day.WEDNESDAY, Day.THURSDAY, Day.FRIDAY, Day.SATURDAY];
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
          summary: summary,
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
          // attendees: [
          //     {
          //         email: email,
          //     },
          // ],
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
        [`RRULE:FREQ=WEEKLY;BYDAY=${days.map(day => day[0] + day[1]).join(',')};BYHOUR=${from.hour};BYMINUTE=${from.minute};`]

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
      return {hangoutLink: data.hangoutLink, eventId: data.id};
  } catch (error) {
      console.error("Error creating event:", error);
  } finally {
  }
}

const allEventsDeleter = async () => {
  const token = await getAccessToken();

  const { data } = await axios.get(
          "https://www.googleapis.com/calendar/v3/calendars/primary/events",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            params: { conferenceDataVersion: 1, sendUpdates: "all" },
          }
        );  

  for(const event of data.items) {
    const {data} = await axios.delete(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${event.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: { conferenceDataVersion: 1, sendUpdates: "all" },
      }
    );
    console.log(`Deleted event: ${event.summary}`);
    console.log("Waiting for 500ms...");
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log("Events deleted successfully");
}

const createMeetAndAddLink = async (course) => {
  const link = await createGoogleMeetEvent({
    summary: course.name,
    days: course.days,
    from: course.from,
    to: course.to,
  })
  await prisma.course.update({
    where: {
      id: course.id
    },
    data: {
      meetingLink: link.hangoutLink,
      eventId: link.eventId
    }
  })
  console.log(`Meeting link updated successfully for ${course.name}`);
}

async function removeAttendeesFromEvent(eventId, newEmails) {
  try {
    const token = await getAccessToken();
    const eventUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`;
    const { data: eventData } = await axios.get(eventUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const updatedAttendees = eventData.attendees.filter(
      (attendee) => !newEmails.includes(attendee.email)
    );
    const updatedEvent = {
      attendees: updatedAttendees,
    };
    const response = await axios.patch(eventUrl, updatedEvent, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(`Attendees removed successfully from event`);
  } catch (error) {
    console.error("Error removing attendees from event:", error);
  }
}

async function addAttendeesToEvent(eventId, newEmails) {
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

      console.log(`Attendees added successfully to event`);
  } catch (error) {
      console.error("Error adding attendees to event:", error);
  }
}
const main = async () => {
  const course = await prisma.course.findFirst({
    where:{
      name: "Regular"
    }
  });
  // await addAttendeesToEvent(course.eventId, ["shubhrankavarma@gmail.com"]);
  await removeAttendeesFromEvent(course.eventId, ["shubhrankavarma@gmail.com"]);
  
};

main();
// removeAttendeesFromEvent(course.eventId, ["shubhrankavarma@gmail.com"]);
// allEventsDeleter();

